
import axios from "axios";

// =====================================================
// API BASE URL (RENDER BACKEND)
// =====================================================

const API_URL = "https://smartspend-yyhe.onrender.com/api";

// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// =====================================================
// EXPENSES
// =====================================================

// GET ALL EXPENSES

export const getExpenses = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/expenses`,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET EXPENSES ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to fetch expenses"
    );
  }
};

// ADD EXPENSE

export const addExpense = async (expenseData) => {
  try {
    const response = await axios.post(
      `${API_URL}/expenses`,
      expenseData,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "ADD EXPENSE ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to add expense"
    );
  }
};

// UPDATE EXPENSE

export const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await axios.put(
      `${API_URL}/expenses/${expenseId}`,
      expenseData,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE EXPENSE ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to update expense"
    );
  }
};

// DELETE EXPENSE

export const deleteExpense = async (expenseId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/expenses/${expenseId}`,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "DELETE EXPENSE ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to delete expense"
    );
  }
};

// =====================================================
// FINANCIAL SETTINGS
// =====================================================

// GET FINANCIAL SETTINGS

export const getFinancial = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/financial`,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET FINANCIAL ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch financial settings"
    );
  }
};

// UPDATE FINANCIAL SETTINGS

export const updateFinancial = async (financialData) => {
  try {
    const response = await axios.put(
      `${API_URL}/financial`,
      financialData,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE FINANCIAL ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Failed to update financial settings"
    );
  }
};

// SAVE FINANCIAL

export const saveFinancial = async (financialData) => {
  return updateFinancial(financialData);
};

// =====================================================
// BUDGETS
// =====================================================

// GET BUDGETS

export const getBudgets = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/budgets`,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET BUDGETS ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to fetch budgets"
    );
  }
};

// ADD BUDGET

export const addBudget = async (budgetData) => {
  try {
    const response = await axios.post(
      `${API_URL}/budgets`,
      budgetData,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "ADD BUDGET ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to add budget"
    );
  }
};

// SAVE BUDGET

export const saveBudget = async (budgetData) => {
  return addBudget(budgetData);
};

// UPDATE BUDGET

export const updateBudget = async (budgetId, budgetData) => {
  try {
    const response = await axios.put(
      `${API_URL}/budgets/${budgetId}`,
      budgetData,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE BUDGET ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to update budget"
    );
  }
};

// DELETE BUDGET

export const deleteBudget = async (budgetId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/budgets/${budgetId}`,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error(
      "DELETE BUDGET ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to delete budget"
    );
  }
};
