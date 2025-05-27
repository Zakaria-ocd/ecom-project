// Authentication service to handle user login, signup, and session management

// Check if user is logged in by verifying token in localStorage
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
};

// Check if user is a buyer
export const isBuyer = async () => {
  const user = await getCurrentUser();
  return user && user.role === "buyer";
};

// Login user and store token in localStorage
export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:8000/api/login", {
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

    // Store auth token in localStorage
    localStorage.setItem("token", data.token);
    return data.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register new user
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
    const response = await fetch("http://localhost:8000/api/register", {
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

    // Automatically log in the user after registration
    localStorage.setItem("token", data.token);
    return data.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Logout user by removing token from localStorage and calling the API
export const logoutUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) return;

    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    localStorage.removeItem("token");
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove the token from localStorage even if the API call fails
    localStorage.removeItem("token");
  }
};

// Get the authentication token
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Get the current user from the API using the stored token
export const getCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch("http://localhost:8000/api/user", {
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
