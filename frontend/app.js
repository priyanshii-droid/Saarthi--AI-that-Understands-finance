
const LANG = {
 en:{title:"Financial overview",sub:"Your money, understood simply.",dashboard:"Dashboard",analytics:"Analytics",transactions:"Transactions",chat:"Ask Saarthi",banks:"Connect Bank",authTitle:"Your money, understood.",authSub:"Sign in to continue to your personal financial intelligence dashboard.",email:"Email address",password:"Password",signin:"Sign in securely →",demo:"Continue with demo account",welcome:"Hi! I'm Saarthi 👋 Ask me about your spending, savings, bills or financial health."},
 hi:{title:"वित्तीय अवलोकन",sub:"आपके पैसे को सरलता से समझें।",dashboard:"डैशबोर्ड",analytics:"विश्लेषण",transactions:"लेन-देन",chat:"सारथी से पूछें",banks:"बैंक जोड़ें",authTitle:"आपके पैसे को समझें।",authSub:"अपने व्यक्तिगत वित्तीय डैशबोर्ड पर जाने के लिए साइन इन करें।",email:"ईमेल पता",password:"पासवर्ड",signin:"सुरक्षित साइन इन →",demo:"डेमो अकाउंट से जारी रखें",welcome:"नमस्ते! मैं सारथी हूँ 👋 अपने खर्च, बचत, बिल या वित्तीय स्वास्थ्य के बारे में पूछें।"},
 gu:{title:"નાણાકીય ઝાંખી",sub:"તમારા પૈસાને સરળતાથી સમજો.",dashboard:"ડેશબોર્ડ",analytics:"વિશ્લેષણ",transactions:"વ્યવહારો",chat:"સારથીને પૂછો",banks:"બેંક જોડો",authTitle:"તમારા પૈસાને સમજો.",authSub:"તમારા વ્યક્તિગત નાણાકીય ડેશબોર્ડમાં આગળ વધવા સાઇન ઇન કરો.",email:"ઈમેલ સરનામું",password:"પાસવર્ડ",signin:"સુરક્ષિત સાઇન ઇન →",demo:"ડેમો એકાઉન્ટ સાથે ચાલુ રાખો",welcome:"નમસ્તે! હું સારથી છું 👋 તમારા ખર્ચ, બચત, બિલ અથવા નાણાકીય સ્વાસ્થ્ય વિશે પૂછો."}
};
function applyLanguage(lang){
  const t=LANG[lang]||LANG.en;
  localStorage.setItem("saarthi_lang",lang);
  setText("auth-title",t.authTitle);setText("auth-subtitle",t.authSub);setText("email-label",t.email);setText("password-label",t.password);setText("login-btn",t.signin);setText("demo-login",t.demo);
  setText("page-title",t.title);setText("page-subtitle",t.sub);
  const nav=document.querySelectorAll(".nav-item"); if(nav.length>=5){setTextEl(nav[0],t.dashboard);setTextEl(nav[1],t.analytics);setTextEl(nav[2],t.transactions);setTextEl(nav[3],t.chat);setTextEl(nav[4],t.banks);}
  const sel=$("language-select"), authSel=$("auth-language"); if(sel)sel.value=lang;if(authSel)authSel.value=lang;
  const first=$("chat-messages")?.querySelector(".message.ai"); if(first && first.dataset.default==="yes") first.textContent=t.welcome;
}
function setTextEl(el,text){
  if(!el)return;
  const span=el.querySelector("span");
  const textNodes=[...el.childNodes].filter(n=>n.nodeType===3);
  if(textNodes.length) textNodes[0].textContent=text+" ";
  else el.insertBefore(document.createTextNode(text+" "),span||null);
}); if(span) el.appendChild(document.createTextNode(text));}

