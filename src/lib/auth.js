export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
};

export const isBuyer = async () => {
  const user = await getCurrentUser();
  return user && user.role === "buyer";
};

// Helper to get API URL
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export const loginUser = async (email, password) => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    return data.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (
  username,
  email,
  password,
  password_confirmation
) => {
  try {
    const enteredData = {
      username,
      email,
      password,
      password_confirmation,
    };
    console.log(enteredData);
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enteredData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    return data.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) return;

    const API_URL = getApiUrl();
    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    localStorage.removeItem("token");
  } catch (error) {
    console.error("Logout error:", error);

    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      localStorage.removeItem("token");
      throw new Error(data.message || "Failed to get user data");
    }

    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
