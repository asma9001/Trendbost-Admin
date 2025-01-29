import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter, Naviagte } from "react-router-dom";
import Home from "./pages/Home";
import UsersDetail from "./pages/UserDetail/UsersDetail";
import PackageManagement from "./pages/PackageManagement";
import ProfileSettings from "./pages/ProfileSettings";
import OrdersDetail from "./pages/OrdersDetail/OrdersDetail";
import FinancialOverview from "./pages/FinancialOverview";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import UserDetail from "./pages/UserDetail/UserPages/UserDetail";
import TransactionDetail from "./pages/UserDetail/UserPages/TransactionDetail";
import OrderDetail from "./pages/OrdersDetail/OrderDetail/OrderDetail";
import { jwtDecode } from "jwt-decode";
function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("userId"));
  const [isToken, setIsToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLogin(false);
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setIsLogin(false);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        } else {
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsLogin(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    }

    const sessionTimeout = setTimeout(() => {
      localStorage.clear();
      setIsLogin(false);
      window.location.href = "/login";
    }, 3600000);

    return () => clearTimeout(sessionTimeout);
  }, [isToken]);
  return (
    <BrowserRouter>
      <RoutesWrapper isLogin={isLogin} />
    </BrowserRouter>
  );
}

function RoutesWrapper({ isLogin }) {
  return isLogin ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users-detail" element={<UsersDetail />} />
      <Route path="/users-details/users/:id" element={<UserDetail />} />
      <Route
        path="/users-detail/user/:userId/transaction/:transactionId"
        element={<TransactionDetail />}
      />
      <Route path="/orders-detail" element={<OrdersDetail />} />
      <Route path="/order-details/:id" element={<OrderDetail />} />
      <Route path="/package-management" element={<PackageManagement />} />
      <Route path="/financial-overview" element={<FinancialOverview />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  ) : (
    <Login />
  );
}

export default App;
