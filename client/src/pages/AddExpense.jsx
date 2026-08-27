import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addExpense } from "../services/expenseService";
import "./AddExpense.css";

function AddExpense() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      await addExpense({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        note: formData.note,
      });

      setMessage("Expense added successfully!");

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        note: "",
      });

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-page">

      <div className="expense-card">

        <div className="expense-header">
          <h1>Add Expense 💸</h1>
          <p>Record your spending and keep track of your budget.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Expense Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Lunch"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>

            <div className="amount-input">
              <span>₹</span>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">
                Entertainment
              </option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Note</label>

            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Optional note"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="add-expense-btn"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>

        </form>

        {message && (
          <div className="expense-message">
            {message}
          </div>
        )}

        {error && (
          <div
            className="expense-message"
            style={{
              background: "#fef2f2",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "12px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#6366f1",
          }}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default AddExpense;