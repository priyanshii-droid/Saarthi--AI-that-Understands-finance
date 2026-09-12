const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// SAARTHI DEMO DATA
// NO REAL BANKING / PAYMENT DATA
// =====================================================

const banks = [
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI"
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    shortName: "HDFC"
  },
  {
    id: "icici",
    name: "ICICI Bank",
    shortName: "ICICI"
  },
  {
    id: "axis",
    name: "Axis Bank",
    shortName: "Axis"
  }
];

const transactions = [
  {
    id: 1,
    date: "2026-09-10",
    merchant: "Swiggy",
    category: "Food",
    amount: -420
  },
  {
    id: 2,
    date: "2026-09-09",
    merchant: "Amazon",
    category: "Shopping",
    amount: -1299
  },
  {
    id: 3,
    date: "2026-09-08",
    merchant: "Uber",
    category: "Transport",
    amount: -280
  },
  {
    id: 4,
    date: "2026-09-07",
    merchant: "Electricity Bill",
    category: "Bills",
    amount: -1800
  },
  {
    id: 5,
    date: "2026-09-06",
    merchant: "Salary Credit",
    category: "Income",
    amount: 42000
  },
  {
    id: 6,
    date: "2026-09-05",
    merchant: "Swiggy",
    category: "Food",
    amount: -350
  },
  {
    id: 7,
    date: "2026-09-04",
    merchant: "Amazon",
    category: "Shopping",
    amount: -799
  },
  {
    id: 8,
    date: "2026-09-03",
    merchant: "Mobile Recharge",
    category: "Bills",
    amount: -599
  },
  {
    id: 9,
    date: "2026-09-02",
    merchant: "Uber",
    category: "Transport",
    amount: -320
  },
  {
    id: 10,
    date: "2026-09-01",
    merchant: "BigBasket",
    category: "Food",
    amount: -850
  },

  {
    id: 11,
    date: "2026-08-29",
    merchant: "Swiggy",
    category: "Food",
    amount: -520
  },
  {
    id: 12,
    date: "2026-08-27",
    merchant: "Amazon",
    category: "Shopping",
    amount: -1599
  },
  {
    id: 13,
    date: "2026-08-25",
    merchant: "Uber",
    category: "Transport",
    amount: -410
  },
  {
    id: 14,
    date: "2026-08-22",
    merchant: "Electricity Bill",
    category: "Bills",
    amount: -1750
  },
  {
    id: 15,
    date: "2026-08-20",
    merchant: "Swiggy",
    category: "Food",
    amount: -440
  },
  {
    id: 16,
    date: "2026-08-18",
    merchant: "Myntra",
    category: "Shopping",
    amount: -2200
  },
  {
    id: 17,
    date: "2026-08-15",
    merchant: "Salary Credit",
    category: "Income",
    amount: 42000
  },
  {
    id: 18,
    date: "2026-08-13",
    merchant: "Uber",
    category: "Transport",
    amount: -360
  },
  {
    id: 19,
    date: "2026-08-10",
    merchant: "Mobile Recharge",
    category: "Bills",
    amount: -599
  },
  {
    id: 20,
    date: "2026-08-08",
    merchant: "BigBasket",
    category: "Food",
    amount: -920
  },

  {
    id: 21,
    date: "2026-07-30",
    merchant: "Swiggy",
    category: "Food",
    amount: -380
  },
  {
    id: 22,
    date: "2026-07-27",
    merchant: "Amazon",
    category: "Shopping",
    amount: -999
  },
  {
    id: 23,
    date: "2026-07-24",
    merchant: "Uber",
    category: "Transport",
    amount: -290
  },
  {
    id: 24,
    date: "2026-07-22",
    merchant: "Electricity Bill",
    category: "Bills",
    amount: -1650
  },
  {
    id: 25,
    date: "2026-07-18",
    merchant: "Salary Credit",
    category: "Income",
    amount: 42000
  },
  {
    id: 26,
    date: "2026-07-15",
    merchant: "Swiggy",
    category: "Food",
    amount: -460
  },
  {
    id: 27,
    date: "2026-07-12",
    merchant: "Myntra",
    category: "Shopping",
    amount: -1800
  },
  {
    id: 28,
    date: "2026-07-09",
    merchant: "Uber",
    category: "Transport",
    amount: -340
  },
  {
    id: 29,
    date: "2026-07-05",
    merchant: "Mobile Recharge",
    category: "Bills",
    amount: -599
  },
  {
    id: 30,
    date: "2026-07-03",
    merchant: "BigBasket",
    category: "Food",
    amount: -780
  }
];

