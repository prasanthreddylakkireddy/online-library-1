/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Login & Registration Script (login.js)
   Real Frontend Authentication with localStorage
   Beginner-friendly vanilla JavaScript
=================================================== */

// Wait for the DOM HTML to fully load before running JavaScript
document.addEventListener("DOMContentLoaded", function () {

    // ===================================================
    // 1. INITIALIZE DEMO ACCOUNTS (IF NOT ALREADY IN STORAGE)
    // ===================================================
    // Seed initial demo accounts only if "users" does not exist yet.
    // Credentials are not displayed on the screen.
    if (!localStorage.getItem("users")) {
        var initialUsers = [
            {
                id: 1,
                fullName: "Student User",
                studentId: "STU-2026-8841",
                email: "student@gmail.com",
                password: "1234",
                role: "user",
                membership: "Active"
            },
            {
                id: 2,
                fullName: "Library Administrator",
                studentId: "ADMIN001",
                email: "admin@gmail.com",
                password: "admin123",
                role: "admin",
                membership: "Active"
            }
        ];
        // Save user array to localStorage
        localStorage.setItem("users", JSON.stringify(initialUsers));
    }

    // ===================================================
    // 2. GET REFERENCES TO HTML ELEMENTS
    // ===================================================
    // Views
    var loginView = document.getElementById("loginView");
    var registerView = document.getElementById("registerView");

    // View toggle buttons
    var showRegisterBtn = document.getElementById("showRegisterBtn");
    var showLoginBtn = document.getElementById("showLoginBtn");

    // Login Form Elements
    var studentRoleBtn = document.getElementById("studentRoleBtn");
    var adminRoleBtn = document.getElementById("adminRoleBtn");
    var loginForm = document.getElementById("loginForm");
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var showPasswordCheckbox = document.getElementById("showPassword");
    var successBox = document.getElementById("successBox");
    var errorBox = document.getElementById("errorBox");

    // Registration Form Elements
    var registerForm = document.getElementById("registerForm");
    var regFullName = document.getElementById("regFullName");
    var regStudentId = document.getElementById("regStudentId");
    var regEmail = document.getElementById("regEmail");
    var regPassword = document.getElementById("regPassword");
    var regConfirmPassword = document.getElementById("regConfirmPassword");
    var regRoleStudentBtn = document.getElementById("regRoleStudentBtn");
    var regRoleAdminBtn = document.getElementById("regRoleAdminBtn");
    var adminCodeGroup = document.getElementById("adminCodeGroup");
    var regAdminCode = document.getElementById("regAdminCode");
    var registerSubmitBtn = document.getElementById("registerSubmitBtn");
    var regSuccessBox = document.getElementById("regSuccessBox");
    var regErrorBox = document.getElementById("regErrorBox");

    // Secret code required to create an administrator account
    // NOTE: This is a frontend-only college project demonstration.
    // In a real application, administrator authorization must be verified on a backend server.
    var ADMIN_ACCESS_CODE = "LIBRARY@2026";

    // State Variables
    var loginSelectedRole = "user"; // "user" or "admin"
    var regSelectedRole = "user";   // "user" or "admin"

    // ===================================================
    // 3. HELPER FUNCTIONS FOR NOTIFICATIONS
    // ===================================================
    function showLoginSuccess(message) {
        errorBox.textContent = "";
        errorBox.style.display = "none";
        successBox.textContent = message;
        successBox.style.display = "block";
    }

    function showLoginError(message) {
        successBox.textContent = "";
        successBox.style.display = "none";
        errorBox.textContent = message;
        errorBox.style.display = "block";
    }

    function clearLoginMessages() {
        errorBox.textContent = "";
        errorBox.style.display = "none";
        successBox.textContent = "";
        successBox.style.display = "none";
    }

    function showRegSuccess(message) {
        regErrorBox.textContent = "";
        regErrorBox.style.display = "none";
        regSuccessBox.textContent = message;
        regSuccessBox.style.display = "block";
    }

    function showRegError(message) {
        regSuccessBox.textContent = "";
        regSuccessBox.style.display = "none";
        regErrorBox.textContent = message;
        regErrorBox.style.display = "block";
    }

    function clearRegMessages() {
        regErrorBox.textContent = "";
        regErrorBox.style.display = "none";
        regSuccessBox.textContent = "";
        regSuccessBox.style.display = "none";
    }

    // ===================================================
    // 4. SWITCH BETWEEN LOGIN AND REGISTRATION VIEWS
    // ===================================================
    // Switch to Registration View
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", function () {
            clearLoginMessages();
            clearRegMessages();

            // Default to Student registration mode
            regSelectedRole = "user";
            if (regRoleStudentBtn) regRoleStudentBtn.classList.add("active");
            if (regRoleAdminBtn) regRoleAdminBtn.classList.remove("active");
            if (adminCodeGroup) adminCodeGroup.style.display = "none";
            if (regAdminCode) regAdminCode.value = "";
            if (registerSubmitBtn) registerSubmitBtn.textContent = "CREATE ACCOUNT";

            loginView.style.display = "none";
            registerView.style.display = "block";
        });
    }

    // Switch back to Login View
    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", function () {
            clearLoginMessages();
            clearRegMessages();

            if (adminCodeGroup) adminCodeGroup.style.display = "none";
            if (regAdminCode) regAdminCode.value = "";
            if (registerSubmitBtn) registerSubmitBtn.textContent = "CREATE ACCOUNT";

            registerView.style.display = "none";
            loginView.style.display = "block";
        });
    }

    // ===================================================
    // 5. ROLE SELECTION IN LOGIN FORM
    // ===================================================
    if (studentRoleBtn) {
        studentRoleBtn.addEventListener("click", function () {
            loginSelectedRole = "user";
            studentRoleBtn.classList.add("active");
            adminRoleBtn.classList.remove("active");
            emailInput.placeholder = "e.g., student@gmail.com";
            clearLoginMessages();
        });
    }

    if (adminRoleBtn) {
        adminRoleBtn.addEventListener("click", function () {
            loginSelectedRole = "admin";
            adminRoleBtn.classList.add("active");
            studentRoleBtn.classList.remove("active");
            emailInput.placeholder = "e.g., admin@gmail.com";
            clearLoginMessages();
        });
    }

    // ===================================================
    // 6. ROLE SELECTION IN REGISTRATION FORM
    // ===================================================
    // Student / User selection
    if (regRoleStudentBtn) {
        regRoleStudentBtn.addEventListener("click", function () {
            regSelectedRole = "user";
            regRoleStudentBtn.classList.add("active");
            regRoleAdminBtn.classList.remove("active");

            // Hide admin access code and update button text
            if (adminCodeGroup) adminCodeGroup.style.display = "none";
            if (regAdminCode) regAdminCode.value = "";
            if (registerSubmitBtn) registerSubmitBtn.textContent = "CREATE ACCOUNT";

            clearRegMessages();
        });
    }

    // Administrator selection
    if (regRoleAdminBtn) {
        regRoleAdminBtn.addEventListener("click", function () {
            regSelectedRole = "admin";
            regRoleAdminBtn.classList.add("active");
            regRoleStudentBtn.classList.remove("active");

            // Show admin access code and update button text
            if (adminCodeGroup) adminCodeGroup.style.display = "block";
            if (registerSubmitBtn) registerSubmitBtn.textContent = "CREATE ADMIN ACCOUNT";

            clearRegMessages();
        });
    }

    // ===================================================
    // 7. TOGGLE PASSWORD VISIBILITY
    // ===================================================
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener("change", function () {
            if (showPasswordCheckbox.checked) {
                passwordInput.type = "text";
            } else {
                passwordInput.type = "password";
            }
        });
    }

    // ===================================================
    // 8. REGISTRATION FORM SUBMISSION
    // ===================================================
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            // Prevent standard form submission reload
            event.preventDefault();
            clearRegMessages();

            var fullName = regFullName.value.trim();
            var studentId = regStudentId.value.trim();
            var email = regEmail.value.trim();
            var password = regPassword.value.trim();
            var confirmPassword = regConfirmPassword.value.trim();

            // 1. Validate Full Name
            if (fullName === "") {
                showRegError("Please enter your full name.");
                return;
            }

            // 2. Validate Student ID
            if (studentId === "") {
                showRegError("Please enter your Student ID.");
                return;
            }

            // 3. Validate Email
            if (email === "") {
                showRegError("Please enter your email address.");
                return;
            }

            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showRegError("Please enter a valid email address.");
                return;
            }

            // 4. Validate Password length (minimum 4 characters)
            if (password === "") {
                showRegError("Please create a password.");
                return;
            }

            if (password.length < 4) {
                showRegError("Password must be at least 4 characters long.");
                return;
            }

            // 5. Validate Password confirmation match
            if (password !== confirmPassword) {
                showRegError("Passwords do not match.");
                return;
            }

            // Get registered users from localStorage
            var users = JSON.parse(localStorage.getItem("users")) || [];

            // 6. Check if email already exists
            for (var i = 0; i < users.length; i++) {
                if (users[i].email.toLowerCase() === email.toLowerCase()) {
                    showRegError("An account with this email already exists.");
                    return;
                }
            }

            // 7. Check if Student ID already exists
            for (var j = 0; j < users.length; j++) {
                if (users[j].studentId.toLowerCase() === studentId.toLowerCase()) {
                    showRegError("This Student ID is already registered.");
                    return;
                }
            }

            // 8. Administrator Access Code validation (ONLY for Administrator role)
            if (regSelectedRole === "admin") {
                var adminCode = regAdminCode ? regAdminCode.value.trim() : "";
                if (adminCode === "") {
                    showRegError("Administrator access code is required.");
                    return;
                }
                if (adminCode !== ADMIN_ACCESS_CODE) {
                    showRegError("Invalid administrator access code.");
                    return;
                }
            }

            // Generate simple new user ID
            var newId = 1;
            for (var k = 0; k < users.length; k++) {
                if (users[k].id >= newId) {
                    newId = users[k].id + 1;
                }
            }

            // Create new user object
            var newUser = {
                id: newId,
                fullName: fullName,
                studentId: studentId,
                email: email,
                password: password,
                role: regSelectedRole, // "user" or "admin"
                membership: "Active"
            };

            // Save user to localStorage
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            // Show appropriate success message
            if (regSelectedRole === "admin") {
                showRegSuccess("Administrator account created successfully. You can now log in.");
            } else {
                showRegSuccess("Account created successfully. You can now log in.");
            }

            // Reset registration form and revert to default Student view
            registerForm.reset();
            regRoleStudentBtn.classList.add("active");
            regRoleAdminBtn.classList.remove("active");
            if (adminCodeGroup) adminCodeGroup.style.display = "none";
            if (registerSubmitBtn) registerSubmitBtn.textContent = "CREATE ACCOUNT";
            regSelectedRole = "user";

            // Allow returning to login form after short delay
            setTimeout(function () {
                registerView.style.display = "none";
                loginView.style.display = "block";
                clearRegMessages();

                // Pre-fill email and align role button for easy login
                emailInput.value = newUser.email;
                passwordInput.value = "";
                if (newUser.role === "admin") {
                    loginSelectedRole = "admin";
                    adminRoleBtn.classList.add("active");
                    studentRoleBtn.classList.remove("active");
                } else {
                    loginSelectedRole = "user";
                    studentRoleBtn.classList.add("active");
                    adminRoleBtn.classList.remove("active");
                }
            }, 1200);
        });
    }

    // ===================================================
    // 9. LOGIN FORM SUBMISSION
    // ===================================================
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            // Prevent default form submission reload
            event.preventDefault();
            clearLoginMessages();

            var email = emailInput.value.trim();
            var password = passwordInput.value.trim();

            // Validate non-empty fields
            if (email === "" || password === "") {
                showLoginError("Please enter your email and password.");
                return;
            }

            // Get registered users from localStorage
            var users = JSON.parse(localStorage.getItem("users")) || [];

            // Find matching user by email and password
            var foundUser = null;
            for (var i = 0; i < users.length; i++) {
                if (
                    users[i].email.toLowerCase() === email.toLowerCase() &&
                    users[i].password === password
                ) {
                    foundUser = users[i];
                    break;
                }
            }

            // If no match found
            if (!foundUser) {
                showLoginError("Invalid email or password.");
                return;
            }

            // Role selection reminder if user clicked the opposite role button
            if (foundUser.role !== loginSelectedRole) {
                if (foundUser.role === "admin") {
                    showLoginError("This account is an Administrator. Please select 'Admin Login'.");
                    return;
                } else {
                    showLoginError("This account is a Student account. Please select 'Student Login'.");
                    return;
                }
            }

            // Save session information to localStorage
            localStorage.setItem("loggedInUserId", foundUser.id);
            localStorage.setItem("userRole", foundUser.role);
            localStorage.setItem("userEmail", foundUser.email);
            localStorage.setItem("studentName", foundUser.fullName);
            localStorage.setItem("studentId", foundUser.studentId);

            // Display success message and redirect based on role
            if (foundUser.role === "admin") {
                showLoginSuccess("✓ Login successful! Redirecting to admin dashboard...");
                setTimeout(function () {
                    window.location.href = "admin.html";
                }, 800);
            } else {
                showLoginSuccess("✓ Login successful! Redirecting to your dashboard...");
                setTimeout(function () {
                    window.location.href = "user.html";
                }, 800);
            }
        });
    }

});
