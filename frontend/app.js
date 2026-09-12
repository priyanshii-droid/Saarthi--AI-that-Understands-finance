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

async function sendChat() {
  const input = $("chat-input");
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";
  const thinking = addMessage("Thinking…", "ai");

  try {
    const result = await api("/api/chat", {
      method:"POST",
      body:JSON.stringify({message})
    });
    if (thinking) thinking.textContent = result.reply || localReply(message);
  } catch {
    if (thinking) thinking.textContent = localReply(message);
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