// =====================================================
// ANALYTICS
// =====================================================

function getAnalytics() {
  const incomeTransactions = transactions.filter(
    (t) => t.amount > 0
  );

  const expenseTransactions = transactions.filter(
    (t) => t.amount < 0
  );

  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );

  const netSavings = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome === 0
      ? 0
      : Math.round((netSavings / totalIncome) * 100);

  // Categories
  const categoryMap = {};

  expenseTransactions.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }

    categoryMap[t.category] += Math.abs(t.amount);
  });

  const categories = Object.keys(categoryMap)
    .map((category) => ({
      category,
      amount: categoryMap[category]
    }))
    .sort((a, b) => b.amount - a.amount);

  const highestCategory = categories[0] || {
    category: "None",
    amount: 0
  };

  // Monthly data
  const monthlyMap = {};

  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);

    if (!monthlyMap[month]) {
      monthlyMap[month] = {
        income: 0,
        expenses: 0
      };
    }

    if (t.amount > 0) {
      monthlyMap[month].income += t.amount;
    } else {
      monthlyMap[month].expenses += Math.abs(t.amount);
    }
  });

  const monthly = Object.keys(monthlyMap)
    .sort()
    .map((month) => ({
      month,
      income: monthlyMap[month].income,
      expenses: monthlyMap[month].expenses,
      savings:
        monthlyMap[month].income -
        monthlyMap[month].expenses
    }));

  // Merchant totals
  const merchantMap = {};

  expenseTransactions.forEach((t) => {
    if (!merchantMap[t.merchant]) {
      merchantMap[t.merchant] = 0;
    }

    merchantMap[t.merchant] += Math.abs(t.amount);
  });

  const topMerchants = Object.keys(merchantMap)
    .map((merchant) => ({
      merchant,
      amount: merchantMap[merchant]
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Recurring payments
  const recurring = [
    {
      name: "Electricity Bill",
      amount: 1800,
      frequency: "Monthly"
    },
    {
      name: "Mobile Recharge",
      amount: 599,
      frequency: "Monthly"
    }
  ];

  // Savings opportunity
  const potentialSavings = Math.round(
    (categoryMap.Food || 0) * 0.15 +
    (categoryMap.Shopping || 0) * 0.20
  );

  // Health score
  let healthScore = 70;

  if (savingsRate >= 30) {
    healthScore += 15;
  } else if (savingsRate >= 20) {
    healthScore += 8;
  } else if (savingsRate < 10) {
    healthScore -= 10;
  }

  if (highestCategory.amount > 5000) {
    healthScore -= 5;
  }

  healthScore = Math.max(
    0,
    Math.min(100, healthScore)
  );

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    categories,
    monthly,
    highestCategory,
    topMerchants,
    recurring,
    potentialSavings,
    healthScore
  };
}

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    service: "SAARTHI AI Finance API",
    status: "running",
    mode: "SIMULATION",
    version: "2.0",
    message:
      "No real banking accounts, credentials, customer data or payment systems are connected."
  });
});

// =====================================================
// HEALTH
// =====================================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SAARTHI",
    mode: "SIMULATION"
  });
});

// =====================================================
// BANKS
// =====================================================

app.get("/api/banks", (req, res) => {
  res.json(banks);
});

// =====================================================
// TRANSACTIONS
// =====================================================

app.get("/api/transactions", (req, res) => {
  res.json({
    simulated: true,
    transactions
  });
});

// =====================================================
// ANALYTICS
// =====================================================

app.get("/api/analytics", (req, res) => {
  res.json({
    simulated: true,
    analytics: getAnalytics()
  });
});

// =====================================================
// DASHBOARD
// =====================================================

