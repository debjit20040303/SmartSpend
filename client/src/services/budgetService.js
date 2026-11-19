
const API_URL = "https://smartspend-yyhe.onrender.com/api/budgets";

// =========================
// GET BUDGETS
// =========================

export const getBudgets = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get budgets"
    );
  }

  return data;
};

// =========================
// SAVE BUDGET
// =========================

export const saveBudget = async (budgetData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(budgetData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to save budget"
    );
  }

  return data;
};

// =========================
// DELETE BUDGET
// =========================

export const deleteBudget = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete budget"
    );
  }

  return data;
};
