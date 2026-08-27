import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  getExpenses,
  getFinancial,
  getBudgets,
  saveBudget,
  deleteBudget,
} from "../services/expenseService";

function Budget() {
  const [expenses, setExpenses] = useState([]);

  const [financial, setFinancial] = useState({
    monthlySalary: 0,
    monthlyBudget: 0,
    savingsGoal: 0,
  });

  const [budgets, setBudgets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  /* =====================================================
     CATEGORY ICONS
  ===================================================== */

  const categoryIcons = {
    Food: "🍔",
    Transport: "🚕",
    Shopping: "🛍️",
    Bills: "💡",
    Entertainment: "🎬",
    Health: "❤️",
    Education: "📚",
    Other: "💳",
  };

  /* =====================================================
     CURRENT MONTH / YEAR
  ===================================================== */

  const now = new Date();

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Budget page loading...");

      const expenseData = await getExpenses();

      console.log("Expense response:", expenseData);

      const financialData = await getFinancial();

      console.log("Financial response:", financialData);

      const budgetData = await getBudgets(
        currentMonth,
        currentYear
      );

      console.log("Budget response:", budgetData);

      setExpenses(
        Array.isArray(expenseData?.expenses)
          ? expenseData.expenses
          : []
      );

      setFinancial(
        financialData?.financial || {
          monthlySalary: 0,
          monthlyBudget: 0,
          savingsGoal: 0,
        }
      );

      setBudgets(
        Array.isArray(budgetData?.budgets)
          ? budgetData.budgets
          : []
      );
    } catch (err) {
      console.error("Budget page error:", err);

      setError(
        err.message || "Failed to load budget data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  /* =====================================================
     FINANCIAL VALUES
  ===================================================== */

  const monthlyBudget = Number(
    financial.monthlyBudget || 0
  );

  const monthlySalary = Number(
    financial.monthlySalary || 0
  );

  /* =====================================================
     CURRENT MONTH EXPENSES
  ===================================================== */

  const currentMonthExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(
        expense.createdAt || expense.date
      );

      return (
        expenseDate.getMonth() === currentMonth - 1 &&
        expenseDate.getFullYear() === currentYear
      );
    });
  }, [expenses, currentMonth, currentYear]);

  /* =====================================================
     TOTAL EXPENSES
  ===================================================== */

  const totalExpenses = useMemo(() => {
    return currentMonthExpenses.reduce(
      (total, expense) => {
        return (
          total +
          Number(expense.amount || 0)
        );
      },
      0
    );
  }, [currentMonthExpenses]);

  /* =====================================================
     REMAINING BUDGET
  ===================================================== */

  const remainingBudget =
    monthlyBudget - totalExpenses;

  /* =====================================================
     BUDGET PERCENTAGE
  ===================================================== */

  const budgetPercentage =
    monthlyBudget > 0
      ? Math.min(
          (totalExpenses / monthlyBudget) * 100,
          100
        )
      : 0;

  /* =====================================================
     CATEGORY EXPENSE TOTALS
  ===================================================== */

  const categoryTotals = useMemo(() => {
    const totals = {};

    currentMonthExpenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      totals[category] =
        (totals[category] || 0) +
        Number(expense.amount || 0);
    });

    return totals;
  }, [currentMonthExpenses]);

  /* =====================================================
     GET CATEGORY BUDGET
  ===================================================== */

  const getCategoryBudget = (category) => {
    const budget = budgets.find(
      (item) =>
        item.category === category &&
        Number(item.month) === currentMonth &&
        Number(item.year) === currentYear
    );

    return budget || null;
  };

  /* =====================================================
     GET CATEGORY LIMIT
  ===================================================== */

  const getCategoryLimit = (category) => {
    const budget =
      getCategoryBudget(category);

    return budget
      ? Number(budget.amount || 0)
      : 0;
  };

  /* =====================================================
     TOTAL CATEGORY BUDGET
  ===================================================== */

  const totalCategoryBudget = useMemo(() => {
    return budgets.reduce(
      (total, budget) =>
        total +
        Number(budget.amount || 0),
      0
    );
  }, [budgets]);

  /* =====================================================
     EDIT BUDGET
  ===================================================== */

  const handleEdit = (category) => {
    const budget =
      getCategoryBudget(category);

    setEditingCategory(category);

    setEditAmount(
      budget
        ? String(budget.amount)
        : ""
    );

    setError("");
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditAmount("");
  };

  /* =====================================================
     SAVE BUDGET
  ===================================================== */

  const handleSaveBudget = async (category) => {
    try {
      const amount = Number(editAmount);

      if (
        editAmount === "" ||
        Number.isNaN(amount)
      ) {
        setError(
          "Please enter a valid budget amount."
        );
        return;
      }

      if (amount < 0) {
        setError(
          "Budget amount cannot be negative."
        );
        return;
      }

      setSaving(true);
      setError("");

      console.log("Saving budget:", {
        category,
        amount,
        month: currentMonth,
        year: currentYear,
      });

      await saveBudget({
        category,
        amount,
        month: currentMonth,
        year: currentYear,
      });

      console.log("Budget saved successfully.");

      /*
        Reload directly from MongoDB.

        This makes the database the source of truth
        instead of manually modifying React state.
      */
      await loadBudgetData();

      setEditingCategory(null);
      setEditAmount("");
    } catch (err) {
      console.error(
        "Save budget error:",
        err
      );

      setError(
        err.message ||
          "Failed to save budget."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE BUDGET
  ===================================================== */

  const handleDeleteBudget = async (
    category
  ) => {
    try {
      const budget =
        getCategoryBudget(category);

      if (!budget?._id) {
        return;
      }

      const confirmed = window.confirm(
        `Delete ${category} budget?`
      );

      if (!confirmed) {
        return;
      }

      setSaving(true);
      setError("");

      await deleteBudget(
        budget._id
      );

      /*
        Remove deleted budget from the UI
        immediately.
      */
      setBudgets((previous) =>
        previous.filter(
          (item) =>
            item._id !== budget._id
        )
      );

      if (
        editingCategory === category
      ) {
        setEditingCategory(null);
        setEditAmount("");
      }
    } catch (err) {
      console.error(
        "Delete budget error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete budget."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071A2F] text-white">
        <div className="text-center">
          <div className="text-2xl font-semibold">
            Loading Budgets...
          </div>

          <p className="mt-2 text-gray-400">
            Analyzing your spending
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071A2F] via-[#0B2545] to-[#06111F] text-white">

      <div className="flex">

        {/* SIDEBAR */}

        <Sidebar />

        <main className="min-h-screen flex-1">

          {/* NAVBAR */}

          <Navbar />

          <div className="p-5 md:p-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-8">
              <h1 className="text-3xl font-bold md:text-4xl">
                Budgets
              </h1>

              <p className="mt-2 text-gray-400">
                Manage and monitor your monthly spending.
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">

                <span>{error}</span>

                <button
                  onClick={() =>
                    setError("")
                  }
                  className="ml-4 text-red-300 hover:text-white"
                >
                  ✕
                </button>

              </div>
            )}

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="grid gap-5 md:grid-cols-3">

              {/* MONTHLY BUDGET */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <p className="text-sm text-gray-400">
                  Monthly Budget
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  ₹
                  {monthlyBudget.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your monthly spending limit
                </p>

              </div>

              {/* TOTAL SPENT */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <p className="text-sm text-gray-400">
                  Total Spent
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-400">
                  ₹
                  {totalExpenses.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {Math.round(
                    budgetPercentage
                  )}
                  % of budget used
                </p>

              </div>

              {/* REMAINING */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <p className="text-sm text-gray-400">
                  Remaining
                </p>

                <h2
                  className={`mt-2 text-3xl font-bold ${
                    remainingBudget < 0
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  ₹
                  {Math.max(
                    remainingBudget,
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Available to spend
                </p>

              </div>

            </div>

            {/* =================================================
                MAIN BUDGET PROGRESS
            ================================================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    Monthly Spending Limit
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Track your monthly budget usage
                  </p>
                </div>

                <span
                  className={`rounded-lg px-3 py-1 text-sm font-bold ${
                    budgetPercentage >= 100
                      ? "bg-red-400/10 text-red-400"
                      : budgetPercentage >= 80
                      ? "bg-yellow-400/10 text-yellow-400"
                      : "bg-cyan-400/10 text-cyan-400"
                  }`}
                >
                  {Math.round(
                    budgetPercentage
                  )}
                  %
                </span>

              </div>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">

                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetPercentage >= 100
                      ? "bg-red-400"
                      : budgetPercentage >= 80
                      ? "bg-yellow-400"
                      : "bg-cyan-400"
                  }`}
                  style={{
                    width: `${budgetPercentage}%`,
                  }}
                />

              </div>

              <div className="mt-4 flex justify-between text-sm">

                <span className="text-gray-400">
                  Spent ₹
                  {totalExpenses.toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span className="text-gray-300">
                  Budget ₹
                  {monthlyBudget.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* =================================================
                CATEGORY BUDGETS
            ================================================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                <div>
                  <h2 className="text-xl font-semibold">
                    Category Budgets
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Set individual spending limits for each category.
                  </p>
                </div>

                <div className="rounded-lg bg-cyan-400/10 px-4 py-2 text-sm text-cyan-400">
                  Category Budget: ₹
                  {totalCategoryBudget.toLocaleString(
                    "en-IN"
                  )}
                </div>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                {categories.map(
                  (category) => {
                    const spent =
                      categoryTotals[
                        category
                      ] || 0;

                    const limit =
                      getCategoryLimit(
                        category
                      );

                    const percentage =
                      limit > 0
                        ? Math.min(
                            (spent /
                              limit) *
                              100,
                            100
                          )
                        : 0;

                    const budget =
                      getCategoryBudget(
                        category
                      );

                    const isEditing =
                      editingCategory ===
                      category;

                    return (
                      <div
                        key={category}
                        className="rounded-xl border border-white/5 bg-black/10 p-5"
                      >

                        {/* CATEGORY HEADER */}

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <span className="text-2xl">
                              {
                                categoryIcons[
                                  category
                                ]
                              }
                            </span>

                            <div>
                              <p className="font-medium">
                                {category}
                              </p>

                              <p className="text-xs text-gray-500">
                                Spent ₹
                                {spent.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>

                          </div>

                          {!isEditing && (
                            <button
                              onClick={() =>
                                handleEdit(
                                  category
                                )
                              }
                              className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20"
                            >
                              {budget
                                ? "Edit"
                                : "Set Budget"}
                            </button>
                          )}

                        </div>

                        {/* EDIT FORM */}

                        {isEditing ? (
                          <div className="mt-5">

                            <label className="mb-2 block text-sm text-gray-400">
                              Monthly limit for{" "}
                              {category}
                            </label>

                            <div className="flex gap-2">

                              <div className="flex flex-1 items-center rounded-lg border border-white/10 bg-white/5">

                                <span className="pl-3 text-gray-400">
                                  ₹
                                </span>

                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    editAmount
                                  }
                                  onChange={(e) =>
                                    setEditAmount(
                                      e.target
                                        .value
                                    )
                                  }
                                  placeholder="Enter amount"
                                  className="w-full bg-transparent px-2 py-3 text-white outline-none"
                                />

                              </div>

                              <button
                                onClick={() =>
                                  handleSaveBudget(
                                    category
                                  )
                                }
                                disabled={saving}
                                className="rounded-lg bg-cyan-400 px-4 py-2 font-medium text-[#071A2F] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {saving
                                  ? "Saving..."
                                  : "Save"}
                              </button>

                              <button
                                onClick={
                                  handleCancelEdit
                                }
                                disabled={saving}
                                className="rounded-lg border border-white/10 px-4 py-2 text-gray-300 transition hover:bg-white/10"
                              >
                                Cancel
                              </button>

                            </div>

                            {budget && (
                              <button
                                onClick={() =>
                                  handleDeleteBudget(
                                    category
                                  )
                                }
                                disabled={saving}
                                className="mt-3 text-xs text-red-400 hover:text-red-300"
                              >
                                Delete this budget
                              </button>
                            )}

                          </div>
                        ) : (
                          <>
                            {/* LIMIT + SPENT */}

                            <div className="mt-4 flex items-end justify-between">

                              <div>

                                <p className="text-xs text-gray-500">
                                  Budget Limit
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-300">
                                  ₹
                                  {limit.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                              </div>

                              <div className="text-right">

                                <p className="font-semibold">
                                  ₹
                                  {spent.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                                <p
                                  className={`text-xs ${
                                    limit <= 0
                                      ? "text-gray-500"
                                      : percentage >=
                                        100
                                      ? "text-red-400"
                                      : percentage >=
                                        80
                                      ? "text-yellow-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {limit <= 0
                                    ? "No budget set"
                                    : `${Math.round(
                                        percentage
                                      )}% used`}
                                </p>

                              </div>

                            </div>

                            {/* PROGRESS */}

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  percentage >=
                                  100
                                    ? "bg-red-400"
                                    : percentage >=
                                      80
                                    ? "bg-yellow-400"
                                    : "bg-cyan-400"
                                }`}
                                style={{
                                  width:
                                    `${percentage}%`,
                                }}
                              />

                            </div>

                            {/* WARNING */}

                            {limit > 0 &&
                              percentage >=
                                100 && (
                                <p className="mt-2 text-xs text-red-400">
                                  ⚠️ Budget exceeded
                                </p>
                              )}

                            {limit > 0 &&
                              percentage >=
                                80 &&
                              percentage <
                                100 && (
                                <p className="mt-2 text-xs text-yellow-400">
                                  ⚠️ Approaching budget limit
                                </p>
                              )}

                          </>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* =================================================
                BUDGET INSIGHT
            ================================================= */}

            <div className="mt-7 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">

              <h2 className="text-xl font-semibold">
                💡 Budget Insight
              </h2>

              <p className="mt-3 leading-6 text-gray-300">

                {monthlyBudget <= 0
                  ? "You haven't set a monthly budget yet. Go to Financial Settings to create one."
                  : totalExpenses >
                    monthlyBudget
                  ? `You have exceeded your monthly budget by ₹${(
                      totalExpenses -
                      monthlyBudget
                    ).toLocaleString(
                      "en-IN"
                    )}. Consider reducing unnecessary expenses.`
                  : budgetPercentage >=
                    80
                  ? `You've used ${Math.round(
                      budgetPercentage
                    )}% of your monthly budget. Only ₹${Math.max(
                      remainingBudget,
                      0
                    ).toLocaleString(
                      "en-IN"
                    )} remains.`
                  : `You're doing well! You've used only ${Math.round(
                      budgetPercentage
                    )}% of your monthly budget.`}

              </p>

            </div>

            {/* =================================================
                MONTH SUMMARY
            ================================================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <h2 className="text-lg font-semibold">
                This Month
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-3">

                <div>
                  <p className="text-sm text-gray-500">
                    Transactions
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {currentMonthExpenses.length}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Monthly Salary
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    ₹
                    {monthlySalary.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Category Budgets
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {budgets.length}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Budget;