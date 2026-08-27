const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const financialRoutes = require("./routes/financialRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

dotenv.config();

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "SmartSpend AI API is running",
  });
});

/* =========================
   API ROUTES
========================= */

// Authentication
app.use("/api/auth", authRoutes);

// User profile
app.use("/api/profile", profileRoutes);

// Expenses
app.use("/api/expenses", expenseRoutes);

// Financial settings
app.use("/api/financial", financialRoutes);
app.use("/api/budgets", budgetRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: "Internal server error",
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});