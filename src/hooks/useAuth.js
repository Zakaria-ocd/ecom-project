import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  authUser,
  logoutUser as logoutUserAction,
} from "../features/user/userSlice";
import {
  isAuthenticated as checkAuthenticated,
  loginUser,
  registerUser,
  logoutUser as logoutUserService,
  getCurrentUser,
} from "../lib/auth";
import { mergeCartsAfterLogin } from "../lib/cart";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthState, setIsAuthState] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      setLoading(true);
      try {
        const isAuth = checkAuthenticated();
        setIsAuthState(isAuth);
        if (isAuth) {
          const userData = await getCurrentUser();
          if (userData) {
            dispatch(authUser(userData));
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [dispatch]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(email, password);
      dispatch(authUser(userData));
      setIsAuthState(true);

      // Merge localStorage cart with server cart after login
      await mergeCartsAfterLogin();

      router.push("/");
      return userData;
    } catch (error) {
      setError(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password, password_confirmation) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await registerUser(
        username,
        email,
        password,
        password_confirmation
      );
      dispatch(authUser(userData));
      setIsAuthState(true);

      // No need to merge carts for new users

      router.push("/");
      return userData;
    } catch (error) {
      setError(error.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await logoutUserService();
    dispatch(logoutUserAction());
    setIsAuthState(false);

    // Instead of just navigating, refresh the page to ensure a clean state
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  return {
    isAuthenticated: isAuthState,
    loading,
    error,
    login,
    register,
    logout,
  };
}
