import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIInsight from "../components/AIInsight";
import {
  getExpenses,
  getFinancial,
} from "../services/expenseService";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  const [financial, setFinancial] = useState({
    monthlySalary: 0,
    monthlyBudget: 0,
    savingsGoal: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // USER
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userName = user?.name || "User";

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      console.error(
        "Dashboard error:",
        err
      );

      setError(
        err.message ||
          "Failed to load dashboard data"
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
  // REMAINING BALANCE
  // =========================

  const remainingBalance =
    salary - totalExpenses;

  // =========================
  // BUDGET
  // =========================

  const budgetRemaining =
    budget - totalExpenses;

  const budgetPercentage =
    budget > 0
      ? Math.min(
          Math.round(
            (totalExpenses / budget) * 100
          ),
          100
        )
      : 0;

  // =========================
  // CATEGORY TOTALS
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

  // =========================
  // CATEGORY BUDGET ALERTS
  // =========================

  const categoryBudgetAlerts =
    useMemo(() => {
      const categoryBudgets =
        financial.categoryBudgets ||
        {};

      return Object.entries(
        categoryBudgets
      ).map(([category, categoryBudget]) => {
        const budgetAmount =
          Number(categoryBudget || 0);

        const spent =
          Number(
            categoryTotals[category] || 0
          );

        const percentage =
          budgetAmount > 0
            ? Math.round(
                (spent / budgetAmount) * 100
              )
            : 0;

        let status = "safe";

        if (percentage >= 100) {
          status = "danger";
        } else if (percentage >= 80) {
          status = "warning";
        }

        return {
          category,
          budget: budgetAmount,
          spent,
          percentage,
          status,
        };
      });
    }, [
      financial.categoryBudgets,
      categoryTotals,
    ]);

  // =========================
  // PREDICTION
  // =========================

  const today = new Date();

  const daysElapsed =
    today.getDate();

  const daysInMonth =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

  const dailyAverage =
    daysElapsed > 0
      ? totalExpenses / daysElapsed
      : 0;

  const predictedExpense =
    Math.round(
      dailyAverage * daysInMonth
    );

  // =========================
  // SAVINGS
  // =========================

  const plannedSavings =
    Math.max(
      salary - budget,
      0
    );

  const savedAmount =
    Math.min(
      plannedSavings,
      savingsGoal
    );

  const savingsProgress =
    savingsGoal > 0
      ? Math.min(
          Math.round(
            (savedAmount /
              savingsGoal) *
              100
          ),
          100
        )
      : 0;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071A2F] text-white">
        <div className="text-center">
          <div className="text-2xl font-semibold">
            Loading Dashboard...
          </div>

          <p className="mt-2 text-gray-400">
            Preparing your financial overview
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

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
                {error}
              </div>
            )}

            {/* =========================
                WELCOME
            ========================= */}

            <div className="mb-8">

              <h1 className="text-3xl font-bold md:text-4xl">
                Hii, {userName} 👋
              </h1>

              <p className="mt-2 text-gray-400">
                Here's your financial overview for this month.
              </p>

            </div>

            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-400">
                      Monthly Salary
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                      ₹
                      {salary.toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </div>

                  <span className="text-2xl">
                    💰
                  </span>

                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Your income this month
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-400">
                      Total Expenses
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                      ₹
                      {totalExpenses.toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </div>

                  <span className="text-2xl">
                    💳
                  </span>

                </div>

                <p className="mt-3 text-xs text-gray-500">
                  {salary > 0
                    ? Math.round(
                        (totalExpenses /
                          salary) *
                          100
                      )
                    : 0}
                  % of your salary spent
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-400">
                      Remaining Balance
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                      ₹
                      {Math.max(
                        remainingBalance,
                        0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </div>

                  <span className="text-2xl">
                    📈
                  </span>

                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Available balance
                </p>

              </div>

            </div>

            {/* =========================
                MONTHLY BUDGET
            ========================= */}

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Monthly Budget
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    ₹
                    {totalExpenses.toLocaleString(
                      "en-IN"
                    )}{" "}
                    of ₹
                    {budget.toLocaleString(
                      "en-IN"
                    )}{" "}
                    used
                  </p>

                </div>

                <span className="text-xl font-bold">
                  {budgetPercentage}%
                </span>

              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{
                    width: `${budgetPercentage}%`,
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs text-gray-400">

                <span>
                  Used: ₹
                  {totalExpenses.toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span>
                  Remaining: ₹
                  {Math.max(
                    budgetRemaining,
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* =========================
                AI GUARDIAN
            ========================= */}

            <div className="mt-7">

              <AIInsight
                monthlySalary={salary}
                monthlyBudget={budget}
                totalExpenses={totalExpenses}
                predictedExpense={
                  predictedExpense
                }
                categoryBudgetAlerts={
                  categoryBudgetAlerts
                }
              />

            </div>

            {/* =========================
                CATEGORY BUDGET ALERTS
            ========================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <h2 className="text-xl font-semibold">
                Category Budget Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Monitor your spending against each category budget.
              </p>

              <div className="mt-6 space-y-4">

                {categoryBudgetAlerts.length ===
                0 ? (
                  <p className="text-sm text-gray-500">
                    No category budgets configured yet.
                  </p>
                ) : (
                  categoryBudgetAlerts.map(
                    (item) => (
                      <div
                        key={item.category}
                        className="rounded-xl border border-white/5 bg-black/10 p-4"
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="font-medium">
                              {item.category}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ₹
                              {item.spent.toLocaleString(
                                "en-IN"
                              )}{" "}
                              / ₹
                              {item.budget.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                          <span
                            className={
                              item.status ===
                              "danger"
                                ? "text-red-400"
                                : item.status ===
                                  "warning"
                                ? "text-yellow-400"
                                : "text-green-400"
                            }
                          >
                            {item.status ===
                            "danger"
                              ? "🔴"
                              : item.status ===
                                "warning"
                              ? "🟡"
                              : "🟢"}{" "}
                            {item.percentage}%
                          </span>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

            </div>

            {/* =========================
                SAVINGS GOAL
            ========================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    Savings Goal
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Planned monthly savings: ₹
                    {plannedSavings.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <span className="text-xl font-bold">
                  {savingsProgress}%
                </span>

              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{
                    width: `${savingsProgress}%`,
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs text-gray-400">

                <span>
                  Saved: ₹
                  {savedAmount.toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span>
                  Goal: ₹
                  {savingsGoal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* =========================
                RECENT TRANSACTIONS
            ========================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    Recent Transactions
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Your latest expenses
                  </p>

                </div>

                <button
                  onClick={() =>
                    window.location.href =
                      "/transactions"
                  }
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View All →
                </button>

              </div>

              <div className="mt-5 space-y-3">

                {expenses.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No transactions yet.
                  </p>
                ) : (
                  expenses
                    .slice(-5)
                    .reverse()
                    .map((expense) => (
                      <div
                        key={expense._id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-black/10 p-4"
                      >

                        <div>

                          <p className="font-medium">
                            {expense.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {expense.category}
                          </p>

                        </div>

                        <p className="font-semibold text-red-400">
                          -₹
                          {Number(
                            expense.amount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>
                    ))
                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;