const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

// =========================
// ADD EXPENSE
// =========================
router.post("/", protect, addExpense);

// =========================
// GET EXPENSES
// =========================
router.get("/", protect, getExpenses);

// =========================
// UPDATE EXPENSE
// =========================
router.put("/:id", protect, updateExpense);

// =========================
// DELETE EXPENSE
// =========================
router.delete("/:id", protect, deleteExpense);

module.exports = router;