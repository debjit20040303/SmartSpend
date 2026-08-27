import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateFinancialProfile } from "../services/authService";

function FinancialSetup() {
  const navigate = useNavigate();

  const [salary, setSalary] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (Number(monthlyBudget) > Number(salary)) {
      setError("Monthly budget cannot be greater than salary.");
      return;
    }

    try {
      setLoading(true);

      const data = await updateFinancialProfile(
        Number(salary),
        Number(monthlyBudget)
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071A2F] via-[#0B2545] to-[#06111F] px-4 py-10">

      <div className="mx-auto max-w-md pt-20">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">

          <h1 className="text-3xl font-bold text-white">
            Set Your Finances 💰
          </h1>

          <p className="mt-2 text-gray-400">
            Tell SmartSpend AI about your monthly finances.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Monthly Salary
              </label>

              <input
                type="number"
                min="0"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 40000"
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Monthly Expense Budget
              </label>

              <input
                type="number"
                min="0"
                value={monthlyBudget}
                onChange={(e) =>
                  setMonthlyBudget(e.target.value)
                }
                placeholder="e.g. 25000"
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Financial Plan"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default FinancialSetup;