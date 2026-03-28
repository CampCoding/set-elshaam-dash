import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// ✅ Sample Admin للتجربة
const ADMIN_USER = {
  email: "admin@setsham.com",
  password: "123456",
  full_name: "مدير النظام",
  role: "admin",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("setsham_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("setsham_user");
      }
    }
    setLoading(false);
  }, []);

  // ============ LOGIN ============
  const login = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
          const userData = {
            email: ADMIN_USER.email,
            full_name: ADMIN_USER.full_name,
            role: ADMIN_USER.role,
          };

          setUser(userData);
          localStorage.setItem("setsham_user", JSON.stringify(userData));

          resolve({
            success: true,
            user: userData,
          });
        } else {
          resolve({
            success: false,
            error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          });
        }
      }, 1000);
    });
  };

  // ============ LOGOUT ============
  const logout = () => {
    setUser(null);
    localStorage.removeItem("setsham_user");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
