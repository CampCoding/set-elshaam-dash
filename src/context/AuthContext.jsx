import { createContext, useState, useEffect } from "react";
import { authService } from "../api/services/auth.service";
import { getUser, getToken, clearAuth } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const storedUser = getUser();

      if (token && storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ============ LOGIN ============
  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      setUser(result.user);
      return {
        success: true,
        user: result.user,
        role: "doctor",
      };
    }

    return {
      success: false,
      error: result.message,
    };
  };

  // ============ LOGOUT ============
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // ============ COMPUTED VALUES ============
  const isAuthenticated = !!user;
  const isAdmin = false; // This API is for doctors only
  const isDoctor = !!user;

  // ============ DOCTOR TYPE HELPERS ============
  const getDoctorType = () => user?.doctor_type || null;
  const isPrivateDoctor = user?.doctor_type === "private";
  const isGroupDoctor = user?.doctor_type === "group";
  const isSessionsDoctor = user?.doctor_type === "sessions";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isDoctor,
        login,
        logout,
        // Doctor type helpers
        getDoctorType,
        isPrivateDoctor,
        isGroupDoctor,
        isSessionsDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
