const Budget = require("../models/Budget");

// =========================
// GET BUDGETS
// =========================

const getBudgets = async (req, res) => {
  try {
    const now = new Date();

    const month =
      Number(req.query.month) ||
      now.getMonth() + 1;

    const year =
      Number(req.query.year) ||
      now.getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    }).sort({ category: 1 });

    res.status(200).json({
      success: true,
      budgets,
    });
  } catch (error) {
    console.error("Get budgets error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get budgets",
    });
  }
};

// =========================
// CREATE / UPDATE BUDGET
// =========================

const saveBudget = async (req, res) => {
  try {
    const {
      category,
      amount,
      month,
      year,
    } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Category and amount are required",
      });
    }

    const budgetAmount = Number(amount);

    if (
      Number.isNaN(budgetAmount) ||
      budgetAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Budget amount must be a valid positive number",
      });
    }

    const now = new Date();

    const budgetMonth =
      Number(month) ||
      now.getMonth() + 1;

    const budgetYear =
      Number(year) ||
      now.getFullYear();

    if (
      budgetMonth < 1 ||
      budgetMonth > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid month",
      });
    }

    const budget =
      await Budget.findOneAndUpdate(
        {
          user: req.user._id,
          category,
          month: budgetMonth,
          year: budgetYear,
        },
        {
          user: req.user._id,
          category,
          amount: budgetAmount,
          month: budgetMonth,
          year: budgetYear,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    console.error(
      "Save budget error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to save budget",
    });
  }
};

// =========================
// DELETE BUDGET
// =========================

const deleteBudget = async (req, res) => {
  try {
    const budget =
      await Budget.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete budget error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete budget",
    });
  }
};

module.exports = {
  getBudgets,
  saveBudget,
  deleteBudget,
};