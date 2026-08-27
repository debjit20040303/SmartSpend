const mongoose = require("mongoose");

const financialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    monthlySalary: {
      type: Number,
      default: 0,
      min: 0,
    },

    monthlyBudget: {
      type: Number,
      default: 0,
      min: 0,
    },

    savingsGoal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Financial",
  financialSchema
);