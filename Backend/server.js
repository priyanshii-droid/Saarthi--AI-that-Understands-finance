const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const { runSaarthi } = require('./ai/agent');

const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

const sessions = new Map();
function getState(req){ const id=String(req.headers['x-saarthi-session']||'default'); if(!sessions.has(id)) sessions.set(id,{transactions:[],problem:'',source:'none',filename:'',context:null,history:[]}); return sessions.get(id); }

const demoTransactions = [
  {date:'2026-09-10', merchant:'Swiggy', category:'Food', amount:-420},
  {date:'2026-09-09', merchant:'Amazon', category:'Shopping', amount:-1299},
  {date:'2026-09-08', merchant:'Uber', category:'Transport', amount:-280},
  {date:'2026-09-07', merchant:'Electricity Bill', category:'Bills', amount:-1800},
  {date:'2026-09-06', merchant:'Salary Credit', category:'Income', amount:52000},
  {date:'2026-09-05', merchant:'BigBasket', category:'Food', amount:-980},
  {date:'2026-09-03', merchant:'Netflix', category:'Subscriptions', amount:-649},
  {date:'2026-09-02', merchant:'Myntra', category:'Shopping', amount:-1901},
  {date:'2026-09-01', merchant:'Metro', category:'Transport', amount:-540}
];

