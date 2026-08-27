import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
      path: "/dashboard",
    },
    {
      name: "Transactions",
      icon: "💳",
      path: "/transactions",
    },
    {
      name: "Add Expense",
      icon: "➕",
      path: "/add-expense",
    },
    {
      name: "Budgets",
      icon: "💰",
      path: "/budgets",
    },
    {
      name: "AI Assistant",
      icon: "🤖",
      path: "/ai-assistant",
    },
    {
      name: "Settings",
      icon: "⚙️",
      path: "/financial-settings",
    },
  ];

  return (
    <aside className="hidden min-h-screen w-64 border-r border-white/10 bg-[#071A2F] p-6 text-white md:block">

      {/* =========================
          LOGO
      ========================= */}

      <div className="mb-10">

        <button
          onClick={() => navigate("/dashboard")}
          className="text-left"
        >
          <h1 className="text-2xl font-bold">
            SmartSpend{" "}
            <span className="text-cyan-400">
              AI
            </span>
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            Smart financial management
          </p>
        </button>

      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="space-y-2">

        {menuItems.map((item) => {

          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >

              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>

            </button>
          );
        })}

      </nav>

      {/* =========================
          BOTTOM CARD
      ========================= */}

     
    </aside>
  );
}

export default Sidebar;