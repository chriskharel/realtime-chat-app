import { createContext, useState, useMemo, useCallback } from "react";
import { loginRequest, registerRequest } from "../api/authApi.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      return JSON.parse(savedUser);
    }
    if (!token) {
      localStorage.removeItem("user");
    }
    return null;
  });

  const persistSession = useCallback((userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await loginRequest({ email, password });
      persistSession(res.data.user, res.data.token);
      return res.data.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      const res = await registerRequest({ name, email, password });
      persistSession(res.data.user, res.data.token);
      return res.data.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