const FULL_TRANSLATIONS={
en:{
"Financial overview":"Financial overview","Your money, understood simply.":"Your money, understood simply.","Dashboard":"Dashboard","Analytics":"Analytics","Transactions":"Transactions","Ask Saarthi":"Ask Saarthi","Connect Bank":"Connect Bank","Financial intelligence":"Financial intelligence","See where your money is going.":"See where your money is going.","Your simulated financial activity.":"Your simulated financial activity.","Your AI financial companion.":"Your AI financial companion.","Demo bank connections only.":"Demo bank connections only.","Ask Saarthi":"Ask Saarthi","Your money, understood.":"Your money, understood.","Sign in to continue to your personal financial intelligence dashboard.":"Sign in to continue to your personal financial intelligence dashboard.","Email address":"Email address","Password":"Password","Sign in securely →":"Sign in securely →","Continue with demo account":"Continue with demo account","Where do I spend the most?":"Where do I spend the most?","How can I save money?":"How can I save money?","What is my financial health?":"What is my financial health?","Show my food spending":"Show my food spending"
},
hi:{
"Financial overview":"वित्तीय अवलोकन","Your money, understood simply.":"आपके पैसे को सरलता से समझें।","Dashboard":"डैशबोर्ड","Analytics":"विश्लेषण","Transactions":"लेन-देन","Ask Saarthi":"सारथी से पूछें","Connect Bank":"बैंक जोड़ें","Financial intelligence":"वित्तीय बुद्धिमत्ता","See where your money is going.":"देखें आपका पैसा कहाँ जा रहा है।","Your simulated financial activity.":"आपकी सिम्युलेटेड वित्तीय गतिविधि।","Your AI financial companion.":"आपका AI वित्तीय साथी।","Demo bank connections only.":"केवल डेमो बैंक कनेक्शन।","Your money, understood.":"आपके पैसे को समझें।","Sign in to continue to your personal financial intelligence dashboard.":"अपने व्यक्तिगत वित्तीय डैशबोर्ड पर जाने के लिए साइन इन करें।","Email address":"ईमेल पता","Password":"पासवर्ड","Sign in securely →":"सुरक्षित साइन इन →","Continue with demo account":"डेमो अकाउंट से जारी रखें","Where do I spend the most?":"मैं सबसे ज्यादा कहाँ खर्च करता हूँ?","How can I save money?":"मैं पैसे कैसे बचाऊँ?","What is my financial health?":"मेरा वित्तीय स्वास्थ्य कैसा है?","Show my food spending":"मेरा भोजन खर्च दिखाएँ"
},
gu:{
"Financial overview":"નાણાકીય ઝાંખી","Your money, understood simply.":"તમારા પૈસાને સરળતાથી સમજો.","Dashboard":"ડેશબોર્ડ","Analytics":"વિશ્લેષણ","Transactions":"વ્યવહારો","Ask Saarthi":"સારથીને પૂછો","Connect Bank":"બેંક જોડો","Financial intelligence":"નાણાકીય બુદ્ધિ","See where your money is going.":"તમારા પૈસા ક્યાં જાય છે તે જુઓ.","Your simulated financial activity.":"તમારી સિમ્યુલેટેડ નાણાકીય પ્રવૃત્તિ.","Your AI financial companion.":"તમારો AI નાણાકીય સાથી.","Demo bank connections only.":"માત્ર ડેમો બેંક કનેક્શન.","Your money, understood.":"તમારા પૈસાને સમજો.","Sign in to continue to your personal financial intelligence dashboard.":"તમારા વ્યક્તિગત નાણાકીય ડેશબોર્ડમાં આગળ વધવા સાઇન ઇન કરો.","Email address":"ઈમેલ સરનામું","Password":"પાસવર્ડ","Sign in securely →":"સુરક્ષિત સાઇન ઇન →","Continue with demo account":"ડેમો એકાઉન્ટ સાથે ચાલુ રાખો","Where do I spend the most?":"હું સૌથી વધુ ક્યાં ખર્ચું છું?","How can I save money?":"હું પૈસા કેવી રીતે બચાવું?","What is my financial health?":"મારું નાણાકીય સ્વાસ્થ્ય કેવું છે?","Show my food spending":"મારો ખોરાક ખર્ચ બતાવો"
}};
function translatePage(lang){
 const dict=FULL_TRANSLATIONS[lang]||FULL_TRANSLATIONS.en;
 document.querySelectorAll("body *").forEach(el=>{
   if(el.children.length===0 && el.textContent.trim()){
     const raw=el.textContent.trim();
     if(dict[raw]) el.textContent=el.textContent.replace(raw,dict[raw]);
   }
 });
 document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(el=>{
   const raw=el.getAttribute("placeholder"); if(dict[raw])el.setAttribute("placeholder",dict[raw]);
 });
}
function setLanguageEverywhere(lang){
 localStorage.setItem("saarthi_lang",lang);
 applyLanguage(lang);
 setTimeout(()=>translatePage(lang),20);
 setTimeout(()=>translatePage(lang),300);
}

function setupAuthAndExtras(){
  const auth=$("auth-screen"), form=$("login-form"), demo=$("demo-login");
  auth.style.display="grid"; if(localStorage.getItem("saarthi_signed_in")==="1") auth.style.display="none";
  const signIn=()=>{localStorage.setItem("saarthi_signed_in","1");auth.style.display="none";document.body.classList.add("demo-authenticated");showToast("Demo sign-in successful — welcome to SAARTHI.");};
  form?.addEventListener("submit",e=>{e.preventDefault();signIn();});
  demo?.addEventListener("click",signIn);
  $("auth-language")?.addEventListener("change",e=>setLanguageEverywhere(e.target.value));
  $("language-select")?.addEventListener("change",e=>setLanguageEverywhere(e.target.value));
  $("profile-btn")?.addEventListener("click",e=>{e.stopPropagation();$("profile-menu")?.classList.toggle("open");});
  $("notifications-btn")?.addEventListener("click",()=>showToast("You have 2 new financial insights. Bills are on track."));
  $("logout-btn")?.addEventListener("click",()=>{localStorage.removeItem("saarthi_signed_in");location.reload();});
  document.addEventListener("click",e=>{if(!e.target.closest(".profile-menu")&&!e.target.closest("#profile-btn"))$("profile-menu")?.classList.remove("open");});
  setLanguageEverywhere(localStorage.getItem("saarthi_lang")||"en");
}
document.addEventListener("DOMContentLoaded",setupAuthAndExtras);

const API_BASE = "https://saarthi-ai-that-understands-finance.onrender.com";

const $ = (id) => document.getElementById(id);
let dashboardData = null;
let analyticsData = null;