function money(n){ return `₹${Math.round(Number(n)||0).toLocaleString('en-IN')}`; }
function cleanHeader(v){ return String(v||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); }
function parseNumber(v){
  if(typeof v==='number' && Number.isFinite(v)) return v;
  let s=String(v??'').trim(); if(!s) return NaN;
  const neg=/^\(.*\)$/.test(s) || /^-/.test(s);
  s=s.replace(/[₹,$,%\s]/g,'').replace(/[()]/g,'');
  const n=Number(s); return Number.isFinite(n) ? (neg ? -Math.abs(n) : n) : NaN;
}
function guessCategory(text=''){
  const s=text.toLowerCase();
  if(/salary|income|credit|freelance|bonus|payroll|stipend/.test(s)) return 'Income';
  if(/rent|housing|landlord/.test(s)) return 'Housing';
  if(/food|swiggy|zomato|restaurant|grocery|bigbasket|blinkit|zepto/.test(s)) return 'Food';
  if(/amazon|myntra|flipkart|shopping|clothes|electronics|laptop|phone/.test(s)) return 'Shopping';
  if(/uber|ola|metro|bus|fuel|petrol|transport|travel/.test(s)) return 'Transport';
  if(/electric|bill|utility|recharge|mobile|internet|wifi|netflix|spotify|subscription/.test(s)) return /netflix|spotify|subscription/.test(s)?'Subscriptions':'Bills';
  if(/medical|doctor|pharmacy|health/.test(s)) return 'Health';
  if(/school|college|education|course|fee/.test(s)) return 'Education';
  return 'Other';
}
function normalizeRows(rows){
  if(!Array.isArray(rows)) return [];
  const out=[];
  for(const r of rows){
    if(!r || typeof r!=='object') continue;
    const keys=Object.keys(r); const norm={}; keys.forEach(k=>norm[cleanHeader(k)]=r[k]);
    const date=norm.date||norm.transaction_date||norm.datetime||norm.time||'';
    const desc=norm.description||norm.merchant||norm.payee||norm.name||norm.particulars||norm.narration||'';
    let amount=NaN;
    for(const k of ['amount','transaction_amount','value','debit_credit','net','total']) if(Number.isFinite(parseNumber(norm[k]))) {amount=parseNumber(norm[k]);break;}
    if(!Number.isFinite(amount)){
      const debit=parseNumber(norm.debit||norm.withdrawal||norm.expense||norm.debits);
      const credit=parseNumber(norm.credit||norm.deposit||norm.income||norm.credits);
      if(Number.isFinite(debit)||Number.isFinite(credit)) amount=(Number.isFinite(credit)?Math.abs(credit):0)-(Number.isFinite(debit)?Math.abs(debit):0);
    }
    if(!Number.isFinite(amount)) continue;
    let category=norm.category||norm.type||norm.classification||'';
    category=String(category||'').trim() || guessCategory(`${desc} ${category}`);
    out.push({date:String(date||'').slice(0,30),merchant:String(desc||category||'Transaction').slice(0,100),category:String(category).slice(0,60),amount});
  }
  return out;
}
function parseText(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const rows=[];
  for(const line of lines){
    const parts=line.includes('\t')?line.split('\t'):line.split(',');
    if(parts.length>=2){
      const vals=parts.map(x=>x.trim());
      const amountIndex=vals.findIndex(x=>Number.isFinite(parseNumber(x)) && /[0-9]/.test(x));
      if(amountIndex>=0){ const desc=vals.filter((_,i)=>i!==amountIndex).join(' '); rows.push({date:vals.find(x=>/^\d{4}[-\/]\d{1,2}/.test(x))||'',merchant:desc,category:guessCategory(desc),amount:parseNumber(vals[amountIndex])}); }
    }
  }
  if(rows.length) return rows;
  const regex=/(salary|rent|food|shopping|travel|transport|bill|subscription|income|expense|saving|other)[^\d₹-]*₹?\s*([\d,]+(?:\.\d+)?)/ig;
  let m; while((m=regex.exec(text))) rows.push({date:'',merchant:m[1],category:guessCategory(m[1]),amount:/income|salary/.test(m[1].toLowerCase())?parseNumber(m[2]):-parseNumber(m[2])});
  return rows;
}
function inferGoal(problem){
  const s=String(problem||'');
  const amounts=[...s.matchAll(/₹?\s*([\d,]+(?:\.\d+)?)/g)].map(m=>Number(m[1].replace(/,/g,'')));
  const monthly=/month|monthly/i.test(s), yearly=/year|yearly|annual/i.test(s);
  let target=null, horizon=null;
  const save=s.match(/save\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i); if(save) target=Number(save[1].replace(/,/g,''));
  const months=s.match(/(?:in|within|over)\s*(\d+)\s*months?/i); if(months) horizon=Number(months[1]);
  return {raw:s,amounts,monthly,yearly,target,horizon};
}
function auditTransactions(transactions){
  const issues=[];
  const seen=new Map();
  const monthlyCat={};
  const dated=transactions.filter(t=>t.date);
  for(const t of transactions){
    const key=`${String(t.date).slice(0,10)}|${t.merchant.toLowerCase()}|${Math.round(Math.abs(t.amount)*100)}`;
    if(seen.has(key)) issues.push({severity:'high',type:'duplicate',title:'Possible duplicate transaction',text:`${t.merchant} appears more than once with the same date and amount (${money(Math.abs(t.amount))}).`,confidence:96,transaction:t});
    else seen.set(key,t);
    const month=/^\d{4}[-\/]\d{1,2}/.test(t.date)?t.date.slice(0,7):'Unspecified';
    const cat=t.category||'Other'; monthlyCat[`${month}|${cat}`]=(monthlyCat[`${month}|${cat}`]||0)+Math.abs(t.amount);
  }
  const values=transactions.filter(t=>t.amount<0).map(t=>Math.abs(t.amount));
  if(values.length>=8){
    const sorted=[...values].sort((a,b)=>a-b); const median=sorted[Math.floor(sorted.length/2)];
    const threshold=Math.max(median*3, (sorted[sorted.length-1]||0)*0.55);
    transactions.filter(t=>t.amount<0 && Math.abs(t.amount)>=threshold).slice(0,8).forEach(t=>issues.push({severity:'medium',type:'anomaly',title:'Unusually large expense',text:`${t.merchant} at ${money(Math.abs(t.amount))} is much larger than your typical expense size.`,confidence:84,transaction:t}));
  }
  const merchantAmounts={};
  transactions.filter(t=>t.amount<0).forEach(t=>{const k=t.merchant.toLowerCase();merchantAmounts[k]??=[];merchantAmounts[k].push(Math.abs(t.amount));});
  const recurring=[];
  Object.entries(merchantAmounts).forEach(([merchant,arr])=>{if(arr.length>=3){const avg=arr.reduce((a,b)=>a+b,0)/arr.length;const stable=arr.every(v=>Math.abs(v-avg)/Math.max(avg,1)<0.15);if(stable) recurring.push({merchant,occurrences:arr.length,averageAmount:Math.round(avg)});}});
  if(recurring.length) issues.push({severity:'low',type:'recurring',title:`${recurring.length} recurring payment pattern${recurring.length>1?'s':''} detected`,text:recurring.slice(0,4).map(x=>`${x.merchant} ~ ${money(x.averageAmount)}`).join(' · '),confidence:88});
  const uncategorized=transactions.filter(t=>!t.category||t.category==='Other').length;
  if(uncategorized) issues.push({severity:'medium',type:'data_quality',title:`${uncategorized} transaction${uncategorized>1?'s':''} need category review`,text:'These rows were placed in Other because their category could not be identified confidently.',confidence:76});
  const dates=dated.map(t=>new Date(t.date)).filter(d=>!isNaN(d)).sort((a,b)=>a-b);
  let coverage='Limited'; if(dates.length){const days=Math.max(1,(dates.at(-1)-dates[0])/86400000);coverage=days>=180?'Strong':days>=60?'Good':'Limited';}
  return {issues:issues.slice(0,15),duplicates:issues.filter(x=>x.type==='duplicate').length,anomalies:issues.filter(x=>x.type==='anomaly').length,recurring,uncategorized,coverage,reviewCount:issues.filter(x=>x.severity!=='low').length};
}
function analyze(transactions, problem=''){
  const expenses=transactions.filter(t=>t.amount<0).map(t=>({...t,abs:Math.abs(t.amount)}));
  const income=transactions.filter(t=>t.amount>0);
  const totalExpenses=expenses.reduce((a,t)=>a+t.abs,0), totalIncome=income.reduce((a,t)=>a+t.amount,0);
  const categories={}; expenses.forEach(t=>categories[t.category]=(categories[t.category]||0)+t.abs);
  const cats=Object.entries(categories).map(([category,amount])=>({category,amount})).sort((a,b)=>b.amount-a.amount);
  const merchants={}; expenses.forEach(t=>merchants[t.merchant]=(merchants[t.merchant]||0)+t.abs);
  const topMerchants=Object.entries(merchants).map(([merchant,amount])=>({merchant,amount})).sort((a,b)=>b.amount-a.amount).slice(0,7);
  const monthly={}; [...transactions].forEach(t=>{const m=/^\d{4}[-\/]\d{1,2}/.test(t.date)?t.date.slice(0,7):'Unspecified'; monthly[m]??={income:0,expenses:0}; if(t.amount>0)monthly[m].income+=t.amount;else monthly[m].expenses+=Math.abs(t.amount);});
  const monthlyData=Object.entries(monthly).filter(([m])=>m!=='Unspecified').sort().map(([month,v])=>({...v,month,savings:v.income-v.expenses}));
  const netSavings=totalIncome-totalExpenses, savingsRate=totalIncome?netSavings/totalIncome*100:0;
  const discretionary=['Shopping','Food','Entertainment','Subscriptions','Other','Travel','Transport'].map(c=>({category:c,amount:categories[c]||0})).filter(x=>x.amount>0).sort((a,b)=>b.amount-a.amount);
  const potential=discretionary.reduce((a,x)=>a+x.amount*(x.category==='Shopping'?.2:x.category==='Food'?.15:.1),0);
  const goal=inferGoal(problem);
  let targetGap=null, requiredMonthly=null;
  if(goal.target){ requiredMonthly=goal.horizon?goal.target/goal.horizon:goal.target; targetGap=Math.max(0,requiredMonthly-netSavings); }
  const fixedCats=['Housing','Bills','Subscriptions','Education','Health']; const fixed=expenses.filter(t=>fixedCats.includes(t.category)).reduce((a,t)=>a+t.abs,0);
  const score=Math.max(0,Math.min(100,Math.round(55+savingsRate*.8-(totalIncome&&fixed/totalIncome>0.6?10:0)+(savingsRate>=20?10:0))));
  const insights=[];
  if(totalIncome===0) insights.push({type:'data_gap',title:'Income is not clearly identified',text:'I can analyze expenses, but affordability and savings advice will be stronger once income is provided.'});
  if(cats[0]) insights.push({type:'pattern',title:`${cats[0].category} is your largest expense`,text:`${money(cats[0].amount)} goes to ${cats[0].category}, or ${totalExpenses?Math.round(cats[0].amount/totalExpenses*100):0}% of detected expenses.`});
  if(discretionary[0]) insights.push({type:'opportunity',title:`Your biggest flexible lever is ${discretionary[0].category}`,text:`A 10% reduction here would free about ${money(discretionary[0].amount*.1)} per detected period.`});
  if(goal.target){ insights.push({type:'goal',title:'Saarthi found a target to work toward',text:`${money(goal.target)}${goal.horizon?` over ${goal.horizon} months`:''} requires about ${money(requiredMonthly)} per month.`}); }
  let recommendation='Upload or enter a few months of data and tell me what decision you are trying to make. I will build the analysis around your goal.';
  if(totalIncome){
    if(goal.target && targetGap>0) recommendation=`Your current detected surplus is ${money(netSavings)} per period, while your target requires about ${money(requiredMonthly)}. You need roughly ${money(targetGap)} more. Start with the largest flexible expense (${discretionary[0]?.category||cats[0]?.category||'variable spending'}) before cutting essential costs.`;
    else if(goal.target) recommendation=`Your detected surplus of ${money(netSavings)} can cover the target of about ${money(requiredMonthly)} per period. Keep essential costs protected and automate the target amount first.`;
    else recommendation=`Your detected surplus is ${money(netSavings)} (${savingsRate.toFixed(1)}%). The best first move is to protect that surplus and test reductions in ${discretionary.slice(0,2).map(x=>x.category).join(' and ')||'your largest flexible categories'}.`;
  }
  const audit=auditTransactions(transactions);
  return {periods:monthlyData.length, totalIncome,totalExpenses,netSavings,savingsRate:Number(savingsRate.toFixed(1)),categories:cats,monthly:monthlyData,topMerchants,highestCategory:cats[0]||null,potentialSavings:Math.round(potential),healthScore:score,fixedExpenses:fixed,discretionary,goal,requiredMonthly,targetGap,insights,recommendation,transactionCount:transactions.length,audit};
}
function investigateFinances(transactions, problem=''){
  const a=analyze(transactions,problem);
  const findings=[];
  const audit=a.audit||{};
  for(const issue of (audit.issues||[]).slice(0,12)){
    findings.push({priority:issue.severity==='high'?1:issue.severity==='medium'?2:3,type:issue.type,title:issue.title,evidence:issue.text,confidence:issue.confidence||0});
  }
  const months=a.monthly||[];
  if(months.length>=2){
    const prev=months.at(-2), latest=months.at(-1);
    const expenseDelta=latest.expenses-prev.expenses;
    if(Math.abs(expenseDelta)>Math.max(500,prev.expenses*0.15)) findings.push({priority:1,type:'month_shift',title:'Material month-to-month expense change',evidence:`Expenses changed by ${money(Math.abs(expenseDelta))} (${prev.expenses?Math.abs(expenseDelta/prev.expenses*100).toFixed(1):'0'}%) from ${prev.month} to ${latest.month}.`,confidence:90});
    const prevCats=Object.fromEntries((prev.categories||[]).map(x=>[x.category,x.amount]));
    const latestCats=Object.fromEntries((latest.categories||[]).map(x=>[x.category,x.amount]));
    const catNames=new Set([...Object.keys(prevCats),...Object.keys(latestCats)]);
    for(const cat of catNames){
      const old=prevCats[cat]||0, now=latestCats[cat]||0, delta=now-old;
      if(delta>Math.max(500,old*.3)) findings.push({priority:2,type:'category_spike',title:`${cat} spending increased`,evidence:`${cat} rose by ${money(delta)} from ${prev.month} to ${latest.month}.`,confidence:86});
    }
  }
  if(a.highestCategory && a.totalExpenses){
    const share=a.highestCategory.amount/a.totalExpenses*100;
    if(share>=35) findings.push({priority:2,type:'concentration',title:`High spending concentration in ${a.highestCategory.category}`,evidence:`${a.highestCategory.category} accounts for ${share.toFixed(1)}% of detected expenses.`,confidence:92});
  }
  if(a.netSavings<0) findings.push({priority:1,type:'cash_flow',title:'Detected spending exceeds detected income',evidence:`Detected expenses exceed detected income by ${money(Math.abs(a.netSavings))}.`,confidence:98});
  if(a.audit.coverage==='Limited') findings.push({priority:3,type:'data_quality',title:'Limited data coverage',evidence:'The supplied dated history covers a short period, so trend conclusions may be incomplete.',confidence:95});
  findings.sort((x,y)=>x.priority-y.priority || y.confidence-x.confidence);
  const actions=[];
  if(audit.duplicates) actions.push('Review possible duplicate transactions against the original statement.');
  if(audit.recurring?.length) actions.push(`Review ${audit.recurring.length} recurring payment pattern${audit.recurring.length>1?'s':''} for necessity and expected renewal dates.`);
  const biggestFlexible=a.discretionary?.[0];
  if(biggestFlexible) actions.push(`If you want to improve surplus, test a reduction in ${biggestFlexible.category}; Saarthi estimates about ${money(biggestFlexible.amount*.1)} freed per 10%.`);
  if(a.netSavings<0) actions.push('Prioritize understanding the cash-flow gap before adding new discretionary commitments.');
  return {summary:{transactionCount:a.transactionCount,periods:a.periods,income:a.totalIncome,expenses:a.totalExpenses,surplus:a.netSavings,savingsRate:a.savingsRate},findings:findings.slice(0,15),actions:actions.slice(0,6),limitations:['Findings are based only on supplied rows.','An anomaly or duplicate is a review signal, not proof of fraud.','Missing source data can create false gaps.','Saarthi does not invent transactions or balances.']};
}

