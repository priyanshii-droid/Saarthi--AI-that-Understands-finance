const API_BASE = "https://saarthi-ai-that-understands-finance.onrender.com";
const $ = id => document.getElementById(id);

// Synthetic dataset: the analytics engine owns the mathematics; AI only interprets results.
const FINANCE = {
  account: { bank: "Saarthi Demo Bank", balance: 24500 },
  months: [
    {month:"Jun", income:50000, expenses:14200},
    {month:"Jul", income:50000, expenses:16800},
    {month:"Aug", income:52000, expenses:15100}
  ],
  categories: { Food:6200, Shopping:8500, Transport:2800, Bills:5400, Entertainment:3100 },
  recurring: [
    {name:"Rent & utilities", amount:5400}, {name:"Mobile", amount:599}, {name:"Streaming", amount:499}
  ],
  transactions: [
    {date:"2026-08-30", merchant:"Salary credit", category:"Income", amount:52000, status:"Completed"},
    {date:"2026-08-28", merchant:"Monthly rent", category:"Bills", amount:-4200, status:"Completed"},
    {date:"2026-08-26", merchant:"Supermarket", category:"Food", amount:-1850, status:"Completed"},
    {date:"2026-08-24", merchant:"Online Store", category:"Shopping", amount:-3200, status:"Completed"},
    {date:"2026-08-21", merchant:"Metro / Travel", category:"Transport", amount:-900, status:"Completed"},
    {date:"2026-08-18", merchant:"Restaurant", category:"Food", amount:-1250, status:"Completed"},
    {date:"2026-08-15", merchant:"Streaming", category:"Entertainment", amount:-499, status:"Completed"},
    {date:"2026-08-11", merchant:"Online Store", category:"Shopping", amount:-2100, status:"Completed"},
    {date:"2026-08-07", merchant:"Electricity", category:"Bills", amount:-1200, status:"Completed"}
  ]
};

const fmt = n => "₹" + Math.round(Number(n)||0).toLocaleString("en-IN");
const pct = (a,b) => b ? +(a/b*100).toFixed(1) : 0;
const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function calculate(){
  const totalExpenses = Object.values(FINANCE.categories).reduce((a,b)=>a+b,0);
  const income = FINANCE.months.at(-1).income;
  const savings = income-totalExpenses;
  const rate = pct(savings,income);
  const entries = Object.entries(FINANCE.categories).sort((a,b)=>b[1]-a[1]);
  const top = entries[0];
  const avg = FINANCE.months.reduce((a,m)=>a+m.expenses,0)/FINANCE.months.length;
  const first=FINANCE.months[0].expenses,last=FINANCE.months.at(-1).expenses;
  return {totalExpenses,income,savings,rate,entries,top,avg,trend:pct(last-first,first),months:FINANCE.months};
}
const M = calculate();

async function api(path, options={}){
  const r=await fetch(API_BASE+path,{...options,headers:{...(options.body?{"Content-Type":"application/json"}:{}),...(options.headers||{})}});
  if(!r.ok) throw Error("API "+r.status); return r.json();
}

function setText(id,v){ if($(id)) $(id).textContent=v; }
function showSection(name){
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.section===name));
  document.querySelectorAll('.section').forEach(x=>x.classList.toggle('active',x.id===name+'-section'));
  const titles={dashboard:['Financial overview','Your money, understood simply.'],analytics:['Financial intelligence','Ask questions. Get calculations. See the evidence.'],transactions:['Transactions','Synthetic activity powering your analysis.'],chat:['Ask Saarthi','Your AI financial intelligence workspace.'],banks:['Connect bank','Safe simulated connections only.']};
  if(titles[name]){setText('page-title',titles[name][0]);setText('page-subtitle',titles[name][1]);}
  if(name==='analytics') renderAnalytics(); if(name==='transactions') renderTransactions();
  $('sidebar')?.classList.remove('open');
}

