import api from "../axios";
import { ADMIN_AUTH_ENDPOINTS } from "../endpoints";
import { setToken, setUser, clearAuth } from "../../utils/token";

export const authService = {
  // ============ LOGIN ============
  login: async (email, password) => {
    try {
      const response = await api.post(ADMIN_AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { data, message } = response.data;

      if (data && data.token) {
        setToken(data.token);
        setUser(data.admin || data.user || data);

        return {
          success: true,
          user: data.admin || data.user || data,
          message: message || "Login successful",
        };
      }

      // API returned but not success
      return {
        success: false,
        message: message || "Login failed",
      };
    } catch (error) {
      // ✅ Handle all error cases
      console.error("Login API Error:", error);

      // Network error
      if (!error.response) {
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      }

      // API error response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password";

      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  // ============ LOGOUT ============
  logout: () => {
    clearAuth();
  },
};
