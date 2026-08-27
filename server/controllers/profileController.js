const User = require("../models/User");

const updateFinancialProfile = async (req, res) => {
  try {
    const { salary, monthlyBudget } = req.body || {};

    if (salary === undefined || monthlyBudget === undefined) {
      return res.status(400).json({
        message: "Salary and monthly budget are required",
      });
    }

    if (Number(salary) < 0 || Number(monthlyBudget) < 0) {
      return res.status(400).json({
        message: "Salary and budget cannot be negative",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.salary = Number(salary);
    user.monthlyBudget = Number(monthlyBudget);

    await user.save();

    res.status(200).json({
      message: "Financial profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        salary: user.salary,
        monthlyBudget: user.monthlyBudget,
      },
    });

  } catch (error) {
    console.error("Financial Profile Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  updateFinancialProfile,
};