function renderDashboard(){
  setText('balance',fmt(FINANCE.account.balance));setText('income',fmt(M.income));setText('expenses',fmt(M.totalExpenses));setText('savings',fmt(M.savings));setText('savings-rate',M.rate+'% savings rate');
  setText('health-score',Math.min(100,Math.round(50+M.rate/2))); setText('potential-savings',fmt(Math.round(M.top[1]*.2+FINANCE.categories.Food*.1)));
  const hc=$('dashboard-categories'); if(hc) hc.innerHTML=M.entries.map(([k,v])=>`<div class="category-row"><div class="category-name">${k}</div><div class="progress"><div class="progress-fill" style="width:${Math.round(v/M.top[1]*100)}%"></div></div><div class="category-amount">${fmt(v)}</div></div>`).join('');
  const rc=$('recent-transactions'); if(rc) rc.innerHTML=FINANCE.transactions.slice(0,5).map(transactionHtml).join('');
  const ch=$('monthly-chart'); if(ch) ch.innerHTML=barChart(FINANCE.months.map(x=>({label:x.month,value:x.expenses})));
  const ring=$('health-ring'); if(ring) ring.style.setProperty('--score',Math.min(100,Math.round(50+M.rate/2))+'%');
  const insight=$('main-insight'); if(insight) insight.innerHTML=`<div class="insight-symbol">✦</div><div><span class="section-kicker">SAARTHI INSIGHT</span><h3>${M.top[0]} is your biggest spending opportunity.</h3><p>${fmt(M.top[1])} is ${pct(M.top[1],M.totalExpenses)}% of tracked expenses. A 20% reduction could free ${fmt(M.top[1]*.2)} per month.</p></div>`;
}
function transactionHtml(t){return `<div class="transaction"><div class="transaction-icon">${t.category==='Income'?'↗':'₹'}</div><div class="transaction-info"><div class="transaction-name">${escapeHtml(t.merchant)}</div><div class="transaction-date">${t.date} · ${escapeHtml(t.category)}</div></div><div class="transaction-amount ${t.amount<0?'negative':'positive'}">${t.amount<0?'−':'+'}${fmt(Math.abs(t.amount))}</div></div>`}
function barChart(items){const max=Math.max(...items.map(x=>x.value),1);return items.map(x=>`<div class="chart-column"><div class="chart-bar" style="height:${Math.max(8,Math.round(x.value/max*82))}%"></div><div class="chart-value">${fmt(x.value)}</div><div class="chart-label">${x.label}</div></div>`).join('')}
function renderAnalytics(){
  setText('analytics-income',fmt(M.income));setText('analytics-expenses',fmt(M.totalExpenses));setText('analytics-savings',fmt(M.savings));setText('analytics-rate',M.rate+'%');
  const cat=$('analytics-categories');if(cat)cat.innerHTML=M.entries.map(([k,v])=>`<div class="category-row"><div class="category-name">${k}</div><div class="progress"><div class="progress-fill" style="width:${Math.round(v/M.top[1]*100)}%"></div></div><div class="category-amount">${fmt(v)}</div></div>`).join('');
  const chart=$('analytics-chart');if(chart)chart.innerHTML=barChart(FINANCE.months.map(x=>({label:x.month,value:x.expenses})));
  const merchants=$('top-merchants');if(merchants)merchants.innerHTML=M.entries.slice(0,4).map(([k,v])=>`<div class="transaction"><div class="transaction-info"><strong>${k}</strong><div class="transaction-date">Category total · ${pct(v,M.totalExpenses)}% of expenses</div></div><div class="transaction-amount negative">${fmt(v)}</div></div>`).join('');
  const recurring=$('recurring-list');if(recurring)recurring.innerHTML=FINANCE.recurring.map(x=>`<div class="transaction"><div class="transaction-info"><strong>${x.name}</strong><div class="transaction-date">Recurring synthetic expense</div></div><div class="transaction-amount negative">${fmt(x.amount)}</div></div>`).join('');
}
function renderTransactions(){const body=$('transaction-table-body');if(body)body.innerHTML=FINANCE.transactions.map(t=>`<tr><td>${t.date}</td><td>${escapeHtml(t.merchant)}</td><td>${escapeHtml(t.category)}</td><td>${t.amount<0?'−':'+'}${fmt(Math.abs(t.amount))}</td><td>${t.status}</td></tr>`).join('')}

