const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  updateFinancialProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.put(
  "/financial",
  protect,
  updateFinancialProfile
);

module.exports = router;