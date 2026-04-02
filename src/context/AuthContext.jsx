import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/Baseurl";
import { setToken, setUser as setStoredUser, getToken, getUser, clearAuth } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setAuthToken] = useState(null);

  // Initialize from storage
  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setAuthToken(storedToken);
    }
    setLoading(false);
  }, []);

  // ============ LOGIN ============
  const login = async (email, password, persist = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.data && result.data.token) {
        const adminData = result.data.admin;
        const tokenValue = result.data.token;

        const userData = {
          id: adminData.id,
          username: adminData.username,
          email: adminData.email,
          full_name: adminData.full_name,
          role: adminData.role,
          status: adminData.status,
          token: tokenValue,
        };

        setUser(userData);
        setAuthToken(tokenValue);

        // Store using utility
        setStoredUser(userData);
        setToken(tokenValue);

        return {
          success: true,
          user: userData,
        };
      } else {
        return {
          success: false,
          error: result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "فشل الاتصال بالخادم. يرجى التأكد من اتصال الإنترنت.",
      };
    }
  };

  // ============ LOGOUT ============
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/admin/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all state
      setUser(null);
      setAuthToken(null);
      clearAuth();
    }
  };

  // ============ VERIFY TOKEN ============
  const verifyToken = async () => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/auth/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};