const DEMO_TRANSACTIONS = [
  {date:"2026-09-10", merchant:"Swiggy", category:"Food", amount:-420},
  {date:"2026-09-09", merchant:"Amazon", category:"Shopping", amount:-1299},
  {date:"2026-09-08", merchant:"Uber", category:"Transport", amount:-280},
  {date:"2026-09-07", merchant:"Electricity Board", category:"Bills", amount:-1800},
  {date:"2026-09-06", merchant:"Salary Credit", category:"Income", amount:52000},
  {date:"2026-09-05", merchant:"BigBasket", category:"Food", amount:-980},
  {date:"2026-09-03", merchant:"Netflix", category:"Bills", amount:-649},
  {date:"2026-09-02", merchant:"Myntra", category:"Shopping", amount:-1901},
  {date:"2026-09-01", merchant:"Metro", category:"Transport", amount:-540},
  {date:"2026-08-29", merchant:"Swiggy", category:"Food", amount:-310}
];

const DEMO_MONTHLY = [
  {month:"2026-07", income:50000, expenses:11800, savings:38200},
  {month:"2026-08", income:52000, expenses:13600, savings:38400},
  {month:"2026-09", income:52000, expenses:7659, savings:44341}
];

const DEMO_CATEGORIES = [
  {category:"Bills", amount:4200},
  {category:"Shopping", amount:3200},
  {category:"Food", amount:2400},
  {category:"Transport", amount:1800},
  {category:"Other", amount:2600}
];

const DEMO_DATA = {
  balance:24500,
  totalIncome:52000,
  totalExpenses:14200,
  netSavings:37800,
  savingsRate:72.7,
  healthScore:84,
  potentialSavings:3100,
  categories:DEMO_CATEGORIES,
  monthly:DEMO_MONTHLY,
  highestCategory:{category:"Bills", amount:4200},
  topMerchants:[
    {merchant:"Electricity Board",amount:1800},
    {merchant:"Myntra",amount:1901},
    {merchant:"BigBasket",amount:980}
  ],
  recurring:[
    {name:"Utilities",amount:1800,frequency:"Monthly"},
    {name:"Netflix",amount:649,frequency:"Monthly"},
    {name:"Mobile",amount:599,frequency:"Monthly"}
  ],
  recentTransactions:DEMO_TRANSACTIONS.slice(0,6)
};

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? {"Content-Type":"application/json"} : {}),
      ...(options.headers || {})
    }
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupHeroButtons();
  setupMobileMenu();
  setupChat();
  setupPayment();
  setupGlobalClicks();
  loadDashboard();
  loadBanks();
});

function setupGlobalClicks() {
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) {
      e.preventDefault();
      showSection(go.dataset.go);
      return;
    }

    const nav = e.target.closest(".nav-item");
    if (nav) {
      e.preventDefault();
      showSection(nav.dataset.section);
      return;
    }

    const prompt = e.target.closest(".prompt");
    if (prompt) {
      const input = $("chat-input");
      if (input) {
        input.value = prompt.textContent.trim();
        sendChat();
      }
    }

    const connect = e.target.closest(".connect-btn");
    if (connect) {
      const bank = connect.dataset.bank || "Demo Bank";
      connectBank(bank, connect);
    }
  });
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
  });
}

function showSection(name) {
  document.querySelectorAll(".nav-item").forEach(n =>
    n.classList.toggle("active", n.dataset.section === name)
  );
  document.querySelectorAll(".section").forEach(s =>
    s.classList.toggle("active", s.id === `${name}-section`)
  );

  const titles = {
    dashboard:["Financial overview","Your money, understood simply."],
    analytics:["Financial intelligence","See where your money is going."],
    transactions:["Transactions","Your simulated financial activity."],
    chat:["Ask Saarthi","Your AI financial companion."],
    banks:["Connect bank","Demo bank connections only."]
  };
  const t = titles[name] || titles.dashboard;
  setText("page-title", t[0]);
  setText("page-subtitle", t[1]);

  if (name === "analytics") loadAnalytics();
  if (name === "transactions") loadTransactions();
  closeMobileMenu();
  window.scrollTo({top:0, behavior:"smooth"});
}

function setupHeroButtons() {}
function setupMobileMenu() {
  $("mobile-menu")?.addEventListener("click", () =>
    $("sidebar")?.classList.toggle("open")
  );
}
function closeMobileMenu() {
  $("sidebar")?.classList.remove("open");
}

async function loadDashboard() {
  try {
    const raw = await api("/api/dashboard");
    const data = normalizeDashboard(raw);
    dashboardData = data;
    renderDashboard(data);
  } catch (err) {
    console.warn("Using local demo dashboard:", err);
    dashboardData = DEMO_DATA;
    renderDashboard(DEMO_DATA);
  }
}

function normalizeDashboard(raw) {
  const categories = Array.isArray(raw?.categories)
    ? raw.categories
    : Object.entries(raw?.categories || {}).map(([category,amount]) => ({category,amount}));

  const expenses = Number(raw?.totalExpenses) ||
    categories.reduce((sum,x) => sum + Number(x.amount || 0), 0);

  const income = Number(raw?.totalIncome) || 52000;
  const savings = Number(raw?.netSavings);
  return {
    ...DEMO_DATA,
    ...raw,
    categories: categories.length ? categories : DEMO_CATEGORIES,
    totalExpenses: expenses,
    totalIncome: income,
    netSavings: Number.isFinite(savings) ? savings : income - expenses,
    savingsRate: Number(raw?.savingsRate) || ((income-expenses)/income*100),
    monthly: Array.isArray(raw?.monthly) && raw.monthly.length ? raw.monthly : DEMO_MONTHLY,
    recentTransactions: Array.isArray(raw?.recentTransactions) ? raw.recentTransactions : DEMO_TRANSACTIONS.slice(0,6),
    healthScore: Number(raw?.healthScore) || 84,
    potentialSavings: Number(raw?.potentialSavings) || 3100
  };
}

