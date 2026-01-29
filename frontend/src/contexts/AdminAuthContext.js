import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_CONFIG from "../config/api";

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const adminInfo = localStorage.getItem("adminInfo");
      
      if (token && adminInfo) {
        // Verify token with backend
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH_ADMIN_VERIFY), {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setAdmin(JSON.parse(adminInfo));
        } else {
          // Token invalid, clear storage
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminInfo");
          setAdmin(null);
        }
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      // Clear invalid tokens
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH_ADMIN_LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        setAdmin(data.admin);
        toast.success("Login successful!");
        return { success: true };
      } else {
        toast.error(data.message || "Invalid credentials");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return { success: false, message: "Network error" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH_ADMIN_REGISTER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Registration successful! Please login.");
        return { success: true };
      } else {
        toast.error(data.message || "Registration failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setAdmin(null);
    toast.success("Logged out successfully");
  };

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};