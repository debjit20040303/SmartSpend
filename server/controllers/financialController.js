const Financial = require("../models/Financial");

// =========================
// GET FINANCIAL SETTINGS
// =========================

const getFinancial = async (req, res) => {
  try {
    let financial = await Financial.findOne({
      user: req.user.userId,
    });

    // Create default settings if not found
    if (!financial) {
      financial = await Financial.create({
        user: req.user.userId,
        monthlySalary: 0,
        monthlyBudget: 0,
        savingsGoal: 0,
      });
    }

    res.status(200).json({
      financial,
    });
  } catch (error) {
    console.error(
      "GET FINANCIAL ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to get financial settings",
      error: error.message,
    });
  }
};

// =========================
// UPDATE FINANCIAL SETTINGS
// =========================

const updateFinancial = async (req, res) => {
  try {
    const {
      monthlySalary,
      monthlyBudget,
      savingsGoal,
    } = req.body;

    // Convert values to numbers
    const salary = Number(
      monthlySalary || 0
    );

    const budget = Number(
      monthlyBudget || 0
    );

    const goal = Number(
      savingsGoal || 0
    );

    // Basic validation
    if (
      salary < 0 ||
      budget < 0 ||
      goal < 0
    ) {
      return res.status(400).json({
        message:
          "Financial values cannot be negative",
      });
    }

    const financial =
      await Financial.findOneAndUpdate(
        {
          user: req.user.userId,
        },
        {
          monthlySalary: salary,
          monthlyBudget: budget,
          savingsGoal: goal,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(200).json({
      message:
        "Financial settings updated successfully",
      financial,
    });
  } catch (error) {
    console.error(
      "UPDATE FINANCIAL ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update financial settings",
      error: error.message,
    });
  }
};

module.exports = {
  getFinancial,
  updateFinancial,
};