function renderDashboard(data) {
  setText("balance", money(data.balance));
  setText("income", money(data.totalIncome));
  setText("expenses", money(data.totalExpenses));
  setText("savings", money(data.netSavings));
  setText("savings-rate", `${Number(data.savingsRate || 0).toFixed(1)}% savings rate`);
  setText("health-score", data.healthScore ?? 84);
  setText("potential-savings", money(data.potentialSavings || 0));
  renderCategories(data.categories, $("dashboard-categories"));
  renderChart(data.monthly, $("monthly-chart"));
  renderTransactions(data.recentTransactions || DEMO_TRANSACTIONS.slice(0,6), $("recent-transactions"));
  renderInsight(data);
  renderHealth(Number(data.healthScore) || 84);
}

async function loadAnalytics() {
  try {
    const response = await api("/api/analytics");
    analyticsData = normalizeDashboard(response.analytics || response);
  } catch (err) {
    analyticsData = dashboardData || DEMO_DATA;
  }
  renderAnalytics(analyticsData);
}

function renderAnalytics(data) {
  setText("analytics-income", money(data.totalIncome));
  setText("analytics-expenses", money(data.totalExpenses));
  setText("analytics-savings", money(data.netSavings));
  setText("analytics-rate", `${Number(data.savingsRate || 0).toFixed(1)}%`);
  renderCategories(data.categories, $("analytics-categories"));
  renderChart(data.monthly, $("analytics-chart"));
  renderMerchants(data.topMerchants || DEMO_DATA.topMerchants, $("top-merchants"));
  renderRecurring(data.recurring || DEMO_DATA.recurring, $("recurring-list"));
}

async function loadTransactions() {
  try {
    const response = await api("/api/transactions");
    renderTransactionTable(response.transactions || DEMO_TRANSACTIONS);
  } catch (err) {
    renderTransactionTable(DEMO_TRANSACTIONS);
  }
}

function renderCategories(items, container) {
  if (!container) return;
  if (!Array.isArray(items) || !items.length) {
    container.innerHTML = '<div class="loading">No category data.</div>';
    return;
  }
  const max = Math.max(...items.map(x => Number(x.amount) || 0), 1);
  container.innerHTML = items.map(x => {
    const pct = Math.round((Number(x.amount) / max) * 100);
    return `<div class="category-row">
      <div class="category-name">${esc(x.category)}</div>
      <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="category-amount">${money(x.amount)}</div>
    </div>`;
  }).join("");
}

function renderChart(items, container) {
  if (!container) return;
  if (!Array.isArray(items) || !items.length) {
    container.innerHTML = '<div class="loading">No monthly data.</div>';
    return;
  }
  const max = Math.max(...items.map(x => Number(x.expenses) || 0), 1);
  container.innerHTML = items.map(x => {
    const h = Math.max(8, Math.round((Number(x.expenses) / max) * 82));
    return `<div class="chart-column">
      <div class="chart-bar" style="height:${h}%"></div>
      <div class="chart-value">${shortMoney(x.expenses)}</div>
      <div class="chart-label">${monthLabel(x.month)}</div>
    </div>`;
  }).join("");
}

function renderTransactions(items, container) {
  if (!container) return;
  container.innerHTML = items.length ? items.map(t => {
    const negative = Number(t.amount) < 0;
    return `<div class="transaction">
      <div class="transaction-icon">${icon(t.category)}</div>
      <div class="transaction-info">
        <div class="transaction-name">${esc(t.merchant)}</div>
        <div class="transaction-date">${dateLabel(t.date)} · ${esc(t.category)}</div>
      </div>
      <div class="transaction-amount ${negative ? "negative" : "positive"}">${negative ? "−" : "+"}${money(Math.abs(t.amount))}</div>
    </div>`;
  }).join("") : '<div class="loading">No transactions.</div>';
}

function renderTransactionTable(items) {
  const body = $("transaction-table-body");
  if (!body) return;
  body.innerHTML = items.length ? items.map(t => {
    const negative = Number(t.amount) < 0;
    return `<tr>
      <td>${dateLabel(t.date)}</td>
      <td>${esc(t.merchant)}</td>
      <td><span class="badge">${esc(t.category)}</span></td>
      <td class="${negative ? "negative" : "positive"}">${negative ? "−" : "+"}${money(Math.abs(t.amount))}</td>
      <td><span class="badge">Simulated</span></td>
    </tr>`;
  }).join("") : '<tr><td colspan="5">No transactions.</td></tr>';
}

function renderMerchants(items, container) {
  if (!container) return;
  container.innerHTML = (items || []).map((x,i) =>
    `<div class="transaction">
      <div class="transaction-icon">${i+1}</div>
      <div class="transaction-info"><div class="transaction-name">${esc(x.merchant)}</div><div class="transaction-date">Total spending</div></div>
      <div class="transaction-amount negative">−${money(x.amount)}</div>
    </div>`
  ).join("") || '<div class="loading">No merchant data.</div>';
}