function contextFrom(transactions, problem, source='user-data', filename=''){
  const a=analyze(transactions,problem);
  return {source,filename,problem,detected:a.transactionCount,columns:['date','merchant','category','amount'],periods:a.periods,totalIncome:a.totalIncome,totalExpenses:a.totalExpenses,audit:a.audit};
}
function reset(state){ state.transactions=[];state.problem='';state.source='none';state.filename='';state.context=null;state.history=[]; }

const banks=[{id:'sbi',name:'State Bank of India',shortName:'SBI'},{id:'hdfc',name:'HDFC Bank',shortName:'HDFC'},{id:'icici',name:'ICICI Bank',shortName:'ICICI'},{id:'axis',name:'Axis Bank',shortName:'AXIS'}];
app.get('/api/banks',(req,res)=>res.json(banks));
app.get('/api/transactions',(req,res)=>{const state=getState(req);res.json({transactions:state.transactions,hasData:state.transactions.length>0});});
app.get('/api/health',(req,res)=>res.json({ok:true,service:'SAARTHI',mode:'user-data-intelligence'}));
app.get('/api/state',(req,res)=>{const state=getState(req);const a=analyze(state.transactions,state.problem);res.json({hasData:state.transactions.length>0,problem:state.problem,source:state.source,filename:state.filename,context:state.context,analytics:a,transactions:state.transactions.slice(0,100)});});
app.post('/api/load-sample',(req,res)=>{const state=getState(req);state.transactions=demoTransactions;state.problem=req.body?.problem||'Help me understand my spending and find a realistic way to save more.';state.source='sample';state.filename='Saarthi example dataset';state.context=contextFrom(state.transactions,state.problem,state.source,state.filename);res.json({ok:true,analytics:analyze(state.transactions,state.problem),context:state.context});});
app.post('/api/import',upload.single('file'),(req,res)=>{
  const state=getState(req);
  try{
    let rows=[]; let source='paste'; let filename='';
    if(req.file){ filename=req.file.originalname; const ext=path.extname(filename).toLowerCase(); source=ext.replace('.','')||'file';
      if(['.xlsx','.xls','.csv'].includes(ext)){ const wb=XLSX.read(req.file.buffer,{type:'buffer',cellDates:true}); const sheet=wb.Sheets[wb.SheetNames[0]]; rows=normalizeRows(XLSX.utils.sheet_to_json(sheet,{defval:''})); }
      else if(ext==='.json'){ rows=normalizeRows(JSON.parse(req.file.buffer.toString('utf8'))); }
      else rows=parseText(req.file.buffer.toString('utf8'));
    } else { rows=parseText(req.body?.data||''); source='paste'; }
    if(!rows.length) return res.status(400).json({ok:false,error:'I could not detect usable financial rows. Try a spreadsheet with columns like Date, Description/Merchant, Amount and Category, or paste a simple table.'});
    state.transactions=rows; state.problem=String(req.body?.problem||'').trim(); state.source=source; state.filename=filename; state.context=contextFrom(rows,state.problem,state.source,state.filename); state.history=[];
    res.json({ok:true,context:state.context,analytics:analyze(rows,state.problem),sample:rows.slice(0,8)});
  }catch(e){res.status(400).json({ok:false,error:`Could not read this file: ${e.message}`});}
});
app.post('/api/analyze',(req,res)=>{ const state=getState(req); if(req.body?.problem!==undefined) state.problem=String(req.body.problem); if(!state.transactions.length) return res.status(400).json({ok:false,error:'Give Saarthi some financial data first.'}); state.context=contextFrom(state.transactions,state.problem,state.source,state.filename); const analytics=analyze(state.transactions,state.problem); res.json({ok:true,analytics,context:state.context}); });
app.post('/api/investigate',(req,res)=>{ const state=getState(req); if(!state.transactions.length)return res.status(400).json({ok:false,error:'Load financial data first.'}); const result=investigateFinances(state.transactions,req.body?.problem??state.problem); res.json({ok:true,...result}); });
app.post('/api/chat',async(req,res)=>{
  const state=getState(req);
  const q=String(req.body?.message||'').trim();
  if(!q)return res.status(400).json({error:'Ask a question.'});
  if(!state.transactions.length) return res.json({reply:'I’m ready. Upload an Excel/CSV file or paste your financial data first. Then tell me what you want to figure out.',needsData:true});

  const toolkit={state,analyze,auditTransactions,money,investigateFinances};
  try{
    const ai=await runSaarthi({state,message:q,toolkit});
    if(ai.configured && ai.reply){
      state.history.push({q,reply:ai.reply,mode:'ai'});
      return res.json({reply:ai.reply,analytics:analyze(state.transactions,state.problem),mode:'ai'});
    }
  }catch(e){
    console.error('Saarthi AI error:',e.message);
    if(process.env.SAARTHI_STRICT_AI==='1') return res.status(502).json({error:`Saarthi AI could not complete the request: ${e.message}`});
  }

  // Deterministic fallback keeps the prototype usable when no API key is configured.
  const a=analyze(state.transactions,`${state.problem}\n${q}`); const s=q.toLowerCase(); let reply='';
  const findCat=(name)=>a.categories.find(c=>c.category.toLowerCase()===name.toLowerCase())?.amount||0;
  if(/most|highest|largest|spend.*where/.test(s)) reply=`Your largest detected expense is ${a.highestCategory?`${a.highestCategory.category} at ${money(a.highestCategory.amount)}`:'not identifiable yet'}. ${a.insights[0]?.text||''}`;
  else if(/food/.test(s)) reply=`You spent ${money(findCat('Food'))} on Food in the data I can see. ${findCat('Food')?`A 15% reduction would free about ${money(findCat('Food')*.15)} per period.`:''}`;
  else if(/afford|buy|purchase|laptop|phone/.test(s)) { const nums=[...q.matchAll(/₹?\s*([\d,]+)/g)].map(m=>Number(m[1].replace(/,/g,''))); const price=nums[0]; if(price&&a.netSavings>0) reply=`I would treat ${money(price)} as affordable only if it does not consume your safety buffer. Your detected surplus is ${money(a.netSavings)} per period. If you want, give me your emergency-fund target and purchase deadline and I can test the scenario.`; else reply=`I need the purchase price and your target/safety-buffer assumptions to make a responsible affordability estimate. I can already see a detected surplus of ${money(a.netSavings)} per period.`; }
  else if(/save|saving|goal|target/.test(s)) reply=a.recommendation;
  else if(/health|score/.test(s)) reply=`Your current Saarthi financial-health indicator is ${a.healthScore}/100. It is an analytical signal based on detected savings rate and expense structure, not a credit score.`;
  else if(/summary|overview|analyse|analyze/.test(s)) reply=`I found ${a.transactionCount} usable transactions: income ${money(a.totalIncome)}, expenses ${money(a.totalExpenses)}, surplus ${money(a.netSavings)} (${a.savingsRate}%). ${a.highestCategory?`Largest category: ${a.highestCategory.category}.`:''} ${a.recommendation}`;
  else reply=`Based on your current data: ${a.recommendation} Ask me about affordability, saving, a category, unusual spending, or a specific what-if scenario.`;
  state.history.push({q,reply,mode:'fallback'}); res.json({reply,analytics:a,mode:'fallback'});
});

