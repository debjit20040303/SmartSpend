import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getExpenses,
  getFinancial,
} from "../services/expenseService";

function AIAssistant() {
  const [expenses, setExpenses] = useState([]);

  const [financial, setFinancial] = useState({
    monthlySalary: 0,
    monthlyBudget: 0,
    savingsGoal: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      setLoading(true);
      setError("");

      const [expenseData, financialData] =
        await Promise.all([
          getExpenses(),
          getFinancial(),
        ]);

      setExpenses(
        expenseData?.expenses || []
      );

      setFinancial(
        financialData?.financial || {
          monthlySalary: 0,
          monthlyBudget: 0,
          savingsGoal: 0,
        }
      );
    } catch (err) {
      console.error("AI Assistant error:", err);

      setError(
        err.message ||
          "Failed to load financial data"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VALUES
  // =========================

  const salary = Number(
    financial.monthlySalary || 0
  );

  const budget = Number(
    financial.monthlyBudget || 0
  );

  const savingsGoal = Number(
    financial.savingsGoal || 0
  );

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  // =========================
  // CALCULATIONS
  // =========================

  const remainingBudget =
    budget - totalExpenses;

  const remainingSalary =
    salary - totalExpenses;

  const budgetUsed =
    budget > 0
      ? Math.round(
          (totalExpenses / budget) * 100
        )
      : 0;

  const dailyAverage =
    expenses.length > 0
      ? Math.round(totalExpenses / 23)
      : 0;

  const predictedExpense =
    dailyAverage * 31;

  // =========================
  // CATEGORY ANALYSIS
  // =========================

  const categoryTotals = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      totals[category] =
        (totals[category] || 0) +
        Number(expense.amount || 0);
    });

    return totals;
  }, [expenses]);

  const highestCategory = useMemo(() => {
    const entries = Object.entries(
      categoryTotals
    );

    if (entries.length === 0) {
      return {
        name: "None",
        amount: 0,
      };
    }

    return entries.reduce(
      (largest, current) =>
        current[1] > largest[1]
          ? current
          : largest
    );
  }, [categoryTotals]);

  // =========================
  // AI STATUS
  // =========================

  let status = "Good";
  let statusClass =
    "bg-green-400/10 text-green-400";

  let insight =
    "Your spending is currently under control.";

  if (budget <= 0) {
    status = "Setup Required";

    statusClass =
      "bg-yellow-400/10 text-yellow-400";

    insight =
      "Set a monthly budget to receive personalized AI financial recommendations.";
  } else if (totalExpenses > budget) {
    status = "Over Budget";

    statusClass =
      "bg-red-400/10 text-red-400";

    insight = `You have exceeded your monthly budget by ₹${(
      totalExpenses - budget
    ).toLocaleString("en-IN")}.`;
  } else if (budgetUsed >= 80) {
    status = "Warning";

    statusClass =
      "bg-yellow-400/10 text-yellow-400";

    insight = `You've already used ${budgetUsed}% of your monthly budget.`;
  } else if (budgetUsed >= 50) {
    status = "On Track";

    statusClass =
      "bg-cyan-400/10 text-cyan-400";

    insight = `You've used ${budgetUsed}% of your budget and are currently on track.`;
  } else {
    status = "Good";

    statusClass =
      "bg-green-400/10 text-green-400";

    insight = `You've used only ${budgetUsed}% of your monthly budget.`;
  }

  // =========================
  // RECOMMENDATIONS
  // =========================

  const recommendations = [];

  if (budget <= 0) {
    recommendations.push(
      "Set your monthly budget in Financial Settings."
    );
  }

  if (
    budget > 0 &&
    totalExpenses > budget
  ) {
    recommendations.push(
      "Reduce non-essential expenses for the rest of the month."
    );
  }

  if (
    budget > 0 &&
    budgetUsed >= 80 &&
    totalExpenses <= budget
  ) {
    recommendations.push(
      "Be careful with discretionary spending because most of your budget is already used."
    );
  }

  if (highestCategory.amount > 0) {
    recommendations.push(
      `${highestCategory.name} is your highest spending category at ₹${highestCategory.amount.toLocaleString(
        "en-IN"
      )}.`
    );
  }

  if (
    salary > 0 &&
    totalExpenses > salary * 0.5
  ) {
    recommendations.push(
      "More than half of your salary has already been spent."
    );
  }

  if (
    savingsGoal > 0 &&
    remainingSalary >= savingsGoal
  ) {
    recommendations.push(
      `Based on your current balance, your ₹${savingsGoal.toLocaleString(
        "en-IN"
      )} savings goal looks achievable.`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Continue tracking your expenses regularly to maintain good financial discipline."
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071A2F] text-white">

        <div className="text-center">

          <div className="text-2xl font-semibold">
            Loading AI Assistant...
          </div>

          <p className="mt-2 text-gray-400">
            Analyzing your financial data
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071A2F] via-[#0B2545] to-[#06111F] text-white">

      <div className="flex">

        {/* SIDEBAR */}

        <Sidebar />

        <main className="min-h-screen flex-1">

          {/* NAVBAR */}

          <Navbar />

          <div className="p-5 md:p-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-8">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                  🤖
                </div>

                <div>

                  <h1 className="text-3xl font-bold md:text-4xl">
                    AI Assistant
                  </h1>

                  <p className="mt-2 text-gray-400">
                    Your personal financial intelligence
                  </p>

                </div>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
                {error}
              </div>
            )}

            {/* =========================
                AI STATUS
            ========================= */}

            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-transparent p-6 shadow-lg">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/15 text-2xl">
                    🧠
                  </div>

                  <div>

                    <h2 className="text-xl font-semibold">
                      AI Financial Guardian
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Smart analysis of your spending
                    </p>

                  </div>

                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${statusClass}`}
                >
                  {status}
                </span>

              </div>

              <p className="mt-6 leading-7 text-gray-300">
                {insight}
              </p>

            </div>

            {/* =========================
                FINANCIAL SNAPSHOT
            ========================= */}

            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <MetricCard
                title="Monthly Salary"
                value={`₹${salary.toLocaleString(
                  "en-IN"
                )}`}
                icon="💰"
              />

              <MetricCard
                title="Total Expenses"
                value={`₹${totalExpenses.toLocaleString(
                  "en-IN"
                )}`}
                icon="💳"
              />

              <MetricCard
                title="Budget Used"
                value={`${budgetUsed}%`}
                icon="📊"
              />

              <MetricCard
                title="Predicted Expense"
                value={`₹${predictedExpense.toLocaleString(
                  "en-IN"
                )}`}
                icon="🔮"
              />

            </div>

            {/* =========================
                AI ANALYSIS
            ========================= */}

            <div className="mt-7 grid gap-6 lg:grid-cols-2">

              {/* SPENDING ANALYSIS */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <h2 className="text-xl font-semibold">
                  📊 Spending Analysis
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Based on your current expenses
                </p>

                <div className="mt-6 space-y-5">

                  <AnalysisRow
                    label="Daily Average"
                    value={`₹${dailyAverage.toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <AnalysisRow
                    label="Remaining Budget"
                    value={`₹${Math.max(
                      remainingBudget,
                      0
                    ).toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <AnalysisRow
                    label="Available Balance"
                    value={`₹${Math.max(
                      remainingSalary,
                      0
                    ).toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <AnalysisRow
                    label="Top Category"
                    value={
                      highestCategory.name
                    }
                  />

                </div>

              </div>

              {/* AI RECOMMENDATIONS */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <h2 className="text-xl font-semibold">
                  💡 AI Recommendations
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Personalized suggestions
                </p>

                <div className="mt-6 space-y-4">

                  {recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl border border-white/5 bg-black/10 p-4"
                      >

                        <span className="text-lg">
                          💡
                        </span>

                        <p className="text-sm leading-6 text-gray-300">
                          {recommendation}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* =========================
                BUDGET FORECAST
            ========================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    🔮 Expense Forecast
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Estimated spending based on your current daily average
                  </p>

                </div>

              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">

                <ForecastCard
                  title="Current Spending"
                  value={`₹${totalExpenses.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <ForecastCard
                  title="Daily Average"
                  value={`₹${dailyAverage.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <ForecastCard
                  title="Month Forecast"
                  value={`₹${predictedExpense.toLocaleString(
                    "en-IN"
                  )}`}
                />

              </div>

              {budget > 0 && (
                <div className="mt-6 rounded-xl bg-black/10 p-4">

                  <p className="text-sm text-gray-400">
                    Forecast vs Budget
                  </p>

                  <p className="mt-2 text-lg font-semibold">

                    {predictedExpense > budget ? (
                      <span className="text-red-400">
                        ⚠️ Forecast is ₹
                        {(
                          predictedExpense -
                          budget
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        above your budget.
                      </span>
                    ) : (
                      <span className="text-green-400">
                        ✅ Forecast is ₹
                        {(
                          budget -
                          predictedExpense
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        below your budget.
                      </span>
                    )}

                  </p>

                </div>
              )}

            </div>

            {/* =========================
                DISCLAIMER
            ========================= */}

            <div className="mt-7 rounded-xl border border-white/5 bg-white/5 p-4">

              <p className="text-xs leading-5 text-gray-500">
                AI insights are generated from your SmartSpend
                expense data and are intended for budgeting
                guidance only. Forecasts are estimates and may
                not represent actual future spending.
              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

/* =========================
   METRIC CARD
========================= */

function MetricCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="flex items-center justify-between">

        <span className="text-sm text-gray-400">
          {title}
        </span>

        <span className="text-xl">
          {icon}
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* =========================
   ANALYSIS ROW
========================= */

function AnalysisRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}

/* =========================
   FORECAST CARD
========================= */

function ForecastCard({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/10 p-5">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-cyan-400">
        {value}
      </p>

    </div>
  );
}

export default AIAssistant;