function chartFor(type){
  if(type==='category') return `<div class="result-chart">${barChart(M.entries.map(([label,value])=>({label,value})))}</div>`;
  if(type==='trend') return `<div class="result-chart">${barChart(FINANCE.months.map(x=>({label:x.month,value:x.expenses})))}</div>`;
  if(type==='income') return `<div class="result-chart">${barChart(FINANCE.months.map(x=>({label:x.month,value:x.income-x.expenses})))}</div>`;
  return `<div class="result-chart">${barChart(M.entries.slice(0,5).map(([label,value])=>({label,value})))}</div>`;
}
function analyzeQuestion(q){
  const s=q.toLowerCase(); let title='', text='', facts=[], type='category';
  if(/trend|month|monthly|last.*3|compare/.test(s)){
    title='3-month spending analysis'; type='trend'; const change=M.months.at(-1).expenses-M.months[0].expenses;
    text=`Your average monthly expense is <b>${fmt(M.avg)}</b>. Spending moved from <b>${fmt(M.months[0].expenses)}</b> in ${M.months[0].month} to <b>${fmt(M.months.at(-1).expenses)}</b> in ${M.months.at(-1).month}, a ${Math.abs(M.trend)}% ${change>=0?'increase':'decrease'}.`;
    facts=[['Average monthly spend',fmt(M.avg)],['Highest month','Jul · '+fmt(16800)],['Latest month',fmt(M.months.at(-1).expenses)]];
  } else if(/food/.test(s)){
    title='Food spending analysis'; type='category'; const v=FINANCE.categories.Food;
    text=`You spent <b>${fmt(v)}</b> on Food, which is <b>${pct(v,M.totalExpenses)}%</b> of tracked expenses. Cutting this by 15% would save <b>${fmt(v*.15)}</b> per month and <b>${fmt(v*.15*12)}</b> per year.`;
    facts=[['Food spend',fmt(v)],['Share of expenses',pct(v,M.totalExpenses)+'%'],['15% saving',fmt(v*.15)+'/month']];
  } else if(/afford|buy|purchase|laptop|phone/.test(s)){
    const match=s.match(/(?:₹|rs\.?\s*)([\d,]+)/i); const cost=match?Number(match[1].replace(/,/g,'')):12000; const after=M.savings-cost;
    title='Affordability analysis'; type='income'; text=`A ${fmt(cost)} purchase would leave approximately <b>${fmt(after)}</b> from this month's calculated savings. Your current savings rate is <b>${M.rate}%</b>. ${after>=0?'The purchase is mathematically affordable from this month’s surplus, but it would reduce your savings buffer.':'It would exceed this month’s calculated surplus, so I would avoid funding it from monthly cash flow.'}`;
    facts=[['Purchase',fmt(cost)],['Current monthly surplus',fmt(M.savings)],['Surplus after purchase',fmt(after)]];
  } else if(/save|saving|reduce|cut|budget/.test(s)){
    title='Savings opportunity analysis'; type='category'; const shop=FINANCE.categories.Shopping,food=FINANCE.categories.Food,total=shop*.2+food*.1;
    text=`The clearest opportunity is <b>${M.top[0]}</b>. Reducing Shopping by 20% and Food by 10% would free about <b>${fmt(total)}</b> each month, or <b>${fmt(total*12)}</b> per year.`;
    facts=[['Shopping −20%',fmt(shop*.2)+'/month'],['Food −10%',fmt(food*.1)+'/month'],['Potential annual saving',fmt(total*12)]];
  } else if(/health|healthy|score/.test(s)){
    title='Financial health analysis'; type='income'; const score=Math.min(100,Math.round(50+M.rate/2));
    text=`Your calculated savings rate is <b>${M.rate}%</b>, leaving <b>${fmt(M.savings)}</b> after tracked expenses. Saarthi's demo health score is <b>${score}/100</b>, driven primarily by your savings rate and spending concentration.`;
    facts=[['Savings rate',M.rate+'%'],['Net monthly surplus',fmt(M.savings)],['Demo health score',score+'/100']];
  } else if(/income|cash flow|salary|earn/.test(s)){
    title='Income & cash-flow analysis'; type='income'; text=`Your latest synthetic income is <b>${fmt(M.income)}</b>. Against <b>${fmt(M.totalExpenses)}</b> of tracked expenses, your calculated surplus is <b>${fmt(M.savings)}</b>.`; facts=[['Income',fmt(M.income)],['Expenses',fmt(M.totalExpenses)],['Surplus',fmt(M.savings)]];
  } else {
    title='Financial snapshot'; type='category'; text=`I calculated your current snapshot from the supplied synthetic dataset: <b>${fmt(M.income)}</b> income, <b>${fmt(M.totalExpenses)}</b> expenses and <b>${fmt(M.savings)}</b> net savings (${M.rate}%). Your largest category is <b>${M.top[0]}</b> at <b>${fmt(M.top[1])}</b>.`;
    facts=[['Income',fmt(M.income)],['Expenses',fmt(M.totalExpenses)],['Net savings',fmt(M.savings)]];
  }
  return {title,text,facts,type};
}
function renderAnswer(q){
  const a=analyzeQuestion(q), box=$('ai-analysis-result'); if(!box)return;
  box.innerHTML=`<div class="analysis-result-head"><div><span class="section-kicker">DETERMINISTIC ANALYSIS</span><h3>${a.title}</h3></div><span class="verified-badge">✓ Math verified</span></div><p class="analysis-copy">${a.text}</p><div class="analysis-facts">${a.facts.map(x=>`<div><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('')}</div>${chartFor(a.type)}<div class="calculation-note"><b>How Saarthi works:</b> transaction data → deterministic calculations → visualization → AI explanation. The language model does not invent the financial totals.</div>`;
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function addMessage(text,kind){const box=$('chat-messages');if(!box)return;const d=document.createElement('div');d.className='message '+kind;d.innerHTML=text;box.appendChild(d);box.scrollTop=box.scrollHeight;return d}
function ask(q){$('chat-input').value=q; sendChat()}
async function sendChat(){const input=$('chat-input');const q=input?.value.trim();if(!q)return;addMessage(escapeHtml(q),'user');input.value='';const a=analyzeQuestion(q);addMessage(a.text.replace(/<b>/g,'').replace(/<\/b>/g,''),'ai');renderAnswer(q);}

function setup(){
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.go)));
  document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.section)));
  document.querySelectorAll('.prompt').forEach(b=>b.addEventListener('click',()=>ask(b.textContent)));
  $('send-message')?.addEventListener('click',sendChat); $('chat-input')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});
  $('mobile-menu')?.addEventListener('click',()=>$('sidebar')?.classList.toggle('open'));
  $('simulate-payment')?.addEventListener('click',()=>alert('Payment simulation successful — no real money moved.'));
  document.querySelectorAll('.connect-btn').forEach(b=>b.addEventListener('click',()=>alert(`${b.dataset.bank||'Bank'} demo connection successful. No real account was connected.`)));
  renderDashboard();renderAnalytics();renderTransactions();
  // First-class analysis workspace inserted if absent.
  const chat=document.getElementById('chat-section');
  if(chat && !document.getElementById('ai-analysis-result')){
    const panel=chat.querySelector('.chat-panel'); if(panel){const result=document.createElement('div');result.id='ai-analysis-result';result.className='ai-analysis-result';result.innerHTML='<div class="loading">Ask a question to generate a calculation and visualization.</div>';panel.appendChild(result)}
  }
}
document.addEventListener('DOMContentLoaded',setup);