app.get("/api/dashboard", (req, res) => {
  const analytics = getAnalytics();

  res.json({
    simulated: true,
    balance: 24500,

    totalIncome: analytics.totalIncome,
    totalExpenses: analytics.totalExpenses,
    netSavings: analytics.netSavings,
    savingsRate: analytics.savingsRate,

    categories: analytics.categories,

    monthly: analytics.monthly,

    highestCategory:
      analytics.highestCategory,

    topMerchants:
      analytics.topMerchants,

    recurring:
      analytics.recurring,

    potentialSavings:
      analytics.potentialSavings,

    healthScore:
      analytics.healthScore,

    recentTransactions:
      transactions.slice(0, 8)
  });
});

// =====================================================
// AI ANALYSIS
// =====================================================

app.post("/api/analyze", (req, res) => {
  const analytics = getAnalytics();

  res.json({
    simulated: true,

    totalIncome: analytics.totalIncome,
    totalExpenses: analytics.totalExpenses,
    netSavings: analytics.netSavings,
    savingsRate: analytics.savingsRate,

    healthScore: analytics.healthScore,

    highestCategory:
      analytics.highestCategory,

    potentialSavings:
      analytics.potentialSavings,

    recommendation:
      "Reduce discretionary food and shopping spending to improve your monthly savings."
  });
});

// =====================================================
// AI CHAT
// =====================================================

app.post("/api/chat", (req, res) => {
  const message = String(
    req.body && req.body.message
      ? req.body.message
      : ""
  ).toLowerCase();

  const analytics = getAnalytics();

  let reply =
    "I can help you understand your spending, savings, transactions, bills and financial health.";

  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    reply =
      "Hi! I'm Saarthi 👋 Ask me about your spending, savings, bills or financial health.";
  }

  else if (
    message.includes("food") ||
    message.includes("swiggy") ||
    message.includes("restaurant")
  ) {
    const food =
      analytics.categories.find(
        (c) => c.category === "Food"
      );

    reply =
      `You've spent ₹${(
        food ? food.amount : 0
      ).toLocaleString("en-IN")} on food in the demo data.`;
  }

  else if (
    message.includes("shopping") ||
    message.includes("amazon") ||
    message.includes("myntra")
  ) {
    const shopping =
      analytics.categories.find(
        (c) => c.category === "Shopping"
      );

    reply =
      `Your shopping spend is ₹${(
        shopping ? shopping.amount : 0
      ).toLocaleString("en-IN")}.`;
  }

  else if (
    message.includes("saving") ||
    message.includes("save")
  ) {
    reply =
      `Saarthi estimates that you could potentially save around ₹${analytics.potentialSavings.toLocaleString(
        "en-IN"
      )} by reducing food and shopping expenses.`;
  }

  else if (
    message.includes("balance")
  ) {
    reply =
      "Your simulated demo balance is ₹24,500.";
  }

  else if (
    message.includes("income") ||
    message.includes("salary")
  ) {
    reply =
      `Your total demo income is ₹${analytics.totalIncome.toLocaleString(
        "en-IN"
      )}.`;
  }

  else if (
    message.includes("expense")
  ) {
    reply =
      `Your total demo expenses are ₹${analytics.totalExpenses.toLocaleString(
        "en-IN"
      )}.`;
  }

  else if (
    message.includes("health") ||
    message.includes("score")
  ) {
    reply =
      `Your simulated financial health score is ${analytics.healthScore}/100.`;
  }

  else if (
    message.includes("highest") ||
    message.includes("spending") ||
    message.includes("spend")
  ) {
    reply =
      `Your highest spending category is ${analytics.highestCategory.category}, at ₹${analytics.highestCategory.amount.toLocaleString(
        "en-IN"
      )}.`;
  }

  else if (
    message.includes("bill") ||
    message.includes("recurring")
  ) {
    reply =
      "Your recurring demo payments include Electricity Bill (₹1,800/month) and Mobile Recharge (₹599/month).";
  }

  res.json({
    simulated: true,
    reply
  });
});

// =====================================================
// SIMULATED PAYMENT
// =====================================================

app.post(
  "/api/payment/simulate",
  (req, res) => {
    const transactionId =
      "SIM-" +
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    res.json({
      success: true,
      simulated: true,
      transactionId,
      message:
        "Payment simulated successfully. No real money was transferred."
    });
  }
);

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `SAARTHI backend running on port ${PORT}`
  );

  console.log(
    `Port: ${PORT}`
  );

  console.log(
    "Mode: SIMULATION"
  );
});
