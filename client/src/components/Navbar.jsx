import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getExpenses,
  getFinancial,
} from "../services/expenseService";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showUserMenu, setShowUserMenu] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const pageInfo = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Manage your finances smartly",
    },

    "/transactions": {
      title: "Transactions",
      subtitle: "View and manage all your expenses",
    },

    "/add-expense": {
      title: "Add Expense",
      subtitle: "Record a new expense",
    },

    "/budgets": {
      title: "Budgets",
      subtitle: "Plan and manage your monthly budgets",
    },

    "/financial-setup": {
      title: "Financial Setup",
      subtitle: "Set up your financial information",
    },

    "/financial-settings": {
      title: "Financial Settings",
      subtitle: "Manage your financial information",
    },

    "/ai-assistant": {
      title: "AI Assistant",
      subtitle: "Your personal financial intelligence",
    },
  };

  const currentPage = pageInfo[location.pathname] || {
    title: "Dashboard",
    subtitle: "Manage your finances smartly",
  };

  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  useEffect(() => {
    loadNotifications();
  }, [location.pathname]);

  const loadNotifications = async () => {
    try {
      const [expenseData, financialData] =
        await Promise.all([
          getExpenses(),
          getFinancial(),
        ]);

      const expenses =
        expenseData?.expenses || [];

      const financial =
        financialData?.financial || {};

      const monthlyBudget =
        Number(
          financial.monthlyBudget || 0
        );

      const totalExpenses =
        expenses.reduce(
          (total, expense) =>
            total +
            Number(expense.amount || 0),
          0
        );

      const budgetPercentage =
        monthlyBudget > 0
          ? Math.round(
              (totalExpenses /
                monthlyBudget) *
                100
            )
          : 0;

      const newNotifications = [];

      // =========================
      // NO BUDGET
      // =========================

      if (monthlyBudget <= 0) {
        newNotifications.push({
          type: "setup",
          icon: "⚙️",
          title: "Set your monthly budget",
          message:
            "Set a monthly budget to receive financial alerts.",
        });
      }

      // =========================
      // OVER BUDGET
      // =========================

      else if (
        totalExpenses > monthlyBudget
      ) {
        const exceeded =
          totalExpenses -
          monthlyBudget;

        newNotifications.push({
          type: "danger",
          icon: "🔴",
          title: "Budget exceeded",
          message: `You've exceeded your monthly budget by ₹${exceeded.toLocaleString(
            "en-IN"
          )}.`,
        });
      }

      // =========================
      // 80%+ WARNING
      // =========================

      else if (
        budgetPercentage >= 80
      ) {
        const remaining =
          Math.max(
            monthlyBudget -
              totalExpenses,
            0
          );

        newNotifications.push({
          type: "warning",
          icon: "⚠️",
          title: "Budget warning",
          message: `You've used ${budgetPercentage}% of your budget. ₹${remaining.toLocaleString(
            "en-IN"
          )} remains.`,
        });
      }

      // =========================
      // GOOD
      // =========================

      else {
        newNotifications.push({
          type: "success",
          icon: "🟢",
          title: "Spending is under control",
          message: `You've used ${budgetPercentage}% of your monthly budget.`,
        });
      }

      setNotifications(
        newNotifications
      );
    } catch (error) {
      console.error(
        "Notification error:",
        error
      );

      setNotifications([
        {
          type: "error",
          icon: "⚠️",
          title: "Unable to load notifications",
          message:
            "Please try again later.",
        },
      ]);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setShowUserMenu(false);
    setShowNotifications(false);

    navigate("/login");
  };

  // =========================
  // ALERT COUNT
  // =========================

  const alertCount =
    notifications.filter(
      (notification) =>
        notification.type ===
          "danger" ||
        notification.type ===
          "warning"
    ).length;

  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">

      {/* =========================
          PAGE INFORMATION
      ========================= */}

      <div>
        <h2 className="text-xl font-semibold text-white">
          {currentPage.title}
        </h2>

        <p className="text-sm text-gray-400">
          {currentPage.subtitle}
        </p>
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="flex items-center gap-5">

        {/* =========================
            NOTIFICATION
        ========================= */}

        <div className="relative">

          <button
            onClick={() => {
              setShowNotifications(
                !showNotifications
              );

              setShowUserMenu(false);
            }}
            className="text-xl text-gray-300 hover:text-white"
          >
            🔔

            {/* ALERT BADGE */}

            {alertCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {alertCount}
              </span>
            )}
          </button>

          {/* =========================
              NOTIFICATION DROPDOWN
          ========================= */}

          {showNotifications && (
            <div className="absolute right-0 top-9 z-50 w-80 rounded-2xl border border-white/10 bg-[#0B2545] p-4 shadow-2xl">

              <div className="flex items-center justify-between">

                <h3 className="font-semibold text-white">
                  🔔 Notifications
                </h3>

                <button
                  onClick={() =>
                    setShowNotifications(
                      false
                    )
                  }
                  className="text-sm text-gray-400 hover:text-white"
                >
                  ✕
                </button>

              </div>

              <div className="mt-3 space-y-3">

                {notifications.length ===
                0 ? (
                  <p className="py-4 text-center text-sm text-gray-400">
                    No notifications
                  </p>
                ) : (
                  notifications.map(
                    (
                      notification,
                      index
                    ) => (
                      <div
                        key={index}
                        className={`rounded-xl border p-3 ${
                          notification.type ===
                          "danger"
                            ? "border-red-400/20 bg-red-400/10"
                            : notification.type ===
                              "warning"
                            ? "border-yellow-400/20 bg-yellow-400/10"
                            : notification.type ===
                              "setup"
                            ? "border-yellow-400/20 bg-yellow-400/10"
                            : "border-green-400/20 bg-green-400/10"
                        }`}
                      >

                        <div className="flex gap-3">

                          <span className="text-lg">
                            {
                              notification.icon
                            }
                          </span>

                          <div>

                            <p className="text-sm font-semibold text-white">
                              {
                                notification.title
                              }
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-400">
                              {
                                notification.message
                              }
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

            </div>
          )}

        </div>

        {/* =========================
            USER PROFILE
        ========================= */}

        <div className="relative">

          <button
            onClick={() => {
              setShowUserMenu(
                !showUserMenu
              );

              setShowNotifications(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-white"
          >
            D
          </button>

          {/* =========================
              USER DROPDOWN
          ========================= */}

          {showUserMenu && (
            <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-white/10 bg-[#0B2545] p-2 shadow-2xl">

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-red-400/10 hover:text-red-400"
              >
                🚪
                <span>
                  Logout
                </span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;