function renderRecurring(items, container) {
  if (!container) return;
  container.innerHTML = (items || []).map(x =>
    `<div class="transaction">
      <div class="transaction-icon">↻</div>
      <div class="transaction-info"><div class="transaction-name">${esc(x.name)}</div><div class="transaction-date">${esc(x.frequency || "Monthly")}</div></div>
      <div class="transaction-amount">${money(x.amount)}</div>
    </div>`
  ).join("") || '<div class="loading">No recurring payments.</div>';
}

function renderInsight(data) {
  const el = $("main-insight");
  if (!el) return;
  const category = data.highestCategory?.category || "spending";
  el.innerHTML = `<div class="insight-symbol">✦</div><div>
    <span class="section-kicker">SAARTHI INSIGHT</span>
    <h3>Your biggest opportunity is ${esc(category.toLowerCase())}.</h3>
    <p>Saarthi estimates that you could potentially save ${money(data.potentialSavings || 0)} by reducing discretionary food and shopping expenses.</p>
  </div>`;
}

function renderHealth(score) {
  $("health-ring")?.style.setProperty("--score", `${Math.max(0,Math.min(100,score))}%`);
  setText("health-label",
    score >= 80 ? "Strong financial health" :
    score >= 60 ? "Healthy with room to improve" : "Needs attention"
  );
}

function setupChat() {
  $("send-message")?.addEventListener("click", sendChat);
  $("chat-input")?.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); sendChat(); }
  });
}

let chatContext = { lastTopic: null, history: [] };

function smartReply(message) {
  const m=message.toLowerCase();
  const d=dashboardData || {};
  const cats=d.categories || {Food:2400,Shopping:3200,Transport:1800,Bills:4200,Other:2600};
  const totalExp=Number(d.totalExpenses || Object.values(cats).reduce((a,b)=>a+Number(b||0),0));
  const income=Number(d.totalIncome || 45000);
  const savings=Number(d.netSavings ?? income-totalExp);
  let reply="", topic="general", chips=[];

  const money=n=>"₹"+Math.round(Number(n)||0).toLocaleString("en-IN");
  const top=Object.entries(cats).sort((a,b)=>Number(b[1])-Number(a[1]))[0];

  if(/hello|hi|hey|namaste|start|help|what can you do/.test(m)){
    reply=`Hi! I'm Saarthi 👋 I can analyze your spending, savings, recurring bills, financial health, and even answer questions about a purchase. Try asking naturally — you don't need a fixed command.`;
    chips=["Where do I overspend?","How can I save?","Check my financial health"];
  } else if(/spend|expense|overspend|where.*money|biggest/.test(m)){
    topic="spending";
    reply=`Your largest spending category is ${top[0]} at ${money(top[1])}. Total tracked expenses are about ${money(totalExp)}. ${Number(top[1])>totalExp*.3?"That category is worth watching because it makes up a significant share of your spending.":"Your spending is fairly distributed across categories."}`;
    chips=["How do I reduce it?","Compare my spending","What can I save?"];
  } else if(/food|restaurant|delivery|eating/.test(m)){
    topic="food";
    const food=Number(cats.Food||2400);
    reply=`You've spent about ${money(food)} on Food. A 25% reduction would free roughly ${money(food*.25)} this month. The easiest win is to set a weekly food limit and review delivery purchases.`;
    chips=["Set a food goal","Show another category","How much can I save?"];
  } else if(/save|saving|savings|cut|reduce|budget/.test(m)){
    topic="saving";
    reply=`Based on your demo cash flow, you're saving around ${money(savings)}. A practical next step is to target ${money(Math.max(500,savings*.1))} of additional monthly savings by trimming your top discretionary categories.`;
    chips=["Where should I cut?","Make me a plan","Check my health"];
  } else if(/health|score|financial.*fit|doing.*financially/.test(m)){
    topic="health";
    const score=Math.max(0,Math.min(100,Math.round(65+(savings/income)*35)));
    reply=`Your demo Financial Health Score is ${score}/100. Your strongest signal is positive cash flow; your next opportunity is controlling discretionary spending and keeping recurring bills predictable.`;
    chips=["Why this score?","How can I improve it?","Analyze my spending"];
  } else if(/income|salary|earn|cash flow|cashflow/.test(m)){
    topic="income";
    reply=`Your simulated monthly income is about ${money(income)}, with tracked expenses around ${money(totalExp)}. That leaves approximately ${money(savings)} in net savings.`;
    chips=["How much can I save?","Show expenses","Financial health"];
  } else if(/bill|recurring|subscription|utility|mobile/.test(m)){
    topic="bills";
    reply=`I found recurring commitments in your demo data. These are useful to review because small recurring charges can quietly reduce monthly savings. Open Transactions to inspect them.`;
    chips=["Show transactions","How can I save?","Financial health"];
  } else if(/transaction|purchase|spent on|merchant|payment/.test(m)){
    topic="transactions";
    reply=`Your Transactions section contains the simulated activity behind my analysis. I can help you interpret patterns, categories, and unusual spending without exposing any real banking information.`;
    chips=["Where do I overspend?","Analyze my month","Find recurring bills"];
  } else if(/afford|buy|purchase|₹|rs\.?|rupee/.test(m)){
    topic="affordability";
    reply=`I can help with an affordability check. Tell me the approximate purchase amount and what it is for. I'll compare it with your simulated monthly cash flow and savings capacity.`;
    chips=["Can I afford ₹5,000?","Can I afford ₹10,000?","Show my savings"];
  } else if(/month|monthly|analy[sz]e|summary|overview|report/.test(m)){
    topic="summary";
    reply=`Here's your quick monthly picture: income ${money(income)}, expenses ${money(totalExp)}, and net savings ${money(savings)}. Your biggest category is ${top[0]}.`;
    chips=["Where do I overspend?","How can I save?","Check my health"];
  } else if(chatContext.lastTopic==="affordability" && /\d/.test(m)){
    const amt=Number((m.match(/[\d,]+/)||["0"])[0].replace(/,/g,""));
    reply=`For a ${money(amt)} purchase, your simulated net savings are around ${money(savings)}. It looks manageable if this is a one-time purchase, but I'd avoid it if it would reduce your planned emergency buffer.`;
    chips=["What is my savings rate?","How can I save more?","Analyze my month"];
  } else {
    topic="general";
    reply=`I can help with that. In this demo I can reason over your synthetic financial data — spending, savings, income, bills, transactions, affordability and financial health. Ask me in your own words and I'll keep the conversation context.`;
    chips=["Analyze my month","Where do I spend most?","Can I afford ₹5,000?"];
  }
  chatContext.lastTopic=topic;
  chatContext.history.push({user:message,reply});
  return {reply,chips};
}


