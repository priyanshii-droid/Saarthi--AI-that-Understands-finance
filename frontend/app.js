const API_BASE =
  "https://saarthi-ai-that-understands-finance.onrender.com";

let dashboardData = null;
let analyticsData = null;
let transactionsData = [];

const $ = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/* =========================
   INITIAL LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupChat();
  setupMobileMenu();
  loadDashboard();
});

/* =========================
   NAVIGATION
========================= */

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.dataset.section;

      if (!target) return;

      document.querySelectorAll(".nav-item").forEach((nav) => {
        nav.classList.remove("active");
      });

      item.classList.add("active");

      document.querySelectorAll(".section").forEach((section) => {
        section.classList.remove("active");
      });

      const section = $(`${target}-section`);

      if (section) {
        section.classList.add("active");
      }

      updatePageTitle(target);

      if (target === "transactions") {
        loadTransactions();
      }

      if (target === "analytics") {
        loadAnalytics();
      }

      closeMobileMenu();
    });
  });
}

function updatePageTitle(section) {
  const titles = {
    dashboard: [
      "Financial overview",
      "Your money, understood simply."
    ],
    analytics: [
      "Financial intelligence",
      "See where your money is going."
    ],
    transactions: [
      "Transactions",
      "Your simulated financial activity."
    ],
    chat: [
      "Ask Saarthi",
      "Your AI financial companion."
    ],
    banks: [
      "Connect bank",
      "Demo bank connections only."
    ]
  };

  const data = titles[section] || titles.dashboard;

  const title = $("page-title");
  const subtitle = $("page-subtitle");

  if (title) title.textContent = data[0];
  if (subtitle) subtitle.textContent = data[1];
}

/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {
  const button = $("mobile-menu");

  if (!button) return;

  button.addEventListener("click", () => {
    $("sidebar")?.classList.toggle("open");
  });
}

function closeMobileMenu() {
  $("sidebar")?.classList.remove("open");
}

/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {
  try {
    const data = await api("/api/dashboard");

    dashboardData = data;
    analyticsData = data;

    renderDashboard(data);
  } catch (error) {
    console.error(error);
    showError("dashboard", "Unable to load demo financial data.");
  }
}

function renderDashboard(data) {
  setText("balance", formatCurrency(data.balance));
  setText("income", formatCurrency(data.totalIncome));
  setText("expenses", formatCurrency(data.totalExpenses));
  setText("savings", formatCurrency(data.netSavings));

  setText(
    "savings-rate",
    `${data.savingsRate}% savings rate`
  );

  setText(
    "health-score",
    `${data.healthScore}`
  );

  setText(
    "potential-savings",
    formatCurrency(data.potentialSavings)
  );

  if (data.highestCategory) {
    setText(
      "highest-category",
      data.highestCategory.category
    );

    setText(
      "highest-category-amount",
      formatCurrency(data.highestCategory.amount)
    );
  }

  renderCategories(
    data.categories,
    $("dashboard-categories")
  );

  renderMonthlyChart(
    data.monthly,
    $("monthly-chart")
  );

  renderTransactions(
    data.recentTransactions || [],
    $("recent-transactions")
  );

  renderInsight(data);
  renderHealth(data.healthScore);
}

/* =========================
   ANALYTICS
========================= */

async function loadAnalytics() {
  try {
    const data = await api("/api/analytics");

    analyticsData = data.analytics;

    renderAnalytics(analyticsData);
  } catch (error) {
    console.error(error);
    showError("analytics", "Analytics could not be loaded.");
  }
}

function renderAnalytics(data) {
  setText(
    "analytics-income",
    formatCurrency(data.totalIncome)
  );

  setText(
    "analytics-expenses",
    formatCurrency(data.totalExpenses)
  );

  setText(
    "analytics-savings",
    formatCurrency(data.netSavings)
  );

  setText(
    "analytics-rate",
    `${data.savingsRate}%`
  );

  renderCategories(
    data.categories,
    $("analytics-categories")
  );

  renderMonthlyChart(
    data.monthly,
    $("analytics-chart")
  );

  renderMerchants(
    data.topMerchants,
    $("top-merchants")
  );

  renderRecurring(
    data.recurring,
    $("recurring-list")
  );
}

/* =========================
   TRANSACTIONS
========================= */

