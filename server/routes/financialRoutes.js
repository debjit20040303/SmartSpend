const express = require("express");

const router = express.Router();

const {
  getFinancial,
  updateFinancial,
} = require("../controllers/financialController");

const protect = require("../middleware/authMiddleware");

// =========================
// GET FINANCIAL SETTINGS
// =========================

router.get(
  "/",
  protect,
  getFinancial
);

// =========================
// UPDATE FINANCIAL SETTINGS
// =========================

router.put(
  "/",
  protect,
  updateFinancial
);

module.exports = router;