function translateAIReply(text, lang){
  if(!text || lang==="en") return text;
  const hi={
    "Hi! I'm Saarthi 👋 I can analyze your spending, savings, recurring bills, financial health, and even answer questions about a purchase. Try asking naturally — you don't need a fixed command.":"नमस्ते! मैं सारथी हूँ 👋 मैं आपके खर्च, बचत, बिल, वित्तीय स्वास्थ्य और खरीदारी से जुड़े सवालों का विश्लेषण कर सकता हूँ। आप सामान्य भाषा में पूछ सकते हैं।",
    "Your largest spending category is":"आपकी सबसे बड़ी खर्च श्रेणी है",
    "Total tracked expenses are about":"कुल ट्रैक किए गए खर्च लगभग हैं",
    "How can I reduce it?":"मैं इसे कैसे कम करूँ?",
    "How do I reduce it?":"मैं इसे कैसे कम करूँ?",
    "Your spending is fairly distributed across categories.":"आपका खर्च अलग-अलग श्रेणियों में संतुलित है।",
    "You've spent about":"आपने लगभग खर्च किए हैं",
    "on Food.":"भोजन पर।",
    "A 25% reduction would free roughly":"25% कम करने पर लगभग बचेंगे",
    "this month.":"इस महीने।",
    "Based on your demo cash flow, you're saving around":"आपके डेमो कैश फ्लो के अनुसार, आपकी बचत लगभग है",
    "A practical next step is to target":"अगला व्यावहारिक कदम लक्ष्य रखना है",
    "Your demo Financial Health Score is":"आपका डेमो वित्तीय स्वास्थ्य स्कोर है",
    "Your strongest signal is positive cash flow; your next opportunity is controlling discretionary spending and keeping recurring bills predictable.":"आपकी सबसे अच्छी बात सकारात्मक कैश फ्लो है; अगला अवसर अनावश्यक खर्च को नियंत्रित करना और नियमित बिलों को व्यवस्थित रखना है।",
    "Your simulated monthly income is about":"आपकी सिम्युलेटेड मासिक आय लगभग है",
    "with tracked expenses around":"और ट्रैक किए गए खर्च लगभग हैं",
    "That leaves approximately":"इससे लगभग बचते हैं",
    "I found recurring commitments in your demo data.":"मुझे आपके डेमो डेटा में नियमित भुगतान मिले हैं।",
    "These are useful to review because small recurring charges can quietly reduce monthly savings.":"इनकी समीक्षा करना उपयोगी है क्योंकि छोटे नियमित शुल्क मासिक बचत कम कर सकते हैं।",
    "Open Transactions to inspect them.":"उन्हें देखने के लिए Transactions खोलें।",
    "Here's your quick monthly picture:":"आपकी मासिक स्थिति का संक्षिप्त सार:",
    "Your Transactions section contains the simulated activity behind my analysis.":"आपके Transactions सेक्शन में मेरे विश्लेषण के लिए सिम्युलेटेड गतिविधि है।",
    "I can help with that.":"मैं इसमें आपकी मदद कर सकता हूँ।",
    "Ask me in your own words and I'll keep the conversation context.":"अपने शब्दों में पूछें, मैं बातचीत का संदर्भ बनाए रखूँगा।",
    "It looks manageable if this is a one-time purchase, but I'd avoid it if it would reduce your planned emergency buffer.":"अगर यह एक बार की खरीदारी है तो यह संभालने योग्य लगती है, लेकिन यदि इससे आपकी आपातकालीन बचत कम होती है तो इसे टालना बेहतर होगा।"
  };
  const gu={
    "Hi! I'm Saarthi 👋 I can analyze your spending, savings, recurring bills, financial health, and even answer questions about a purchase. Try asking naturally — you don't need a fixed command.":"નમસ્તે! હું સારથી છું 👋 હું તમારા ખર્ચ, બચત, બિલ, નાણાકીય સ્વાસ્થ્ય અને ખરીદી સંબંધિત પ્રશ્નોનું વિશ્લેષણ કરી શકું છું. તમે સામાન્ય ભાષામાં પૂછો.",
    "Your largest spending category is":"તમારી સૌથી મોટી ખર્ચ કેટેગરી છે",
    "Total tracked expenses are about":"કુલ ટ્રેક થયેલા ખર્ચ લગભગ છે",
    "Your spending is fairly distributed across categories.":"તમારો ખર્ચ કેટેગરીઓમાં સારી રીતે વહેંચાયેલો છે.",
    "You've spent about":"તમે લગભગ ખર્ચ્યા છે",
    "on Food.":"ખોરાક પર.",
    "A 25% reduction would free roughly":"25% ઘટાડાથી લગભગ બચશે",
    "this month.":"આ મહિને.",
    "Based on your demo cash flow, you're saving around":"તમારા ડેમો કેશ ફ્લો મુજબ તમારી બચત લગભગ છે",
    "Your demo Financial Health Score is":"તમારો ડેમો નાણાકીય સ્વાસ્થ્ય સ્કોર છે",
    "Your strongest signal is positive cash flow; your next opportunity is controlling discretionary spending and keeping recurring bills predictable.":"તમારી મજબૂત બાબત સકારાત્મક કેશ ફ્લો છે; આગળ બિનજરૂરી ખર્ચ નિયંત્રિત કરવો અને નિયમિત બિલ વ્યવસ્થિત રાખવા જોઈએ.",
    "Your simulated monthly income is about":"તમારી સિમ્યુલેટેડ માસિક આવક લગભગ છે",
    "That leaves approximately":"આથી લગભગ બાકી રહે છે",
    "I found recurring commitments in your demo data.":"તમારા ડેમો ડેટામાં નિયમિત ચૂકવણીઓ મળી છે.",
    "Here's your quick monthly picture:":"તમારી માસિક સ્થિતિનો ટૂંકો સાર:",
    "I can help with that.":"હું તેમાં તમારી મદદ કરી શકું છું.",
    "Ask me in your own words and I'll keep the conversation context.":"તમારા શબ્દોમાં પૂછો, હું વાતચીતનો સંદર્ભ જાળવી રાખીશ."
  };
  let out=text;
  const dict=lang==="hi"?hi:gu;
  Object.entries(dict).forEach(([a,b])=>{out=out.split(a).join(b);});
  return out;
}


