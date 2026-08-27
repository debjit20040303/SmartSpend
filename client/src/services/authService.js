const API_URL = "http://localhost:5000/api/auth";

// =========================
// REGISTER
// =========================
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};


// =========================
// LOGIN
// =========================
export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};


// =========================
// UPDATE FINANCIAL PROFILE
// =========================
export const updateFinancialProfile = async (
  salary,
  monthlyBudget
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/profile/financial",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salary: Number(salary),
        monthlyBudget: Number(monthlyBudget),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update financial profile"
    );
  }

  return data;
};