app.get('/api/ai-status',(req,res)=>res.json({configured:Boolean(process.env.OPENAI_API_KEY),model:process.env.SAARTHI_MODEL||'gpt-5.6-luna'}));

app.post('/api/simulate',(req,res)=>{ const state=getState(req); if(!state.transactions.length)return res.status(400).json({error:'Load data first.'}); const category=String(req.body?.category||''); const reduction=Math.max(0,Math.min(100,Number(req.body?.reduction)||0)); const amount=analyze(state.transactions,state.problem).categories.find(c=>c.category===category)?.amount||0; const monthlySave=amount*reduction/100; const before=analyze(state.transactions,state.problem); res.json({category,reduction,categoryAmount:amount,savingsPerPeriod:Math.round(monthlySave),yearlySavings:Math.round(monthlySave*12),newSurplus:Math.round(before.netSavings+monthlySave)}); });
app.post('/api/reset',(req,res)=>{const state=getState(req);reset(state);res.json({ok:true});});
app.get('/api/dashboard',(req,res)=>{const state=getState(req);const a=analyze(state.transactions,state.problem);res.json({balance:null,...a,recentTransactions:state.transactions.slice(0,8),hasData:state.transactions.length>0});});

app.listen(PORT,()=>console.log(`SAARTHI running on port ${PORT}`));