async function loadTransactions() {
  try {
    const data = await api("/api/transactions");

    transactionsData = data.transactions;

    renderTransactionTable(transactionsData);
  } catch (error) {
    console.error(error);
    showError(
      "transactions",
      "Transactions could not be loaded."
    );
  }
}

function renderTransactionTable(transactions) {
  const body = $("transaction-table-body");

  if (!body) return;

  body.innerHTML = "";

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const amountClass =
      transaction.amount < 0
        ? "negative"
        : "positive";

    const amount =
      transaction.amount < 0
        ? `−${formatCurrency(Math.abs(transaction.amount))}`
        : `+${formatCurrency(transaction.amount)}`;

    row.innerHTML = `
      <td>${formatDate(transaction.date)}</td>
      <td>${escapeHTML(transaction.merchant)}</td>
      <td>
        <span class="badge">
          ${escapeHTML(transaction.category)}
        </span>
      </td>
      <td class="${amountClass}">
        ${amount}
      </td>
      <td>
        <span class="badge">Simulated</span>
      </td>
    `;

    body.appendChild(row);
  });
}

/* =========================
   CATEGORIES
========================= */

function renderCategories(categories, container) {
  if (!container) return;

  if (!categories || !categories.length) {
    container.innerHTML =
      `<div class="loading">No category data available.</div>`;
    return;
  }

  const max =
    Math.max(...categories.map((item) => item.amount));

  container.innerHTML = categories
    .map((item) => {
      const percentage =
        max > 0
          ? Math.round((item.amount / max) * 100)
          : 0;

      return `
        <div class="category-row">
          <div class="category-name">
            ${escapeHTML(item.category)}
          </div>

          <div class="progress">
            <div
              class="progress-fill"
              style="width:${percentage}%"
            ></div>
          </div>

          <div class="category-amount">
            ${formatCurrency(item.amount)}
          </div>
        </div>
      `;
    })
    .join("");
}

/* =========================
   MONTHLY CHART
========================= */

function renderMonthlyChart(months, container) {
  if (!container) return;

  if (!months || !months.length) {
    container.innerHTML =
      `<div class="loading">No monthly data available.</div>`;
    return;
  }

  const max =
    Math.max(...months.map((m) => m.expenses));

  container.innerHTML = months
    .map((month) => {
      const height =
        max > 0
          ? Math.max(
              10,
              Math.round(
                (month.expenses / max) * 82
              )
            )
          : 10;

      const label = formatMonth(month.month);

      return `
        <div class="chart-column">
          <div
            class="chart-bar"
            style="height:${height}%"
            title="${formatCurrency(month.expenses)} spent"
          ></div>

          <div class="chart-value">
            ${formatCurrencyShort(month.expenses)}
          </div>

          <div class="chart-label">
            ${label}
          </div>
        </div>
      `;
    })
    .join("");
}

/* =========================
   MERCHANTS
========================= */

function renderMerchants(merchants, container) {
  if (!container) return;

  if (!merchants || !merchants.length) {
    container.innerHTML =
      `<div class="loading">No merchant data available.</div>`;
    return;
  }

  container.innerHTML = merchants
    .map(
      (merchant, index) => `
        <div class="transaction">
          <div class="transaction-icon">
            ${index + 1}
          </div>

          <div class="transaction-info">
            <div class="transaction-name">
              ${escapeHTML(merchant.merchant)}
            </div>

            <div class="transaction-date">
              Total spending
            </div>
          </div>

          <div class="transaction-amount negative">
            −${formatCurrency(merchant.amount)}
          </div>
        </div>
      `
    )
    .join("");
}

/* =========================
   RECURRING
========================= */

