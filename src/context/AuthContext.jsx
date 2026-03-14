// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const user = {
      id: Date.now(),
      email: userData.email,
      name: userData.email.split("@")[0],
    };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    return { success: true };
  };

  const signup = (userData) => {
    const user = {
      id: Date.now(),
      email: userData.email,
      name: userData.name,
    };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
