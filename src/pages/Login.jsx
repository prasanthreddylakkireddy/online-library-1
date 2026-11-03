/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Login & Registration Page (Login.jsx)
   Pixel-identical migration of index.html & login.js
=================================================== */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/images/logo.png";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, userRole, login, register } = useAuth();

  // Active view: "login" or "register"
  const [currentView, setCurrentView] = useState("login");

  // Login form state
  const [loginRole, setLoginRole] = useState("user"); // "user" or "admin"
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState("");
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  // Registration form state
  const [regFullName, setRegFullName] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState("user"); // "user" or "admin"
  const [regAdminCode, setRegAdminCode] = useState("");
  const [regSuccessMsg, setRegSuccessMsg] = useState("");
  const [regErrorMsg, setRegErrorMsg] = useState("");

  // If already logged in, auto-redirect
  useEffect(() => {
    if (userRole === "admin") {
      navigate("/admin", { replace: true });
    } else if (userRole === "user") {
      navigate("/student", { replace: true });
    }
  }, [userRole, navigate]);

  // Handlers for switching views
  const handleShowRegister = () => {
    setLoginSuccessMsg("");
    setLoginErrorMsg("");
    setRegSuccessMsg("");
    setRegErrorMsg("");
    setRegRole("user");
    setRegAdminCode("");
    setCurrentView("register");
  };

  const handleShowLogin = () => {
    setLoginSuccessMsg("");
    setLoginErrorMsg("");
    setRegSuccessMsg("");
    setRegErrorMsg("");
    setRegAdminCode("");
    setCurrentView("login");
  };

  // Role toggle for Login
  const handleSelectLoginRole = (role) => {
    setLoginRole(role);
    setLoginSuccessMsg("");
    setLoginErrorMsg("");
  };

  // Role toggle for Registration
  const handleSelectRegRole = (role) => {
    setRegRole(role);
    setRegSuccessMsg("");
    setRegErrorMsg("");
  };

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginSuccessMsg("");
    setLoginErrorMsg("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginErrorMsg("Please enter your email and password.");
      return;
    }

    const result = login(loginEmail, loginPassword, loginRole);

    if (!result.success) {
      setLoginErrorMsg(result.error);
      return;
    }

    if (result.user.role === "admin") {
      setLoginSuccessMsg("✓ Login successful! Redirecting to admin dashboard...");
      setTimeout(() => {
        navigate("/admin");
      }, 800);
    } else {
      setLoginSuccessMsg("✓ Login successful! Redirecting to your dashboard...");
      setTimeout(() => {
        navigate("/student");
      }, 800);
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegSuccessMsg("");
    setRegErrorMsg("");

    const result = register({
      fullName: regFullName,
      studentId: regStudentId,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      role: regRole,
      adminCode: regAdminCode
    });

    if (!result.success) {
      setRegErrorMsg(result.error);
      return;
    }

    setRegSuccessMsg(result.message);

    // Reset fields
    const registeredEmail = regEmail;
    const registeredRole = regRole;

    setRegFullName("");
    setRegStudentId("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirmPassword("");
    setRegAdminCode("");
    setRegRole("user");

    // Transition back to login view after short delay, pre-filling email and role
    setTimeout(() => {
      setCurrentView("login");
      setRegSuccessMsg("");
      setRegErrorMsg("");
      setLoginEmail(registeredEmail);
      setLoginPassword("");
      setLoginRole(registeredRole);
    }, 1200);
  };

  return (
    <main className="login-page-wrapper">
      <div className="login-container">
        {/* LEFT SIDE: Library Branding Area */}
        <section className="branding-section" aria-label="Library Information">
          <div className="brand-badge">
            <img
              src={logoImg}
              alt="Library Emblem"
              width="22"
              height="22"
              style={{ verticalAlign: "middle" }}
            />
            <span>ACADEMIC PORTAL</span>
          </div>

          <h1 className="branding-title">
            ONLINE
            <br />
            <span className="highlight">LIBRARY</span>
            <br />
            MANAGEMENT
            <br />
            SYSTEM
          </h1>

          <p className="branding-subtitle">
            Smart and simple library management for students and administrators.
          </p>

          <div className="academic-features">
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Catalog access &amp; digital resource searching</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Quick issue tracking &amp; automated reservation system</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Role-based portal for students and faculty administrators</span>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE: Login Card */}
        <section className="login-card-section" aria-label="Sign In">
          <div className="login-card">
            {/* ==============================================
                 LOGIN VIEW
            =============================================== */}
            {currentView === "login" && (
              <div id="loginView">
                <div className="login-header">
                  <h2>Welcome Back</h2>
                  <p>Sign in to access the library system</p>
                </div>

                {/* Success and Error Notification Boxes */}
                {loginSuccessMsg && (
                  <div
                    id="successBox"
                    className="success-box"
                    role="status"
                    style={{ display: "block" }}
                  >
                    {loginSuccessMsg}
                  </div>
                )}
                {loginErrorMsg && (
                  <div
                    id="errorBox"
                    className="error-box"
                    role="alert"
                    style={{ display: "block" }}
                  >
                    {loginErrorMsg}
                  </div>
                )}

                {/* Role Selection Buttons (Side-by-Side) */}
                <div
                  className="role-selector"
                  role="group"
                  aria-label="Role Selection"
                >
                  <button
                    type="button"
                    id="studentRoleBtn"
                    className={`role-btn ${loginRole === "user" ? "active" : ""}`}
                    onClick={() => handleSelectLoginRole("user")}
                  >
                    Student Login
                  </button>
                  <button
                    type="button"
                    id="adminRoleBtn"
                    className={`role-btn ${loginRole === "admin" ? "active" : ""}`}
                    onClick={() => handleSelectLoginRole("admin")}
                  >
                    Admin Login
                  </button>
                </div>

                {/* Login Form */}
                <form id="loginForm" noValidate onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Institutional Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder={
                        loginRole === "admin"
                          ? "e.g., admin@gmail.com"
                          : "e.g., student@gmail.com"
                      }
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Show/Hide Password Toggle */}
                  <div className="password-toggle-wrapper">
                    <input
                      type="checkbox"
                      id="showPassword"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label htmlFor="showPassword">Show Password</label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="loginBtn"
                    className="btn btn-primary btn-login"
                  >
                    LOGIN
                  </button>
                </form>

                {/* Switch to Registration View */}
                <div className="auth-switch-text">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    id="showRegisterBtn"
                    className="link-btn"
                    onClick={handleShowRegister}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================
                 REGISTRATION VIEW
            =============================================== */}
            {currentView === "register" && (
              <div id="registerView">
                <div className="login-header">
                  <h2>Create Account</h2>
                  <p>Register for institutional library system access</p>
                </div>

                {/* Registration Success and Error Alerts */}
                {regSuccessMsg && (
                  <div
                    id="regSuccessBox"
                    className="success-box"
                    role="status"
                    style={{ display: "block" }}
                  >
                    {regSuccessMsg}
                  </div>
                )}
                {regErrorMsg && (
                  <div
                    id="regErrorBox"
                    className="error-box"
                    role="alert"
                    style={{ display: "block" }}
                  >
                    {regErrorMsg}
                  </div>
                )}

                <form
                  id="registerForm"
                  noValidate
                  onSubmit={handleRegisterSubmit}
                >
                  <div className="form-group">
                    <label htmlFor="regFullName">Full Name</label>
                    <input
                      type="text"
                      id="regFullName"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="regStudentId">Student / Staff ID</label>
                    <input
                      type="text"
                      id="regStudentId"
                      className="form-control"
                      placeholder="e.g. 2500080220 or STU-2026-1042"
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="regEmail">Institutional Email</label>
                    <input
                      type="email"
                      id="regEmail"
                      className="form-control"
                      placeholder="e.g., student@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="regPassword">Password</label>
                    <input
                      type="password"
                      id="regPassword"
                      className="form-control"
                      placeholder="Minimum 4 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="regConfirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="regConfirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Account Type / Role Selection */}
                  <div className="form-group">
                    <label>Account Type</label>
                    <div
                      className="role-selector"
                      role="group"
                      aria-label="Account Type Selection"
                      style={{ marginBottom: 0 }}
                    >
                      <button
                        type="button"
                        id="regRoleStudentBtn"
                        className={`role-btn ${regRole === "user" ? "active" : ""}`}
                        onClick={() => handleSelectRegRole("user")}
                      >
                        Student / User
                      </button>
                      <button
                        type="button"
                        id="regRoleAdminBtn"
                        className={`role-btn ${regRole === "admin" ? "active" : ""}`}
                        onClick={() => handleSelectRegRole("admin")}
                      >
                        Administrator
                      </button>
                    </div>
                  </div>

                  {/* Administrator Access Code (Only visible when Administrator is selected) */}
                  {regRole === "admin" && (
                    <div
                      className="form-group"
                      id="adminCodeGroup"
                      style={{ marginTop: "16px" }}
                    >
                      <label htmlFor="regAdminCode">ADMIN ACCESS CODE</label>
                      <input
                        type="password"
                        id="regAdminCode"
                        className="form-control"
                        placeholder="Enter administrator access code"
                        autoComplete="off"
                        value={regAdminCode}
                        onChange={(e) => setRegAdminCode(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    id="registerSubmitBtn"
                    className="btn btn-primary btn-login"
                    style={{ marginTop: "18px" }}
                  >
                    {regRole === "admin"
                      ? "CREATE ADMIN ACCOUNT"
                      : "CREATE ACCOUNT"}
                  </button>
                </form>

                {/* Switch to Login View */}
                <div className="auth-switch-text">
                  Already have an account?{" "}
                  <button
                    type="button"
                    id="showLoginBtn"
                    className="link-btn"
                    onClick={handleShowLogin}
                  >
                    Login
                  </button>
                </div>
              </div>
            )}

            <div className="login-card-footer">
              <span>Central University Academic Library System &bull; Portal Access</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