// Batch 3: current public-information research + Batch 4: product intelligence APIs
app.post('/api/research', async (req,res) => {
  const query=String(req.body?.query||'').trim();
  if(!query) return res.status(400).json({ok:false,error:'Tell Saarthi what you want researched.'});
  const key=process.env.OPENAI_API_KEY;
  if(!key) return res.status(503).json({ok:false,configured:false,error:'Web research needs OPENAI_API_KEY in the backend environment.'});
  try {
    const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model:process.env.SAARTHI_MODEL||'gpt-5.6-luna',store:false,instructions:'You are Saarthi Web Intelligence. Research current public information carefully. Prefer primary/official sources. Separate verified facts from interpretation. Never invent eligibility, fees, deadlines or rules. Give concise findings, practical next steps, and mention source names/URLs when available.',input:query,tools:[{type:'web_search'}]})});
    const data=await r.json();
    if(!r.ok) throw new Error(data?.error?.message||`Research request failed (${r.status})`);
    res.json({ok:true,answer:data.output_text||'No research answer was returned.',rawOutput:data.output||[]});
  } catch(e){res.status(502).json({ok:false,error:`Web research failed: ${e.message}`});}
});

app.get('/api/brief',(req,res)=>{
  const state=getState(req); if(!state.transactions.length)return res.status(400).json({ok:false,error:'Load financial data first.'});
  const a=analyze(state.transactions,state.problem), inv=investigateFinances(state.transactions,state.problem);
  res.json({ok:true,generatedAt:new Date().toISOString(),snapshot:{transactions:a.transactionCount,periods:a.periods,income:a.totalIncome,expenses:a.totalExpenses,surplus:a.netSavings,savingsRate:a.savingsRate,healthScore:a.healthScore,coverage:a.audit.coverage},findings:inv.findings.slice(0,8),actions:inv.actions.slice(0,6),limitations:inv.limitations});
});
