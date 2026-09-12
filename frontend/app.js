const API_BASE = "https://saarthi-ai-that-understands-finance.onrender.com";

const $ = (id) => document.getElementById(id);
let dashboardData = null;
let analyticsData = null;

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
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
  $("simulate-payment")?.addEventListener("click", simulatePayment);
  loadDashboard();
  loadBanks();
});

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
  });
}

function showSection(name) {
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.section === name));
  document.querySelectorAll(".section").forEach(s => s.classList.toggle("active", s.id === `${name}-section`));
  const titles = {
    dashboard: ["Financial overview", "Your money, understood simply."],
    analytics: ["Financial intelligence", "See where your money is going."],
    transactions: ["Transactions", "Your simulated financial activity."],
    chat: ["Ask Saarthi", "Your AI financial companion."],
    banks: ["Connect bank", "Demo bank connections only."]
  };
  const t = titles[name] || titles.dashboard;
  setText("page-title", t[0]);
  setText("page-subtitle", t[1]);
  if (name === "analytics") loadAnalytics();
  if (name === "transactions") loadTransactions();
  closeMobileMenu();
}

function setupHeroButtons() {
  document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.go));
  });
}

function setupMobileMenu() {
  $("mobile-menu")?.addEventListener("click", () => $("sidebar")?.classList.toggle("open"));
}
function closeMobileMenu() { $("sidebar")?.classList.remove("open"); }

async function loadDashboard() {
  try {
    const data = await api("/api/dashboard");
    dashboardData = data;
    renderDashboard(data);
  } catch (err) {
    console.error("SAARTHI dashboard:", err);
    showError("dashboard", "Unable to reach the demo finance service.");
  }
}

function renderDashboard(data) {
  setText("balance", money(data.balance));
  setText("income", money(data.totalIncome));
  setText("expenses", money(data.totalExpenses));
  setText("savings", money(data.netSavings));
  setText("savings-rate", `${data.savingsRate ?? 0}% savings rate`);
  setText("health-score", data.healthScore ?? "—");
  setText("potential-savings", money(data.potentialSavings || 0));
  renderCategories(data.categories, $("dashboard-categories"));
  renderChart(data.monthly, $("monthly-chart"));
  renderTransactions(data.recentTransactions || [], $("recent-transactions"));
  renderInsight(data);
  renderHealth(Number(data.healthScore) || 0);
}

async function loadAnalytics() {
  try {
    const response = await api("/api/analytics");
    analyticsData = response.analytics || response;
    renderAnalytics(analyticsData);
  } catch (err) {
    console.error("SAARTHI analytics:", err);
    showError("analytics", "Analytics could not be loaded.");
  }
}

function renderAnalytics(data) {
  setText("analytics-income", money(data.totalIncome));
  setText("analytics-expenses", money(data.totalExpenses));
  setText("analytics-savings", money(data.netSavings));
  setText("analytics-rate", `${data.savingsRate ?? 0}%`);
  renderCategories(data.categories, $("analytics-categories"));
  renderChart(data.monthly, $("analytics-chart"));
  renderMerchants(data.topMerchants, $("top-merchants"));
  renderRecurring(data.recurring, $("recurring-list"));
}

async function loadTransactions() {
  try {
    const response = await api("/api/transactions");
    renderTransactionTable(response.transactions || []);
  } catch (err) {
    console.error("SAARTHI transactions:", err);
    showError("transactions", "Transactions could not be loaded.");
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
  container.innerHTML = (items || []).map((x, i) => `<div class="transaction">
    <div class="transaction-icon">${i + 1}</div>
    <div class="transaction-info"><div class="transaction-name">${esc(x.merchant)}</div><div class="transaction-date">Total spending</div></div>
    <div class="transaction-amount negative">−${money(x.amount)}</div>
  </div>`).join("") || '<div class="loading">No merchant data.</div>';
}

function renderRecurring(items, container) {
  if (!container) return;
  container.innerHTML = (items || []).map(x => `<div class="transaction">
    <div class="transaction-icon">↻</div>
    <div class="transaction-info"><div class="transaction-name">${esc(x.name)}</div><div class="transaction-date">${esc(x.frequency || "Monthly")}</div></div>
    <div class="transaction-amount">${money(x.amount)}</div>
  </div>`).join("") || '<div class="loading">No recurring payments.</div>';
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
  $("health-ring")?.style.setProperty("--score", `${Math.max(0, Math.min(100, score))}%`);
  setText("health-label", score >= 80 ? "Strong financial health" : score >= 60 ? "Healthy with room to improve" : "Needs attention");
}

function setupChat() {
  $("send-message")?.addEventListener("click", sendChat);
  $("chat-input")?.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); sendChat(); }
  });
  document.querySelectorAll(".prompt").forEach(p => p.addEventListener("click", () => {
    const input = $("chat-input");
    if (input) { input.value = p.textContent.trim(); sendChat(); }
  }));
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
    const result = await api("/api/chat", { method: "POST", body: JSON.stringify({ message }) });
    if (thinking) thinking.textContent = result.reply || "I couldn't generate an answer.";
  } catch {
    if (thinking) thinking.textContent = "The demo service is temporarily unavailable. Please try again.";
  }
}

function addMessage(text, type) {
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
  try {
    const banks = await api("/api/banks");
    box.innerHTML = banks.map(b => `<div class="panel bank-card">
      <div class="bank-logo">${esc(b.shortName || b.name.slice(0,3))}</div>
      <div class="bank-info"><strong>${esc(b.name)}</strong><span>Synthetic demo connection</span></div>
      <button class="connect-btn" data-bank="${esc(b.name)}">Connect</button>
    </div>`).join("");
    box.querySelectorAll(".connect-btn").forEach(btn => btn.addEventListener("click", () => {
      alert(`${btn.dataset.bank} demo connection successful.\nNo real bank account was connected.`);
    }));
  } catch {
    box.innerHTML = '<div class="loading">Demo banks could not be loaded.</div>';
  }
}

async function simulatePayment() {
  try {
    const result = await api("/api/payment/simulate", {
      method: "POST",
      body: JSON.stringify({ amount: 2100 })
    });
    alert(`${result.message}\nTransaction ID: ${result.transactionId}`);
  } catch {
    alert("Payment simulation could not be completed.");
  }
}

function showError(section, message) {
  const target = $(`${section}-section`);
  if (!target || target.querySelector(".api-error")) return;
  const el = document.createElement("div");
  el.className = "api-error";
  el.textContent = message;
  target.prepend(el);
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}
function money(value) {
  return `₹${(Number(value) || 0).toLocaleString("en-IN")}`;
}
function shortMoney(value) {
  const n = Number(value) || 0;
  return n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${Math.round(n/1000)}K` : `₹${n}`;
}
function monthLabel(value) {
  if (!value) return "—";
  return new Date(`${value}-01T00:00:00`).toLocaleDateString("en-IN", { month:"short" });
}
function dateLabel(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day:"2-digit", month:"short" });
}
function icon(category) {
  return ({Food:"🍽",Shopping:"🛍",Transport:"🚗",Bills:"▣",Income:"↗"})[category] || "•";
}
function esc(value) {
  return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
