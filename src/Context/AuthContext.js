import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const authState = localStorage.getItem("isAuthenticated");
  //   if (authState === "true") {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  // const login = () => {
  //   setIsAuthenticated(true);
  //   localStorage.setItem("isAuthenticated", "true");
  // };

  // const logout = () => {
  //   setIsAuthenticated(false);
  //   localStorage.removeItem("isAuthenticated");
  //   window.location.href = "/login";
  // };

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
