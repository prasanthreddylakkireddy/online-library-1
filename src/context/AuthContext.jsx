/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Authentication Context (AuthContext.jsx)
=================================================== */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initStorage,
  getUsers,
  saveUsers,
  getLoggedInUser,
  ADMIN_ACCESS_CODE
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [loading, setLoading] = useState(true);

  // Initialize storage once on boot
  useEffect(() => {
    initStorage();
    const user = getLoggedInUser();
    const role = localStorage.getItem("userRole");
    if (user && role) {
      setCurrentUser(user);
      setUserRole(role);
    } else {
      setCurrentUser(null);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  const refreshUser = () => {
    const user = getLoggedInUser();
    const role = localStorage.getItem("userRole");
    setCurrentUser(user);
    setUserRole(role);
  };

  const login = (email, password, selectedRole) => {
    const users = getUsers();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail.toLowerCase() &&
        u.password === cleanPassword
    );

    if (!foundUser) {
      return { success: false, error: "Invalid email or password." };
    }

    if (foundUser.role !== selectedRole) {
      if (foundUser.role === "admin") {
        return {
          success: false,
          error: "This account is an Administrator. Please select 'Admin Login'."
        };
      } else {
        return {
          success: false,
          error: "This account is a Student account. Please select 'Student Login'."
        };
      }
    }

    localStorage.setItem("loggedInUserId", foundUser.id);
    localStorage.setItem("userRole", foundUser.role);
    localStorage.setItem("userEmail", foundUser.email);
    localStorage.setItem("studentName", foundUser.fullName);
    localStorage.setItem("studentId", foundUser.studentId);

    setCurrentUser(foundUser);
    setUserRole(foundUser.role);

    return { success: true, user: foundUser };
  };

  const register = ({ fullName, studentId, email, password, confirmPassword, role, adminCode }) => {
    const name = fullName.trim();
    const sId = studentId.trim();
    const mail = email.trim();
    const pass = password.trim();
    const cPass = confirmPassword.trim();

    if (!name) return { success: false, error: "Please enter your full name." };
    if (!sId) return { success: false, error: "Please enter your Student ID." };
    if (!mail) return { success: false, error: "Please enter your email address." };
    if (mail.indexOf("@") === -1 || mail.indexOf(".") === -1) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!pass) return { success: false, error: "Please create a password." };
    if (pass.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }
    if (pass !== cPass) {
      return { success: false, error: "Passwords do not match." };
    }

    const users = getUsers();

    if (users.some((u) => u.email.toLowerCase() === mail.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }

    if (users.some((u) => u.studentId.toLowerCase() === sId.toLowerCase())) {
      return { success: false, error: "This Student ID is already registered." };
    }

    if (role === "admin") {
      const code = (adminCode || "").trim();
      if (!code) {
        return { success: false, error: "Administrator access code is required." };
      }
      if (code !== ADMIN_ACCESS_CODE) {
        return { success: false, error: "Invalid administrator access code." };
      }
    }

    let newId = 1;
    users.forEach((u) => {
      if (u.id >= newId) newId = u.id + 1;
    });

    const newUser = {
      id: newId,
      fullName: name,
      studentId: sId,
      email: mail,
      password: pass,
      role: role,
      membership: "Active"
    };

    users.push(newUser);
    saveUsers(users);

    return {
      success: true,
      user: newUser,
      message:
        role === "admin"
          ? "Administrator account created successfully. You can now log in."
          : "Account created successfully. You can now log in."
    };
  };

  const logout = () => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentId");

    setCurrentUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
