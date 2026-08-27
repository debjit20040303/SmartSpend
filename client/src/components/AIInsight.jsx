import { useMemo, useState } from "react";

function AIInsight({
  monthlySalary = 0,
  monthlyBudget = 0,
  totalExpenses = 0,
  predictedExpense = 0,
  categoryBudgetAlerts = [],
}) {
  const [showRecommendations, setShowRecommendations] =
    useState(false);

  const salary = Number(monthlySalary || 0);
  const budget = Number(monthlyBudget || 0);
  const expenses = Number(totalExpenses || 0);

  const {
    daysElapsed,
    daysInMonth,
    dailyAverage,
    predicted,
    remainingBudget,
    budgetUsedPercentage,
    status,
    statusClass,
    message,
    recommendation,
    categoryInsight,
  } = useMemo(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth();

    const elapsed = today.getDate();

    const totalDays = new Date(
      year,
      month + 1,
      0
    ).getDate();

    /* =========================
       DAILY AVERAGE
    ========================= */

    const average =
      elapsed > 0
        ? expenses / elapsed
        : 0;

    /* =========================
       PREDICTION
    ========================= */

    const calculatedPrediction =
      predictedExpense > 0
        ? Number(predictedExpense)
        : Math.round(
            average * totalDays
          );

    /* =========================
       BUDGET CALCULATIONS
    ========================= */

    const remaining =
      budget - expenses;

    const safeRemaining =
      Math.max(remaining, 0);

    const percentage =
      budget > 0
        ? Math.round(
            (expenses / budget) * 100
          )
        : 0;

    /* =========================
       CATEGORY INSIGHT
    ========================= */

    let currentCategoryInsight = null;

    if (
      Array.isArray(categoryBudgetAlerts) &&
      categoryBudgetAlerts.length > 0
    ) {
      const statusPriority = {
        danger: 3,
        warning: 2,
        safe: 1,
      };

      const sortedAlerts = [
        ...categoryBudgetAlerts,
      ].sort((a, b) => {
        const priorityDifference =
          (statusPriority[b.status] || 0) -
          (statusPriority[a.status] || 0);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return (
          Number(b.percentage || 0) -
          Number(a.percentage || 0)
        );
      });

      currentCategoryInsight =
        sortedAlerts[0] || null;
    }

    /* =========================
       DEFAULT STATE
    ========================= */

    let currentStatus = "Good";

    let currentStatusClass =
      "bg-green-400/10 text-green-400";

    let currentMessage =
      "You're doing well. Your spending is currently within your monthly budget.";

    let currentRecommendation =
      "Keep tracking your expenses to stay within your budget.";

    /* =========================
       NO MONTHLY BUDGET
    ========================= */

    if (budget <= 0) {
      currentStatus = "Setup Required";

      currentStatusClass =
        "bg-yellow-400/10 text-yellow-400";

      currentMessage =
        "Set a monthly budget to receive personalized financial insights.";

      currentRecommendation =
        "Go to Financial Settings and set your monthly budget.";
    }

    /* =========================
       MONTHLY BUDGET EXCEEDED
    ========================= */

    else if (expenses > budget) {
      currentStatus = "Over Budget";

      currentStatusClass =
        "bg-red-400/10 text-red-400";

      currentMessage =
        `You've exceeded your monthly budget by ₹${Math.abs(
          remaining
        ).toLocaleString("en-IN")}.`;

      currentRecommendation =
        "Try reducing non-essential spending for the rest of the month.";
    }

    /* =========================
       CATEGORY OVER BUDGET
    ========================= */

    else if (
      currentCategoryInsight?.status ===
      "danger"
    ) {
      const category =
        currentCategoryInsight;

      currentStatus = "Warning";

      currentStatusClass =
        "bg-red-400/10 text-red-400";

      currentMessage =
        `${category.category} spending has exceeded its category budget.`;

      currentRecommendation =
        `You've spent ₹${Number(
          category.spent || 0
        ).toLocaleString(
          "en-IN"
        )} against a ₹${Number(
          category.budget || 0
        ).toLocaleString(
          "en-IN"
        )} budget. Reduce spending in this category.`;
    }

    /* =========================
       MONTHLY BUDGET 80%+
    ========================= */

    else if (percentage >= 80) {
      currentStatus = "Warning";

      currentStatusClass =
        "bg-yellow-400/10 text-yellow-400";

      currentMessage =
        `You've already used ${percentage}% of your monthly budget.`;

      currentRecommendation =
        `Only ₹${safeRemaining.toLocaleString(
          "en-IN"
        )} remains. Consider limiting unnecessary expenses.`;
    }

    /* =========================
       CATEGORY 80%+
    ========================= */

    else if (
      currentCategoryInsight?.status ===
      "warning"
    ) {
      const category =
        currentCategoryInsight;

      currentStatus = "Warning";

      currentStatusClass =
        "bg-yellow-400/10 text-yellow-400";

      currentMessage =
        `${category.category} spending is approaching its category budget.`;

      currentRecommendation =
        `You've used ${Number(
          category.percentage || 0
        )}% of your ${category.category} budget. Only ₹${Math.max(
          Number(category.budget || 0) -
            Number(category.spent || 0),
          0
        ).toLocaleString(
          "en-IN"
        )} remains.`;
    }

    /* =========================
       PREDICTION EXCEEDS BUDGET
    ========================= */

    else if (
      calculatedPrediction > budget
    ) {
      currentStatus = "Warning";

      currentStatusClass =
        "bg-yellow-400/10 text-yellow-400";

      currentMessage =
        `At your current spending rate, you may spend around ₹${calculatedPrediction.toLocaleString(
          "en-IN"
        )} this month.`;

      currentRecommendation =
        `You may exceed your budget by approximately ₹${(
          calculatedPrediction -
          budget
        ).toLocaleString(
          "en-IN"
        )}. Consider reducing your daily spending.`;
    }

    /* =========================
       50%+ USED
    ========================= */

    else if (percentage >= 50) {
      currentStatus = "On Track";

      currentStatusClass =
        "bg-cyan-400/10 text-cyan-400";

      currentMessage =
        `You've used ${percentage}% of your monthly budget.`;

      currentRecommendation =
        "Your spending is manageable. Continue monitoring your expenses.";
    }

    /* =========================
       LOW SPENDING
    ========================= */

    else {
      currentStatus = "Good";

      currentStatusClass =
        "bg-green-400/10 text-green-400";

      currentMessage =
        `You've used only ${percentage}% of your monthly budget.`;

      currentRecommendation =
        `You still have ₹${safeRemaining.toLocaleString(
          "en-IN"
        )} available. Keep maintaining your spending discipline.`;
    }

    return {
      daysElapsed: elapsed,
      daysInMonth: totalDays,
      dailyAverage: average,
      predicted: calculatedPrediction,
      remainingBudget: remaining,
      budgetUsedPercentage: percentage,
      status: currentStatus,
      statusClass: currentStatusClass,
      message: currentMessage,
      recommendation: currentRecommendation,
      categoryInsight: currentCategoryInsight,
    };
  }, [
    budget,
    expenses,
    predictedExpense,
    categoryBudgetAlerts,
  ]);

  /* =========================
     CATEGORY ICON
  ========================= */

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍔",
      Travel: "🚕",
      Shopping: "🛍️",
      Bills: "💡",
      Entertainment: "🎬",
      Health: "❤️",
      Education: "📚",
      Other: "💳",
      Transport: "🚕",
    };

    return icons[category] || "💳";
  };

  /* =========================
     STATUS ICON
  ========================= */

  const statusIcon =
    status === "Over Budget"
      ? "🔴"
      : status === "Warning"
      ? "⚠️"
      : status === "Setup Required"
      ? "⚙️"
      : status === "On Track"
      ? "📊"
      : "💡";

  /* =========================
     SMART RECOMMENDATIONS
  ========================= */

  const recommendations = useMemo(() => {
    const list = [];

    if (budget <= 0) {
      list.push({
        icon: "⚙️",
        title: "Set your monthly budget",
        text: "Add a monthly budget to receive personalized recommendations.",
      });

      return list;
    }

    if (expenses > budget) {
      const exceeded =
        expenses - budget;

      list.push({
        icon: "🔴",
        title: "You're over budget",
        text: `You've exceeded your monthly budget by ₹${exceeded.toLocaleString(
          "en-IN"
        )}. Try to avoid unnecessary spending for the rest of the month.`,
      });
    } else if (
      budgetUsedPercentage >= 80
    ) {
      list.push({
        icon: "⚠️",
        title: "Slow down your spending",
        text: `You've already used ${budgetUsedPercentage}% of your budget. Only ₹${Math.max(
          remainingBudget,
          0
        ).toLocaleString(
          "en-IN"
        )} remains.`,
      });
    } else if (
      budgetUsedPercentage >= 50
    ) {
      list.push({
        icon: "📊",
        title: "You're on track",
        text: `You've used ${budgetUsedPercentage}% of your budget. Continue monitoring your daily expenses.`,
      });
    } else {
      list.push({
        icon: "💚",
        title: "Great spending discipline",
        text: `You've used only ${budgetUsedPercentage}% of your budget. Keep maintaining this habit.`,
      });
    }

    if (
      dailyAverage > 0 &&
      budget > 0
    ) {
      const remainingDays =
        Math.max(
          daysInMonth - daysElapsed,
          1
        );

      const dailyLimit =
        Math.max(
          remainingBudget /
            remainingDays,
          0
        );

      list.push({
        icon: "📅",
        title: "Daily spending target",
        text:
          remainingBudget > 0
            ? `Try to keep your spending around ₹${Math.round(
                dailyLimit
              ).toLocaleString(
                "en-IN"
              )} or less per day for the remaining days.`
            : "Your monthly budget has been exhausted, so focus on essential expenses only.",
      });
    }

    if (categoryInsight) {
      const category =
        categoryInsight.category;

      const spent = Number(
        categoryInsight.spent || 0
      );

      const categoryBudget =
        Number(
          categoryInsight.budget || 0
        );

      const categoryRemaining =
        Math.max(
          categoryBudget - spent,
          0
        );

      if (
        categoryInsight.status ===
        "danger"
      ) {
        list.push({
          icon: getCategoryIcon(
            category
          ),
          title: `${category} needs attention`,
          text: `You've spent ₹${spent.toLocaleString(
            "en-IN"
          )} against a ₹${categoryBudget.toLocaleString(
            "en-IN"
          )} budget. Reduce spending in this category.`,
        });
      } else if (
        categoryInsight.status ===
        "warning"
      ) {
        list.push({
          icon: getCategoryIcon(
            category
          ),
          title: `Watch your ${category} spending`,
          text: `Only ₹${categoryRemaining.toLocaleString(
            "en-IN"
          )} remains in your ${category} budget.`,
        });
      }
    }

    if (
      predicted > budget &&
      budget > 0
    ) {
      list.push({
        icon: "📈",
        title: "Your spending may increase",
        text: `At your current rate, your predicted monthly expense is around ₹${predicted.toLocaleString(
          "en-IN"
        )}. Consider reducing your daily spending.`,
      });
    }

    return list;
  }, [
    budget,
    expenses,
    predicted,
    remainingBudget,
    budgetUsedPercentage,
    dailyAverage,
    daysElapsed,
    daysInMonth,
    categoryInsight,
  ]);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-transparent p-6 shadow-lg">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/15 text-xl">
            🤖
          </div>

          <div>

            <h3 className="font-semibold">
              AI Financial Guardian
            </h3>

            <p className="text-xs text-gray-400">
              Smart analysis of your spending
            </p>

          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs ${statusClass}`}
        >
          {status}
        </span>

      </div>

      {/* MAIN MESSAGE */}

      <div className="mt-5">

        <p className="leading-6 text-gray-300">
          {message}
        </p>

        {/* MONTHLY DATA */}

        <div className="mt-4 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-black/10 p-3">

            <p className="text-xs text-gray-400">
              Predicted Expense
            </p>

            <p className="mt-1 font-bold text-white">
              ₹
              {predicted.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <div className="rounded-xl bg-black/10 p-3">

            <p className="text-xs text-gray-400">
              Monthly Budget
            </p>

            <p className="mt-1 font-bold text-white">
              ₹
              {budget.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

        </div>

        {/* DAILY AVERAGE */}

        {expenses > 0 && (
          <div className="mt-3 rounded-xl bg-black/10 p-3">

            <div className="flex justify-between">

              <span className="text-xs text-gray-400">
                Daily Average
              </span>

              <span className="text-sm font-semibold">
                ₹
                {Math.round(
                  dailyAverage
                ).toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <div className="mt-1 flex justify-between">

              <span className="text-xs text-gray-500">
                Day {daysElapsed} of{" "}
                {daysInMonth}
              </span>

              <span className="text-xs text-gray-500">
                {budgetUsedPercentage}%
                {" "}
                budget used
              </span>

            </div>

          </div>
        )}

        {/* CATEGORY AI INSIGHT */}

        {categoryInsight && (
          <div
            className={`mt-4 rounded-xl border p-4 ${
              categoryInsight.status ===
              "danger"
                ? "border-red-400/20 bg-red-400/10"
                : categoryInsight.status ===
                  "warning"
                ? "border-yellow-400/20 bg-yellow-400/10"
                : "border-green-400/20 bg-green-400/10"
            }`}
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="text-xl">
                  {getCategoryIcon(
                    categoryInsight.category
                  )}
                </span>

                <div>

                  <p className="text-sm font-semibold">
                    {categoryInsight.category}
                  </p>

                  <p className="text-xs text-gray-400">
                    ₹
                    {Number(
                      categoryInsight.spent || 0
                    ).toLocaleString(
                      "en-IN"
                    )}{" "}
                    / ₹
                    {Number(
                      categoryInsight.budget || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>

              <span
                className={`text-sm font-bold ${
                  categoryInsight.status ===
                  "danger"
                    ? "text-red-400"
                    : categoryInsight.status ===
                      "warning"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {Number(
                  categoryInsight.percentage || 0
                )}
                %
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  categoryInsight.status ===
                  "danger"
                    ? "bg-red-400"
                    : categoryInsight.status ===
                      "warning"
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }`}
                style={{
                  width: `${Math.min(
                    Number(
                      categoryInsight.percentage ||
                        0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>
        )}

        {/* RECOMMENDATION */}

        <p
          className={`mt-4 text-sm ${
            status === "Over Budget"
              ? "text-red-400"
              : status === "Warning"
              ? "text-yellow-400"
              : status === "Setup Required"
              ? "text-yellow-400"
              : status === "On Track"
              ? "text-cyan-400"
              : "text-green-400"
          }`}
        >
          {statusIcon}{" "}
          {recommendation}
        </p>

      </div>

      {/* =========================
          AI RECOMMENDATIONS BUTTON
      ========================= */}

      <button
        onClick={() =>
          setShowRecommendations(
            !showRecommendations
          )
        }
        className="mt-5 flex w-full items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
      >
        <span>
          🤖 View AI Recommendations
        </span>

        <span
          className={`transition-transform duration-300 ${
            showRecommendations
              ? "rotate-180"
              : ""
          }`}
        >
          ↓
        </span>
      </button>

      {/* =========================
          RECOMMENDATIONS PANEL
      ========================= */}

      {showRecommendations && (
        <div className="mt-4 space-y-3 rounded-2xl border border-cyan-400/10 bg-black/10 p-4">

          <div className="mb-3">

            <h4 className="font-semibold text-white">
              💡 Personalized Recommendations
            </h4>

            <p className="mt-1 text-xs text-gray-500">
              Based on your current spending
              pattern.
            </p>

          </div>

          {recommendations.map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
              >

                <div className="flex gap-3">

                  <span className="text-xl">
                    {item.icon}
                  </span>

                  <div>

                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      {item.text}
                    </p>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default AIInsight;