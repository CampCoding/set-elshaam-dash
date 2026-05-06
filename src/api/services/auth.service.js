import api from "../axios";
import { ADMIN_AUTH_ENDPOINTS } from "../endpoints";
import { setToken, setUser, clearAuth } from "../../utils/token";

export const authService = {

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


      return {
        success: false,
        message: message || "Login failed",
      };
    } catch (error) {

      console.error("Login API Error:", error);


      if (!error.response) {
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      }


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


  logout: () => {
    clearAuth();
  },
};
