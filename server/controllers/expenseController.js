const Expense = require("../models/Expense");

// =====================================================
// ADD EXPENSE
// =====================================================

const addExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      note,
    } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({
        message:
          "Title, amount and category are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const expense = await Expense.create({
      user: req.user.userId,
      title,
      amount: Number(amount),
      category,
      date: date || Date.now(),
      note,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// GET USER EXPENSES
// =====================================================

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.userId,
    }).sort({
      date: -1,
    });

    res.status(200).json({
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE EXPENSE
// =====================================================

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      amount,
      category,
      date,
      note,
    } = req.body;

    // Validate amount if provided
    if (
      amount !== undefined &&
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    // Find expense belonging to logged-in user
    const expense = await Expense.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Update only provided fields
    if (title !== undefined) {
      expense.title = title;
    }

    if (amount !== undefined) {
      expense.amount = Number(amount);
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (date !== undefined) {
      expense.date = date;
    }

    if (note !== undefined) {
      expense.note = note;
    }

    const updatedExpense = await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE EXPENSE
// =====================================================

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find expense belonging to logged-in user
    const expense = await Expense.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await Expense.deleteOne({
      _id: id,
      user: req.user.userId,
    });

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};