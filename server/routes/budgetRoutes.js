const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getBudgets,
  saveBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();

router.get("/", protect, getBudgets);

router.put("/", protect, saveBudget);

router.delete("/:id", protect, deleteBudget);

module.exports = router;