function renderRecurring(items, container) {
  if (!container) return;

  if (!items || !items.length) {
    container.innerHTML =
      `<div class="loading">No recurring payments.</div>`;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <div class="transaction">
          <div class="transaction-icon">
            ↻
          </div>

          <div class="transaction-info">
            <div class="transaction-name">
              ${escapeHTML(item.name)}
            </div>

            <div class="transaction-date">
              ${escapeHTML(item.frequency)}
            </div>
          </div>

          <div class="transaction-amount">
            ${formatCurrency(item.amount)}
          </div>
        </div>
      `
    )
    .join("");
}

/* =========================
   RECENT TRANSACTIONS
========================= */

function renderTransactions(transactions, container) {
  if (!container) return;

  if (!transactions.length) {
    container.innerHTML =
      `<div class="loading">No transactions available.</div>`;
    return;
  }

  container.innerHTML = transactions
    .map((transaction) => {
      const icon = getCategoryIcon(
        transaction.category
      );

      const amount =
        transaction.amount < 0
          ? `−${formatCurrency(Math.abs(transaction.amount))}`
          : `+${formatCurrency(transaction.amount)}`;

      const amountClass =
        transaction.amount < 0
          ? "negative"
          : "positive";

      return `
        <div class="transaction">
          <div class="transaction-icon">
            ${icon}
          </div>

          <div class="transaction-info">
            <div class="transaction-name">
              ${escapeHTML(transaction.merchant)}
            </div>

            <div class="transaction-date">
              ${formatDate(transaction.date)}
              ·
              ${escapeHTML(transaction.category)}
            </div>
          </div>

          <div class="transaction-amount ${amountClass}">
            ${amount}
          </div>
        </div>
      `;
    })
    .join("");
}

/* =========================
   INSIGHTS
========================= */

function renderInsight(data) {
  const insight = $("main-insight");

  if (!insight) return;

  const category = data.highestCategory?.category || "spending";

  insight.innerHTML = `
    <div class="insight-label">
      Saarthi insight
    </div>

    <h3>
      Your biggest opportunity is ${escapeHTML(category.toLowerCase())}.
    </h3>

    <p>
      Saarthi estimates that you could potentially save
      ${formatCurrency(data.potentialSavings)}
      by reducing discretionary food and shopping expenses.
    </p>
  `;
}

/* =========================
   HEALTH
========================= */

function renderHealth(score) {
  const ring = $("health-ring");

  if (ring) {
    ring.style.setProperty(
      "--score",
      `${score}%`
    );
  }

  const label = $("health-label");

  if (!label) return;

  if (score >= 80) {
    label.textContent = "Strong financial health";
  } else if (score >= 60) {
    label.textContent = "Healthy with room to improve";
  } else {
    label.textContent = "Needs attention";
  }
}

/* =========================
   CHAT
========================= */

function setupChat() {
  const input = $("chat-input");
  const button = $("send-message");

  if (!input || !button) return;

  button.addEventListener("click", sendChatMessage);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendChatMessage();
    }
  });

  document.querySelectorAll(".prompt").forEach((prompt) => {
    prompt.addEventListener("click", () => {
      input.value = prompt.textContent.trim();
      sendChatMessage();
    });
  });
}

async function sendChatMessage() {
  const input = $("chat-input");

  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  addChatMessage(message, "user");

  input.value = "";

  const thinking = addChatMessage(
    "Thinking…",
    "ai"
  );

  try {
    const data = await api("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message
      })
    });

    thinking.textContent =
      data.reply || "I couldn't generate an answer.";
  } catch (error) {
    console.error(error);

    thinking.textContent =
      "I'm having trouble reaching the Saarthi demo service. Please try again.";
  }
}

function addChatMessage(text, type) {
  const messages = $("chat-messages");

  if (!messages) return null;

  const message = document.createElement("div");

  message.className =
    `message ${type}`;

  message.textContent = text;

  messages.appendChild(message);

  messages.scrollTop =
    messages.scrollHeight;

  return message;
}

/* =========================
   BANKS
========================= */

async function loadBanks() {
  const container = $("bank-list");

  if (!container) return;

  container.innerHTML =
    `<div class="loading">Loading demo banks…</div>`;

  try {
    const banks = await api("/api/banks");

    container.innerHTML = banks
      .map(
        (bank) => `
          <div class="card bank-card">
            <div class="bank-logo">
              ${escapeHTML(
                bank.shortName ||
                bank.name.substring(0, 3)
              )}
            </div>

            <div class="bank-info">
              <strong>
                ${escapeHTML(bank.name)}
              </strong>

              <span>
                Synthetic demo connection
              </span>
            </div>

            <button
              class="connect-btn"
              onclick="simulateBankConnection('${escapeHTML(bank.name)}')"
            >
              Connect
            </button>
          </div>
        `
      )
      .join("");
  } catch (error) {
    container.innerHTML =
     
