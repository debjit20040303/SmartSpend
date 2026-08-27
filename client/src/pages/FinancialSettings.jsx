import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getFinancial,
  saveFinancial,
} from "../services/expenseService";

function FinancialSettings() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    monthlySalary: "",
    monthlyBudget: "",
    savingsGoal: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFinancial();

      if (data) {
        setFormData({
          monthlySalary: data.monthlySalary ?? "",
          monthlyBudget: data.monthlyBudget ?? "",
          savingsGoal: data.savingsGoal ?? "",
        });
      }
    } catch (err) {
      console.error("Failed to load financial data:", err);
      setError("Could not load your financial settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await saveFinancial({
        monthlySalary: Number(formData.monthlySalary) || 0,
        monthlyBudget: Number(formData.monthlyBudget) || 0,
        savingsGoal: Number(formData.savingsGoal) || 0,
      });

      setMessage("Financial settings saved successfully.");
    } catch (err) {
      console.error("Failed to save financial settings:", err);
      setError("Could not save your financial settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="flex min-h-[70vh] items-center justify-center">
              <p className="text-gray-400">
                Loading financial settings...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="mb-4 text-sm text-gray-400 transition hover:text-white"
              >
                ← Back to Dashboard
              </button>

              <h1 className="text-3xl font-bold">
                Financial Settings
              </h1>

              <p className="mt-2 text-gray-400">
                Manage your salary, monthly budget and savings goal.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                {message}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-xl md:p-8"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Monthly Salary */}
                <div>
                  <label
                    htmlFor="monthlySalary"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Monthly Salary
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ₹
                    </span>

                    <input
                      id="monthlySalary"
                      name="monthlySalary"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthlySalary}
                      onChange={handleChange}
                      placeholder="50000"
                      className="relative z-10 w-full rounded-xl border border-gray-700 bg-gray-800 px-10 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Monthly Budget */}
                <div>
                  <label
                    htmlFor="monthlyBudget"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Monthly Budget
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ₹
                    </span>

                    <input
                      id="monthlyBudget"
                      name="monthlyBudget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthlyBudget}
                      onChange={handleChange}
                      placeholder="30000"
                      className="relative z-10 w-full rounded-xl border border-gray-700 bg-gray-800 px-10 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Savings Goal */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="savingsGoal"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Monthly Savings Goal
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ₹
                    </span>

                    <input
                      id="savingsGoal"
                      name="savingsGoal"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.savingsGoal}
                      onChange={handleChange}
                      placeholder="10000"
                      className="relative z-10 w-full rounded-xl border border-gray-700 bg-gray-800 px-10 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <h3 className="font-semibold text-blue-400">
                  💡 Financial Planning
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Your salary and budget information helps the AI
                  expense tracker analyze your spending and provide
                  personalized financial insights.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Financial Settings"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Summary */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MiniStat
                label="Monthly Salary"
                value={formData.monthlySalary}
              />

              <MiniStat
                label="Monthly Budget"
                value={formData.monthlyBudget}
              />

              <MiniStat
                label="Savings Goal"
                value={formData.savingsGoal}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        ₹{Number(value || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default FinancialSettings;