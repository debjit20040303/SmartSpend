import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

function Transactions() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");

  // =========================
  // EDIT STATE
  // =========================

  const [editingExpense, setEditingExpense] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    note: "",
  });

  // =========================
  // DELETE STATE
  // =========================

  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    "All",
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  const categoryIcons = {
    Food: "🍔",
    Transport: "🚕",
    Travel: "🚕",
    Shopping: "🛍️",
    Bills: "💡",
    Entertainment: "🎬",
    Health: "❤️",
    Education: "📚",
    Other: "💳",
  };

  // =========================
  // LOAD EXPENSES
  // =========================

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(data?.expenses || []);
    } catch (err) {
      console.error("Transactions error:", err);

      setError(
        err.message || "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH + FILTER + SORT
  // =========================

  const filteredExpenses = useMemo(() => {
    const result = expenses.filter((expense) => {
      const title =
        expense.title?.toLowerCase() || "";

      const note =
        expense.note?.toLowerCase() || "";

      const categoryText =
        expense.category?.toLowerCase() || "";

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        title.includes(searchText) ||
        note.includes(searchText) ||
        categoryText.includes(searchText);

      const matchesCategory =
        category === "All" ||
        expense.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

    // =========================
    // SORT
    // =========================

    result.sort((a, b) => {
      const dateA = new Date(
        a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || 0
      ).getTime();

      if (sortOrder === "latest") {
        return dateB - dateA;
      }

      if (sortOrder === "oldest") {
        return dateA - dateB;
      }

      if (sortOrder === "highest") {
        return (
          Number(b.amount || 0) -
          Number(a.amount || 0)
        );
      }

      if (sortOrder === "lowest") {
        return (
          Number(a.amount || 0) -
          Number(b.amount || 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    expenses,
    search,
    category,
    sortOrder,
  ]);

  // =========================
  // TOTAL
  // =========================

  const totalExpenses =
    filteredExpenses.reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

  // =========================
  // EDIT
  // =========================

  const openEditModal = (expense) => {
    setEditingExpense(expense);

    setEditForm({
      title: expense.title || "",
      amount: expense.amount || "",
      category:
        expense.category || "Food",
      note: expense.note || "",
    });

    setError("");
  };

  const closeEditModal = () => {
    if (editLoading) return;

    setEditingExpense(null);

    setEditForm({
      title: "",
      amount: "",
      category: "Food",
      note: "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    try {
      setEditLoading(true);
      setError("");

      if (!editForm.title.trim()) {
        setError("Expense title is required.");
        return;
      }

      if (
        !editForm.amount ||
        Number(editForm.amount) <= 0
      ) {
        setError(
          "Please enter a valid expense amount."
        );
        return;
      }

      await updateExpense(
        editingExpense._id,
        {
          title: editForm.title.trim(),
          amount: Number(editForm.amount),
          category: editForm.category,
          note: editForm.note.trim(),
        }
      );

      closeEditModal();

      await loadExpenses();
    } catch (err) {
      console.error(
        "Update expense error:",
        err
      );

      setError(
        err.message ||
          "Failed to update expense"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const openDeleteModal = (expense) => {
    setDeletingExpense(expense);
    setError("");
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setDeletingExpense(null);
  };

  const handleDeleteExpense = async () => {
    if (!deletingExpense) return;

    try {
      setDeleteLoading(true);
      setError("");

      await deleteExpense(
        deletingExpense._id
      );

      setDeletingExpense(null);

      await loadExpenses();
    } catch (err) {
      console.error(
        "Delete expense error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete expense"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071A2F] text-white">
        <div className="text-center">
          <div className="text-2xl font-semibold">
            Loading Transactions...
          </div>

          <p className="mt-2 text-gray-400">
            Fetching your expenses
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071A2F] via-[#0B2545] to-[#06111F] text-white">
      <div className="flex">
        <Sidebar />

        <main className="min-h-screen flex-1">
          <Navbar />

          <div className="p-5 md:p-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-8">
              <h1 className="text-3xl font-bold md:text-4xl">
                Transactions
              </h1>

              <p className="mt-2 text-gray-400">
                View and manage all your expenses.
              </p>
            </div>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
                {error}
              </div>
            )}

            {/* =========================
                SEARCH + FILTER
            ========================= */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

              {/* SEARCH */}

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              {/* CATEGORY */}

              <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setCategory(item)
                    }
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm transition ${
                      category === item
                        ? "bg-cyan-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* SORT */}

              <div className="mt-4">
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-[#071A2F] px-4 py-2 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="latest">
                    Latest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>

                  <option value="highest">
                    Highest Amount
                  </option>

                  <option value="lowest">
                    Lowest Amount
                  </option>
                </select>
              </div>
            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-gray-400">
                  Showing Transactions
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {filteredExpenses.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-gray-400">
                  Total Amount
                </p>

                <p className="mt-2 text-3xl font-bold text-cyan-400">
                  ₹
                  {totalExpenses.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            {/* =========================
                TRANSACTIONS
            ========================= */}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    All Transactions
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Your expense history
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">

                {filteredExpenses.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-5xl">
                      💳
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      No transactions found
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Try changing your search or
                      category filter.
                    </p>
                  </div>
                ) : (
                  filteredExpenses.map(
                    (expense) => {
                      const icon =
                        categoryIcons[
                          expense.category
                        ] || "💳";

                      const date =
                        expense.createdAt
                          ? new Date(
                              expense.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Date unavailable";

                      return (
                        <div
                          key={expense._id}
                          className="flex flex-col gap-4 rounded-xl border border-white/5 bg-black/10 p-4 transition hover:bg-white/10 md:flex-row md:items-center md:justify-between"
                        >

                          {/* LEFT */}

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                              {icon}
                            </div>

                            <div>
                              <h3 className="font-semibold">
                                {expense.title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-400">
                                {expense.note ||
                                  expense.category}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {expense.category}
                                {" • "}
                                {date}
                              </p>
                            </div>
                          </div>

                          {/* RIGHT */}

                          <div className="flex items-center justify-between gap-5 md:justify-end">

                            <p className="font-semibold text-red-400">
                              -₹
                              {Number(
                                expense.amount || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            {/* ACTIONS */}

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  openEditModal(
                                    expense
                                  )
                                }
                                className="rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
                              >
                                ✏️ Edit
                              </button>

                              <button
                                onClick={() =>
                                  openDeleteModal(
                                    expense
                                  )
                                }
                                className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white"
                              >
                                🗑️ Delete
                              </button>

                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B2545] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Edit Expense
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Update your expense details.
                </p>
              </div>

              <button
                onClick={closeEditModal}
                disabled={editLoading}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdateExpense}
              className="space-y-5"
            >

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Expense Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  placeholder="e.g. Lunch"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              {/* AMOUNT */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Amount
                </label>

                <div className="flex overflow-hidden rounded-xl border border-white/10 bg-black/20 focus-within:border-cyan-400">

                  <span className="flex items-center px-4 text-gray-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    min="1"
                    required
                    className="w-full bg-transparent px-2 py-3 text-white outline-none"
                  />
                </div>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Category
                </label>

                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-white/10 bg-[#071A2F] px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="Food">
                    Food
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Bills">
                    Bills
                  </option>

                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Health">
                    Health
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* NOTE */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Note
                </label>

                <textarea
                  name="note"
                  value={editForm.note}
                  onChange={handleEditChange}
                  rows="3"
                  placeholder="Optional note"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={editLoading}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 font-medium text-gray-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editLoading
                    ? "Updating..."
                    : "Update Expense"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deletingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B2545] p-6 shadow-2xl">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
                🗑️
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Delete Expense?
              </h2>

              <p className="mt-3 text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  {deletingExpense.title}
                </span>
                ?
              </p>

              <p className="mt-2 text-sm text-red-400">
                This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 font-medium text-gray-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteExpense}
                  disabled={deleteLoading}
                  className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteLoading
                    ? "Deleting..."
                    : "Yes, Delete"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;