function localizedChips(chips){
  const l=localStorage.getItem("saarthi_lang")||"en";
  if(l==="en")return chips;
  const map={
   hi:{"Where do I overspend?":"मैं कहाँ ज़्यादा खर्च करता हूँ?","How can I save?":"मैं कैसे बचत करूँ?","Check my financial health":"मेरा वित्तीय स्वास्थ्य देखें","How do I reduce it?":"मैं इसे कैसे कम करूँ?","Compare my spending":"मेरे खर्च की तुलना करें","What can I save?":"मैं कितना बचा सकता हूँ?","Show food spending":"भोजन का खर्च दिखाएँ","How much can I save?":"मैं कितना बचा सकता हूँ?","Show another category":"दूसरी श्रेणी दिखाएँ","Set a food goal":"फूड लक्ष्य सेट करें","Make me a plan":"मेरे लिए योजना बनाएं","Show transactions":"लेन-देन दिखाएँ","Find recurring bills":"नियमित बिल खोजें","Analyze my month":"मेरे महीने का विश्लेषण करें","Where do I spend most?":"मैं सबसे ज्यादा कहाँ खर्च करता हूँ?","Can I afford ₹5,000?":"क्या मैं ₹5,000 खर्च कर सकता हूँ?","Can I afford ₹10,000?":"क्या मैं ₹10,000 खर्च कर सकता हूँ?"},
   gu:{"Where do I overspend?":"હું ક્યાં વધુ ખર્ચું છું?","How can I save?":"હું કેવી રીતે બચત કરું?","Check my financial health":"મારું નાણાકીય સ્વાસ્થ્ય જુઓ","How do I reduce it?":"હું તેને કેવી રીતે ઘટાડું?","Compare my spending":"મારા ખર્ચની સરખામણી કરો","What can I save?":"હું કેટલું બચાવી શકું?","Show food spending":"ખોરાકનો ખર્ચ બતાવો","How much can I save?":"હું કેટલું બચાવી શકું?","Show another category":"બીજી કેટેગરી બતાવો","Set a food goal":"ફૂડ લક્ષ્ય સેટ કરો","Make me a plan":"મારા માટે યોજના બનાવો","Show transactions":"વ્યવહારો બતાવો","Find recurring bills":"નિયમિત બિલ શોધો","Analyze my month":"મારા મહિનાનું વિશ્લેષણ કરો","Where do I spend most?":"હું સૌથી વધુ ક્યાં ખર્ચું છું?","Can I afford ₹5,000?":"શું હું ₹5,000 ખર્ચી શકું?"}
  };
  const d=map[l]||{};return chips.map(x=>d[x]||x);
}

function renderChatChips(chips){
  const box=$("chat-messages"); if(!box) return;
  const old=box.querySelector(".ai-chips"); if(old) old.remove();
  if(!chips?.length)return;
  chips=localizedChips(chips);
  const wrap=document.createElement("div"); wrap.className="ai-chips";
  chips.forEach(c=>{const b=document.createElement("button");b.className="prompt";b.textContent=c;b.addEventListener("click",()=>{$("chat-input").value=c;sendChat();});wrap.appendChild(b);});
  box.appendChild(wrap);
}

async function sendChat() {
  const input=$("chat-input"); if(!input)return;
  const message=input.value.trim(); if(!message)return;
  addMessage(message,"user"); input.value="";
  const thinking=addMessage("Thinking…","ai");
  try{
    const result=await api("/api/chat",{method:"POST",body:JSON.stringify({message,history:chatContext.history.slice(-6)})});
    const fallback=smartReply(message);
    if(thinking) thinking.textContent=translateAIReply(result.reply||fallback.reply,localStorage.getItem("saarthi_lang")||"en");
    renderChatChips(fallback.chips);
  }catch{
    const result=smartReply(message);
    if(thinking) thinking.textContent=translateAIReply(result.reply,localStorage.getItem("saarthi_lang")||"en");
    renderChatChips(result.chips);
  }
}

function localReply(message) {
  const m = message.toLowerCase();
  if (m.includes("most") || m.includes("spend"))
    return "Your highest spending category is Bills at ₹4,200, followed by Shopping at ₹3,200.";
  if (m.includes("save"))
    return "You could potentially save about ₹3,100 by reducing discretionary shopping and food expenses.";
  if (m.includes("health") || m.includes("score"))
    return "Your simulated financial health score is 84/100 — strong, with room to improve your discretionary spending.";
  if (m.includes("food"))
    return "Your demo food spending is ₹2,400. The largest recent food transactions are Swiggy and BigBasket.";
  if (m.includes("bill"))
    return "Your recurring demo bills include Utilities ₹1,800, Netflix ₹649 and Mobile ₹599.";
  return "Based on your simulated finances, you have ₹37,800 in net savings and a 72.7% savings rate. Ask me about spending, food, bills or savings.";
}

function addMessage(text,type) {
  const box = $("chat-messages");
  if (!box) return null;
  const el = document.createElement("div");
  el.className = `message ${type}`;
  if(type==="ai" && !box.children.length) el.dataset.default="yes";
  el.textContent = text;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
  return el;
}

async function loadBanks() {
  const box = $("bank-list");
  if (!box) return;

  let banks = ["SBI","HDFC Bank","ICICI Bank","Axis Bank"];
  try {
    const result = await api("/api/banks");
    if (Array.isArray(result) && result.length) banks = result;
  } catch {}

  box.innerHTML = banks.map(bank => {
    const name = typeof bank === "string" ? bank : (bank.name || "Demo Bank");
    const short = typeof bank === "string" ? name.slice(0,3).toUpperCase() : (bank.shortName || name.slice(0,3));
    return `<div class="panel bank-card">
      <div class="bank-logo">${esc(short)}</div>
      <div class="bank-info"><strong>${esc(name)}</strong><span>Synthetic demo connection</span></div>
      <button class="connect-btn" data-bank="${esc(name)}">Connect</button>
    </div>`;
  }).join("");
}

function connectBank(name, button) {
  if (button) {
    button.textContent = "Connected ✓";
    button.disabled = true;
  }
  showToast(`${name} connected in demo mode. No real account was accessed.`);
}

function setupPayment() {
  $("simulate-payment")?.addEventListener("click", simulatePayment);
}

async function simulatePayment() {
  const button = $("simulate-payment");
  const old = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = "Processing…";
  }

  try {
    const result = await api("/api/payment/simulate", {
      method:"POST",
      body:JSON.stringify({amount:2100})
    });
    showToast(`${result.message || "Payment simulated successfully."}${result.transactionId ? " · ID: " + result.transactionId : ""}`);
  } catch {
    showToast("₹2,100 payment simulated successfully. No real money was moved.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = old || "Simulate ₹2,100 →";
    }
  }
}

function showToast(message) {
  let toast = $("saarthi-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "saarthi-toast";
    Object.assign(toast.style,{
      position:"fixed",right:"22px",bottom:"22px",zIndex:"9999",
      background:"#29264e",color:"#fff",padding:"13px 17px",
      borderRadius:"12px",fontSize:"12px",fontWeight:"700",
      boxShadow:"0 12px 35px #0003",maxWidth:"340px"
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.style.opacity = "0", 3200);
}

function setText(id,value) {
  const el = $(id);
  if (el) el.textContent = value;
}
function money(value) {
  return `₹${(Number(value)||0).toLocaleString("en-IN")}`;
}
function shortMoney(value) {
  const n = Number(value)||0;
  return n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${Math.round(n/1000)}K` : `₹${n}`;
}
function monthLabel(value) {
  if (!value) return "—";
  return new Date(`${value}-01T00:00:00`).toLocaleDateString("en-IN",{month:"short"});
}
function dateLabel(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
}
function icon(category) {
  return ({Food:"🍽",Shopping:"🛍",Transport:"🚗",Bills:"▣",Income:"↗"})[category] || "•";
}
function esc(value) {
  return String(value ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
