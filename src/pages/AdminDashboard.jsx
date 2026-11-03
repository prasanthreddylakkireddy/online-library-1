/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Admin Dashboard (AdminDashboard.jsx)
   Pixel-identical migration of admin.html & admin.js
=================================================== */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getBooks,
  saveBooks,
  getUsers,
  saveUsers,
  getBorrowedBooks,
  saveBorrowedBooks,
  getReservations,
  saveReservations,
  getHistory,
  saveHistory
} from "../utils/storage";
import { formatDate, isOverdue, getDaysOverdue } from "../utils/helpers";
import logoImg from "../assets/images/logo.png";
import "../styles/admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout, refreshUser } = useAuth();

  // Active section
  const [activeSection, setActiveSection] = useState("dashboard");

  // In-page notification banner
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });
  const notifTimeoutRef = useRef(null);

  const showNotification = (message, type = "success") => {
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    setNotification({ message, type, visible: true });
    notifTimeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  // State data collections
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [history, setHistory] = useState([]);

  // Book filtering state
  const [bookSearch, setBookSearch] = useState("");
  const [bookCategory, setBookCategory] = useState("All Categories");

  // User filtering state
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All Roles");

  // Modals state
  // 1. Add / Edit Book Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null); // null if adding
  const [bookFormData, setBookFormData] = useState({
    title: "",
    author: "",
    category: "Programming",
    isbn: "",
    status: "available"
  });

  // 2. Delete Book Modal
  const [deleteBookModalOpen, setDeleteBookModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // 3. Edit User Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userFormData, setUserFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    role: "user",
    membership: "Active"
  });
  const [userModalError, setUserModalError] = useState("");

  // 4. Delete User Modal
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteUserAlert, setDeleteUserAlert] = useState("");

  // Admin Profile form state
  const [adminProfileName, setAdminProfileName] = useState("");
  const [adminProfileId, setAdminProfileId] = useState("");
  const [adminProfileEmail, setAdminProfileEmail] = useState("");

  const mainContentRef = useRef(null);

  // Reload all storage data into state
  const reloadData = () => {
    setBooks(getBooks());
    setUsers(getUsers());
    setBorrowedBooks(getBorrowedBooks());
    setReservations(getReservations());
    setHistory(getHistory());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Sync admin profile fields
  useEffect(() => {
    const aName = currentUser?.fullName || "Library Administrator";
    const aId = currentUser?.studentId || "ADMIN001";
    const aEmail = currentUser?.email || localStorage.getItem("userEmail") || "admin@gmail.com";
    setAdminProfileName(aName);
    setAdminProfileId(aId);
    setAdminProfileEmail(aEmail);
  }, [currentUser]);

  // Keep body overflow clean for desktop dashboard layout
  useEffect(() => {
    document.body.classList.add("dashboard-active");
    return () => {
      document.body.classList.remove("dashboard-active");
    };
  }, []);

  const handleSwitchSection = (sectionName) => {
    setActiveSection(sectionName);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // ===================================================
  // BOOK CRUD HANDLERS
  // ===================================================
  const handleOpenAddBook = () => {
    setEditingBookId(null);
    setBookFormData({
      title: "",
      author: "",
      category: "Programming",
      isbn: "",
      status: "available"
    });
    setBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setEditingBookId(book.id);
    setBookFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      status: book.status
    });
    setBookModalOpen(true);
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    const title = bookFormData.title.trim();
    const author = bookFormData.author.trim();
    const isbn = bookFormData.isbn.trim();

    if (!title || !author || !isbn) {
      showNotification("Please fill in all required fields.", "warning");
      return;
    }

    const currentBooks = getBooks();

    if (editingBookId === null) {
      // Add new book
      const newBook = {
        id: Date.now(),
        title,
        author,
        category: bookFormData.category,
        isbn,
        status: bookFormData.status
      };
      currentBooks.unshift(newBook);
      saveBooks(currentBooks);
      showNotification("Book added successfully.", "success");
    } else {
      // Edit existing
      const updated = currentBooks.map((b) =>
        b.id === editingBookId
          ? {
              ...b,
              title,
              author,
              category: bookFormData.category,
              isbn,
              status: bookFormData.status
            }
          : b
      );
      saveBooks(updated);
      showNotification("Book updated successfully.", "success");
    }

    setBookModalOpen(false);
    reloadData();
  };

  const handleOpenDeleteBook = (book) => {
    if (book.status === "borrowed") {
      showNotification("This book is currently borrowed and cannot be deleted.", "warning");
      return;
    }
    const currentBorrowed = getBorrowedBooks();
    if (currentBorrowed.some((b) => b.bookId === book.id)) {
      showNotification("This book is currently borrowed and cannot be deleted.", "warning");
      return;
    }
    setBookToDelete(book);
    setDeleteBookModalOpen(true);
  };

  const handleConfirmDeleteBook = () => {
    if (!bookToDelete) return;
    const currentBooks = getBooks().filter((b) => b.id !== bookToDelete.id);
    saveBooks(currentBooks);
    setDeleteBookModalOpen(false);
    setBookToDelete(null);
    showNotification("Book deleted successfully.", "success");
    reloadData();
  };

  // ===================================================
  // USER CRUD HANDLERS
  // ===================================================
  const handleOpenEditUser = (user) => {
    setEditingUserId(user.id);
    setUserFormData({
      fullName: user.fullName || "",
      studentId: user.studentId || "",
      email: user.email || "",
      role: user.role || "user",
      membership: user.membership || "Active"
    });
    setUserModalError("");
    setUserModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setUserModalError("");

    const fullName = userFormData.fullName.trim();
    const studentId = userFormData.studentId.trim();
    const email = userFormData.email.trim();

    if (!fullName || !studentId || !email) {
      setUserModalError("Please fill in all required fields.");
      return;
    }

    const currentUsers = getUsers();

    // Check duplicate email
    if (
      currentUsers.some(
        (u) => u.id !== editingUserId && u.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      setUserModalError("An account with this email already exists.");
      return;
    }

    // Check duplicate studentId
    if (
      currentUsers.some(
        (u) => u.id !== editingUserId && u.studentId.toLowerCase() === studentId.toLowerCase()
      )
    ) {
      setUserModalError("This Student ID is already registered.");
      return;
    }

    const updated = currentUsers.map((u) =>
      u.id === editingUserId
        ? {
            ...u,
            fullName,
            studentId,
            email,
            role: userFormData.role,
            membership: userFormData.membership
          }
        : u
    );

    saveUsers(updated);
    setUserModalOpen(false);
    showNotification("User updated successfully.", "success");
    reloadData();
    refreshUser();
  };

  const handleOpenDeleteUser = (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const loggedInUserEmail = localStorage.getItem("userEmail");

    if (
      (loggedInUserId && String(user.id) === String(loggedInUserId)) ||
      (loggedInUserEmail && user.email.toLowerCase() === loggedInUserEmail.toLowerCase())
    ) {
      showNotification("Your current admin account cannot be deleted.", "warning");
      return;
    }

    setUserToDelete(user);
    setDeleteUserAlert("");
    setDeleteUserModalOpen(true);
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    const currentUsers = getUsers().filter((u) => u.id !== userToDelete.id);
    saveUsers(currentUsers);
    setDeleteUserModalOpen(false);
    setUserToDelete(null);
    showNotification("User deleted successfully.", "success");
    reloadData();
  };

  // ===================================================
  // BORROW & RESERVATION MANAGEMENT (ADMIN SIDE)
  // ===================================================
  const handleAdminReturnBook = (bookId) => {
    const currentBorrowed = getBorrowedBooks();
    const returnedItem = currentBorrowed.find((b) => b.bookId === bookId);
    if (!returnedItem) return;

    const updatedBorrowed = currentBorrowed.filter((b) => b.bookId !== bookId);
    saveBorrowedBooks(updatedBorrowed);

    // Make book available in catalog
    const currentBooks = getBooks();
    const targetBook = currentBooks.find((b) => b.id === bookId);
    if (targetBook) {
      targetBook.status = "available";
      saveBooks(currentBooks);
    }

    // Update history
    const currentHistory = getHistory();
    for (let h = 0; h < currentHistory.length; h++) {
      if (currentHistory[h].bookId === bookId && currentHistory[h].status === "Borrowed") {
        currentHistory[h].status = `Returned (${formatDate(new Date())})`;
        break;
      }
    }
    saveHistory(currentHistory);

    showNotification("Book marked as returned.", "success");
    reloadData();
  };

  const handleAdminCancelReservation = (bookId) => {
    const currentReservations = getReservations().filter((r) => r.bookId !== bookId);
    saveReservations(currentReservations);

    showNotification("Reservation cancelled.", "info");
    reloadData();
  };

  // ===================================================
  // ADMIN PROFILE UPDATE
  // ===================================================
  const handleSaveAdminProfile = (e) => {
    e.preventDefault();

    const newName = adminProfileName.trim();
    const newId = adminProfileId.trim();
    const newEmail = adminProfileEmail.trim();

    if (!newName || !newId || !newEmail) {
      showNotification("Please complete all required fields.", "warning");
      return;
    }

    if (!newEmail.includes("@") || !newEmail.includes(".")) {
      showNotification("Please enter a valid email address.", "warning");
      return;
    }

    const currentUsers = getUsers();
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    // Check duplicate email
    if (
      currentUsers.some(
        (u) =>
          String(u.id) !== String(loggedInUserId) &&
          u.email.toLowerCase() === newEmail.toLowerCase()
      )
    ) {
      showNotification("That email is already registered.", "warning");
      return;
    }

    // Check duplicate ID
    if (
      currentUsers.some(
        (u) =>
          String(u.id) !== String(loggedInUserId) &&
          u.studentId.toLowerCase() === newId.toLowerCase()
      )
    ) {
      showNotification("This Admin ID is already registered.", "warning");
      return;
    }

    const updated = currentUsers.map((u) => {
      if (String(u.id) === String(loggedInUserId)) {
        return { ...u, fullName: newName, studentId: newId, email: newEmail };
      }
      return u;
    });

    saveUsers(updated);
    localStorage.setItem("userEmail", newEmail);

    refreshUser();
    reloadData();
    showNotification("Profile updated successfully.", "success");
  };

  // ===================================================
  // COMPUTED VALUES & FILTERED DATA
  // ===================================================
  const totalBooksCount = books.length;
  const availableBooksCount = books.filter((b) => b.status === "available").length;
  const borrowedBooksCount = borrowedBooks.length;
  const totalUsersCount = users.length;
  const reservationsCount = reservations.length;
  const overdueBooksList = useMemo(() => {
    return borrowedBooks.filter((b) => isOverdue(b.dueDate));
  }, [borrowedBooks]);
  const overdueBooksCount = overdueBooksList.length;

  // Filtered books
  const filteredBooks = useMemo(() => {
    const cleanSearch = bookSearch.toLowerCase().trim();
    return books.filter((book) => {
      if (bookCategory !== "All Categories" && book.category !== bookCategory) {
        return false;
      }
      if (cleanSearch) {
        const titleMatch = book.title.toLowerCase().includes(cleanSearch);
        const authorMatch = book.author.toLowerCase().includes(cleanSearch);
        const isbnMatch = book.isbn ? book.isbn.includes(cleanSearch) : false;
        if (!titleMatch && !authorMatch && !isbnMatch) return false;
      }
      return true;
    });
  }, [books, bookSearch, bookCategory]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const cleanSearch = userSearch.toLowerCase().trim();
    return users.filter((u) => {
      if (userRoleFilter !== "All Roles" && u.role !== userRoleFilter) {
        return false;
      }
      if (cleanSearch) {
        const nameMatch = u.fullName ? u.fullName.toLowerCase().includes(cleanSearch) : false;
        const idMatch = u.studentId ? u.studentId.toLowerCase().includes(cleanSearch) : false;
        const emailMatch = u.email ? u.email.toLowerCase().includes(cleanSearch) : false;
        if (!nameMatch && !idMatch && !emailMatch) return false;
      }
      return true;
    });
  }, [users, userSearch, userRoleFilter]);

  // Recent Activity calculation
  const recentActivities = useMemo(() => {
    const studentName = localStorage.getItem("studentName") || "Student User";
    const items = [];

    // Up to 5 from history
    for (let h = history.length - 1; h >= 0 && items.length < 5; h--) {
      const hItem = history[h];
      items.push({
        text: `${studentName} ${hItem.status === "Borrowed" ? "borrowed" : "returned"} "${hItem.title}"`,
        date: hItem.borrowDate
      });
    }

    // Up to 6 from reservations
    for (let r = reservations.length - 1; r >= 0 && items.length < 6; r--) {
      const rItem = reservations[r];
      items.push({
        text: `${studentName} reserved "${rItem.title}"`,
        date: rItem.reservationDate
      });
    }

    return items;
  }, [history, reservations]);

  // Category Distribution for Reports
  const categoryReport = useMemo(() => {
    const counts = {};
    books.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => {
      const percentage = totalBooksCount > 0 ? Math.round((count / totalBooksCount) * 100) : 0;
      return { category, count, percentage };
    });
  }, [books, totalBooksCount]);

  const adminDisplayName = currentUser?.fullName || "Administrator";
  const adminDisplayId = currentUser?.studentId || "ADMIN001";
  const studentBorrowerName = localStorage.getItem("studentName") || "Student User";
  const studentBorrowerId = localStorage.getItem("studentId") || "STU-2026-8841";

  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-brand">
          <img
            src={logoImg}
            alt="Library Emblem"
            width="26"
            height="26"
            style={{ verticalAlign: "middle" }}
          />
          <span>ONLINE LIBRARY</span>
          <span className="nav-admin-badge">ADMIN PORTAL</span>
        </div>
        <div className="nav-user-identity">
          <div className="user-identity-box">
            <div className="identity-avatar">👤</div>
            <div className="identity-text">
              <span className="identity-name" id="adminHeaderName">
                {adminDisplayName}
              </span>
              <span className="identity-id" id="adminHeaderId">
                {adminDisplayId}
              </span>
            </div>
          </div>
          <button id="logoutBtn" className="btn-logout" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Main Layout */}
      <div className="dashboard-layout">
        {/* Sidebar Navigation */}
        <aside className="sidebar" aria-label="Administrator Navigation">
          <ul className="sidebar-menu" id="adminSidebarMenu">
            <li className={`sidebar-item ${activeSection === "dashboard" ? "active" : ""}`}>
              <a
                href="#dashboard"
                data-section="dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("dashboard");
                }}
              >
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "books" ? "active" : ""}`}>
              <a
                href="#books"
                data-section="books"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("books");
                }}
              >
                <span className="nav-icon">📚</span>
                <span>Books</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "users" ? "active" : ""}`}>
              <a
                href="#users"
                data-section="users"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("users");
                }}
              >
                <span className="nav-icon">👥</span>
                <span>Users</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "borrowed-books" ? "active" : ""}`}>
              <a
                href="#borrowed-books"
                data-section="borrowed-books"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("borrowed-books");
                }}
              >
                <span className="nav-icon">📋</span>
                <span>Borrowed Books</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "reservations" ? "active" : ""}`}>
              <a
                href="#reservations"
                data-section="reservations"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("reservations");
                }}
              >
                <span className="nav-icon">🔖</span>
                <span>Reservations</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "overdue-books" ? "active" : ""}`}>
              <a
                href="#overdue-books"
                data-section="overdue-books"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("overdue-books");
                }}
              >
                <span className="nav-icon">⚠️</span>
                <span>Overdue Books</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "reports" ? "active" : ""}`}>
              <a
                href="#reports"
                data-section="reports"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("reports");
                }}
              >
                <span className="nav-icon">📈</span>
                <span>Reports</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "profile" ? "active" : ""}`}>
              <a
                href="#profile"
                data-section="profile"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("profile");
                }}
              >
                <span className="nav-icon">👤</span>
                <span>Profile</span>
              </a>
            </li>
          </ul>

          <div className="sidebar-bottom">
            <div className="sidebar-footer-note">
              <strong>Administrative Authority</strong>
              <br />
              Level 1 Central Access &bull; Active
            </div>
            <button
              id="sidebarLogoutBtn"
              className="sidebar-logout-btn"
              type="button"
              onClick={handleLogout}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content" ref={mainContentRef}>
          {/* Notification Feedback Banner */}
          {notification.visible && (
            <div
              id="notificationBanner"
              className={`notification-banner ${notification.type}`}
              role="status"
              style={{ display: "block" }}
            >
              {notification.message}
            </div>
          )}

          {/* ==============================================
               SECTION 1: DASHBOARD OVERVIEW
          =============================================== */}
          {activeSection === "dashboard" && (
            <section id="section-dashboard" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Monitor and manage library operations.</p>
              </header>

              {/* 6 Statistics Cards */}
              <section className="stats-grid-6" aria-label="System Overview Statistics">
                <div className="stat-card">
                  <div className="stat-label">Total Books</div>
                  <div id="statTotalBooks" className="stat-value">
                    {totalBooksCount}
                  </div>
                  <div className="stat-subtext">Registered catalog titles</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Available Books</div>
                  <div id="statAvailableBooks" className="stat-value">
                    {availableBooksCount}
                  </div>
                  <div className="stat-subtext">Ready for checkout</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Borrowed Books</div>
                  <div id="statBorrowedBooks" className="stat-value">
                    {borrowedBooksCount}
                  </div>
                  <div className="stat-subtext">Currently in circulation</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Total Users</div>
                  <div id="statTotalUsers" className="stat-value">
                    {totalUsersCount}
                  </div>
                  <div className="stat-subtext">Registered patrons</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Reservations</div>
                  <div id="statReservations" className="stat-value">
                    {reservationsCount}
                  </div>
                  <div className="stat-subtext">Pending hold requests</div>
                </div>

                <div className="stat-card overdue-stat">
                  <div className="stat-label">Overdue Books</div>
                  <div id="statOverdueBooks" className="stat-value">
                    {overdueBooksCount}
                  </div>
                  <div className="stat-subtext">Exceeding 14-day limit</div>
                </div>
              </section>

              {/* Recent Activity Panel */}
              <div className="panel-card" style={{ marginTop: "10px" }}>
                <div className="panel-header">
                  <h3>Recent Library Activity</h3>
                  <span style={{ fontSize: "12px", color: "var(--secondary-text)" }}>
                    Live System Event Stream
                  </span>
                </div>
                <div id="recentActivityList">
                  {recentActivities.length === 0 ? (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--secondary-text)",
                        padding: "10px 0"
                      }}
                    >
                      No recent activity.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {recentActivities.map((act, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid var(--border)",
                            fontSize: "13px"
                          }}
                        >
                          <div>
                            <span style={{ color: "var(--primary-green)", fontWeight: 700 }}>
                              &bull;
                            </span>{" "}
                            {act.text}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--secondary-text)" }}>
                            {act.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 2: MANAGE BOOKS
          =============================================== */}
          {activeSection === "books" && (
            <section id="section-books" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Library Books</h1>
                <p>Manage catalog inventory, add new books, edit information, or remove titles.</p>
              </header>

              {/* Filter Toolbar */}
              <div className="filter-bar">
                <div className="search-input-group">
                  <input
                    type="text"
                    id="adminBookSearch"
                    placeholder="Search by title, author, or ISBN..."
                    autoComplete="off"
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                  />
                </div>

                <div className="category-select-group">
                  <select
                    id="adminCategoryFilter"
                    aria-label="Filter by Category"
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Programming">Programming</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Database">Database</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Fiction">Fiction</option>
                  </select>
                </div>

                <button
                  type="button"
                  id="adminClearFiltersBtn"
                  className="btn btn-clear-filters"
                  onClick={() => {
                    setBookSearch("");
                    setBookCategory("All Categories");
                  }}
                >
                  Clear Filters
                </button>

                <button
                  type="button"
                  id="openAddBookBtn"
                  className="btn-add-book"
                  onClick={handleOpenAddBook}
                >
                  <span>+</span> Add Book
                </button>
              </div>

              {/* Books Table */}
              <div className="table-responsive">
                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>ISBN</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="adminBooksTableBody">
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            color: "var(--secondary-text)",
                            padding: "30px"
                          }}
                        >
                          No books found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => {
                        const isAvailable = book.status === "available";
                        return (
                          <tr key={book.id}>
                            <td>
                              <strong>{book.title}</strong>
                            </td>
                            <td>{book.author}</td>
                            <td>
                              <span
                                className="badge"
                                style={{ backgroundColor: "var(--secondary-bg)" }}
                              >
                                {book.category}
                              </span>
                            </td>
                            <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                              {book.isbn}
                            </td>
                            <td>
                              {isAvailable ? (
                                <span className="badge-available">Available</span>
                              ) : (
                                <span className="badge-borrowed">Borrowed</span>
                              )}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div
                                className="table-actions"
                                style={{ justifyContent: "flex-end" }}
                              >
                                <button
                                  type="button"
                                  className="btn-sm btn-edit"
                                  onClick={() => handleOpenEditBook(book)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn-sm btn-delete"
                                  onClick={() => handleOpenDeleteBook(book)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 3: MANAGE USERS
          =============================================== */}
          {activeSection === "users" && (
            <section id="section-users" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Manage Users</h1>
                <p>Institutional library members and registered student patrons.</p>
              </header>

              {/* User Filter Toolbar */}
              <div className="filter-bar">
                <div className="search-input-group">
                  <input
                    type="text"
                    id="adminUserSearch"
                    placeholder="Search users by name, student ID, or email..."
                    autoComplete="off"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <div className="category-select-group">
                  <select
                    id="adminUserRoleFilter"
                    aria-label="Filter by Role"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                  >
                    <option value="All Roles">All Roles</option>
                    <option value="user">Students</option>
                    <option value="admin">Administrators</option>
                  </select>
                </div>

                <button
                  type="button"
                  id="adminUserClearFiltersBtn"
                  className="btn-clear-filters"
                  onClick={() => {
                    setUserSearch("");
                    setUserRoleFilter("All Roles");
                  }}
                >
                  Clear Filters
                </button>
              </div>

              {/* Users Table */}
              <div className="table-responsive">
                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Membership</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="adminUsersTableBody">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            color: "var(--secondary-text)",
                            padding: "30px"
                          }}
                        >
                          No registered users found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isAdmin = u.role === "admin";
                        return (
                          <tr key={u.id}>
                            <td>
                              <strong>{u.fullName}</strong>
                            </td>
                            <td>
                              <code>{u.studentId}</code>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              {isAdmin ? (
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: "#E6EAE4",
                                    color: "var(--dark-green)",
                                    fontWeight: 700,
                                    border: "1px solid var(--border)"
                                  }}
                                >
                                  Administrator
                                </span>
                              ) : (
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: "var(--light-green)",
                                    color: "var(--dark-green)",
                                    fontWeight: 600
                                  }}
                                >
                                  Student / User
                                </span>
                              )}
                            </td>
                            <td>
                              <span className="badge-available">
                                {u.membership || "Active"}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div
                                className="table-actions"
                                style={{ justifyContent: "flex-end" }}
                              >
                                <button
                                  type="button"
                                  className="btn-sm btn-edit"
                                  onClick={() => handleOpenEditUser(u)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn-sm btn-delete"
                                  onClick={() => handleOpenDeleteUser(u)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 4: BORROWED BOOKS
          =============================================== */}
          {activeSection === "borrowed-books" && (
            <section id="section-borrowed-books" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Borrowed Books</h1>
                <p>Current active circulation records and issued library materials.</p>
              </header>

              <div className="table-responsive">
                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Borrower</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody id="adminBorrowedTableBody">
                    {borrowedBooks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            color: "var(--secondary-text)",
                            padding: "30px"
                          }}
                        >
                          No books currently in circulation.
                        </td>
                      </tr>
                    ) : (
                      borrowedBooks.map((item, idx) => {
                        const late = isOverdue(item.dueDate);
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{item.title}</strong>
                              <br />
                              <span
                                style={{ fontSize: "12px", color: "var(--secondary-text)" }}
                              >
                                {item.author}
                              </span>
                            </td>
                            <td>
                              <strong>{studentBorrowerName}</strong>
                              <br />
                              <span
                                style={{ fontSize: "11px", color: "var(--secondary-text)" }}
                              >
                                {studentBorrowerId}
                              </span>
                            </td>
                            <td>{item.borrowDate}</td>
                            <td>{item.dueDate}</td>
                            <td>
                              {late ? (
                                <span className="badge-overdue">Overdue</span>
                              ) : (
                                <span className="badge-available">Active</span>
                              )}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                className="btn-sm btn-return"
                                onClick={() => handleAdminReturnBook(item.bookId)}
                              >
                                Mark Returned
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 5: RESERVATIONS
          =============================================== */}
          {activeSection === "reservations" && (
            <section id="section-reservations" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Reservations</h1>
                <p>Active student holds and priority reservations on circulating materials.</p>
              </header>

              <div className="table-responsive">
                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>User</th>
                      <th>Reservation Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody id="adminReservationsTableBody">
                    {reservations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "center",
                            color: "var(--secondary-text)",
                            padding: "30px"
                          }}
                        >
                          No pending reservations recorded.
                        </td>
                      </tr>
                    ) : (
                      reservations.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{item.title}</strong>
                            <br />
                            <span
                              style={{ fontSize: "12px", color: "var(--secondary-text)" }}
                            >
                              {item.author}
                            </span>
                          </td>
                          <td>{studentBorrowerName}</td>
                          <td>{item.reservationDate}</td>
                          <td>
                            <span className="badge-waiting">{item.status}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="btn-sm btn-delete"
                              onClick={() => handleAdminCancelReservation(item.bookId)}
                            >
                              Cancel Reservation
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 6: OVERDUE BOOKS
          =============================================== */}
          {activeSection === "overdue-books" && (
            <section id="section-overdue-books" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Overdue Books</h1>
                <p>Checked-out loans that have exceeded their allowable 14-day circulation window.</p>
              </header>

              <div className="table-responsive">
                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Borrower</th>
                      <th>Due Date</th>
                      <th>Days Overdue</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody id="adminOverdueTableBody">
                    {overdueBooksList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "center",
                            color: "var(--secondary-text)",
                            padding: "30px"
                          }}
                        >
                          No overdue books.
                        </td>
                      </tr>
                    ) : (
                      overdueBooksList.map((item, idx) => {
                        const days = getDaysOverdue(item.dueDate);
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{item.title}</strong>
                              <br />
                              <span
                                style={{ fontSize: "12px", color: "var(--secondary-text)" }}
                              >
                                {item.author}
                              </span>
                            </td>
                            <td>{studentBorrowerName}</td>
                            <td>{item.dueDate}</td>
                            <td>
                              <span className="badge-overdue">{days} days overdue</span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                className="btn-sm btn-return"
                                onClick={() => handleAdminReturnBook(item.bookId)}
                              >
                                Mark Returned
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 7: LIBRARY REPORTS
          =============================================== */}
          {activeSection === "reports" && (
            <section id="section-reports" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Library Reports</h1>
                <p>System metrics, circulation statistics, and academic discipline breakdown.</p>
              </header>

              <div className="reports-grid">
                {/* Left: Summary */}
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Circulation &amp; Collection Summary</h3>
                  </div>
                  <div className="report-summary-box" id="reportSummaryBox">
                    <div className="report-stat-row">
                      <span>Total Catalog Titles:</span>
                      <strong>{totalBooksCount}</strong>
                    </div>
                    <div className="report-stat-row">
                      <span>Available for Checkout:</span>
                      <strong>{availableBooksCount}</strong>
                    </div>
                    <div className="report-stat-row">
                      <span>Currently Borrowed:</span>
                      <strong>{borrowedBooksCount}</strong>
                    </div>
                    <div className="report-stat-row">
                      <span>Pending Reservations:</span>
                      <strong>{reservationsCount}</strong>
                    </div>
                    <div className="report-stat-row">
                      <span>Overdue Loans:</span>
                      <strong style={{ color: "#8C5311" }}>{overdueBooksCount}</strong>
                    </div>
                    <div className="report-stat-row">
                      <span>Total Registered Patrons:</span>
                      <strong>{totalUsersCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Category Distribution */}
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Category-Wise Book Distribution</h3>
                  </div>
                  <div className="category-breakdown-list" id="categoryReportList">
                    {categoryReport.map((cat, idx) => (
                      <div className="category-bar-item" key={idx}>
                        <div className="category-bar-header">
                          <span>{cat.category}</span>
                          <span>
                            {cat.count} titles ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="category-bar-track">
                          <div
                            className="category-bar-fill"
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 8: ADMIN PROFILE
          =============================================== */}
          {activeSection === "profile" && (
            <section id="section-profile" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Administrator Profile</h1>
                <p>Manage your administrator account information.</p>
              </header>

              <div className="profile-card">
                <div className="profile-header-area">
                  <div className="profile-avatar">👤</div>
                  <div>
                    <h3 id="adminProfileHeaderName">{adminDisplayName}</h3>
                    <p style={{ fontSize: "13px", color: "var(--secondary-text)" }}>
                      Library Administration
                    </p>
                  </div>
                </div>

                <form id="adminProfileForm" noValidate onSubmit={handleSaveAdminProfile}>
                  <div className="profile-details-grid">
                    <div className="profile-field">
                      <label htmlFor="adminProfileFullName" className="profile-field-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="adminProfileFullName"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={adminProfileName}
                        onChange={(e) => setAdminProfileName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="adminProfileAdminId" className="profile-field-label">
                        Admin ID
                      </label>
                      <input
                        type="text"
                        id="adminProfileAdminId"
                        className="form-control"
                        placeholder="e.g. ADMIN001"
                        value={adminProfileId}
                        onChange={(e) => setAdminProfileId(e.target.value)}
                        required
                      />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="adminProfileEmail" className="profile-field-label">
                        Institutional Email
                      </label>
                      <input
                        type="email"
                        id="adminProfileEmail"
                        className="form-control"
                        placeholder="e.g. admin@library.com"
                        value={adminProfileEmail}
                        onChange={(e) => setAdminProfileEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="profile-field">
                      <span className="profile-field-label">System Role</span>
                      <span id="adminProfileRoleDisplay" className="profile-field-value">
                        Administrator
                      </span>
                    </div>

                    <div className="profile-field">
                      <span className="profile-field-label">Library Access</span>
                      <span className="profile-field-value">
                        <span className="badge-active">Active</span>
                      </span>
                    </div>

                    <div className="profile-field">
                      <span className="profile-field-label">Account Type</span>
                      <span className="profile-field-value">Administrator</span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                      paddingTop: "20px",
                      borderTop: "1px solid var(--border)"
                    }}
                  >
                    <button type="submit" id="saveAdminProfileBtn" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ==============================================
           MODAL 1: ADD / EDIT BOOK
      =============================================== */}
      {bookModalOpen && (
        <div
          id="bookModal"
          className="modal-backdrop show-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalHeaderTitle"
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3 id="modalHeaderTitle">
                {editingBookId === null ? "Add New Book" : "Edit Book Details"}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                id="closeBookModalXBtn"
                onClick={() => setBookModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form id="bookForm" noValidate onSubmit={handleSaveBook}>
              <div className="form-group">
                <label htmlFor="modalTitle">Book Title</label>
                <input
                  type="text"
                  id="modalTitle"
                  className="form-control"
                  placeholder="e.g., Clean Code"
                  value={bookFormData.title}
                  onChange={(e) =>
                    setBookFormData({ ...bookFormData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalAuthor">Author</label>
                <input
                  type="text"
                  id="modalAuthor"
                  className="form-control"
                  placeholder="e.g., Robert C. Martin"
                  value={bookFormData.author}
                  onChange={(e) =>
                    setBookFormData({ ...bookFormData, author: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalCategory">Category</label>
                <select
                  id="modalCategory"
                  className="form-control"
                  value={bookFormData.category}
                  onChange={(e) =>
                    setBookFormData({ ...bookFormData, category: e.target.value })
                  }
                  required
                >
                  <option value="Programming">Programming</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Database">Database</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Fiction">Fiction</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modalIsbn">ISBN</label>
                <input
                  type="text"
                  id="modalIsbn"
                  className="form-control"
                  placeholder="e.g., 9780132350884"
                  value={bookFormData.isbn}
                  onChange={(e) =>
                    setBookFormData({ ...bookFormData, isbn: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalStatus">Status</label>
                <select
                  id="modalStatus"
                  className="form-control"
                  value={bookFormData.status}
                  onChange={(e) =>
                    setBookFormData({ ...bookFormData, status: e.target.value })
                  }
                  required
                >
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  id="closeBookModalBtn"
                  className="btn btn-outline"
                  onClick={() => setBookModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" id="saveBookBtn" className="btn btn-primary">
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================
           MODAL 2: DELETE BOOK CONFIRMATION
      =============================================== */}
      {deleteBookModalOpen && bookToDelete && (
        <div
          id="deleteModal"
          className="modal-backdrop show-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deleteModalTitle"
        >
          <div className="modal-card" style={{ maxWidth: "440px" }}>
            <div className="modal-header">
              <h3 id="deleteModalTitle">Confirm Delete</h3>
              <button
                type="button"
                className="modal-close-btn"
                id="closeDeleteModalXBtn"
                onClick={() => setDeleteBookModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "8px" }}>
              Are you sure you want to delete this book from the catalog?
            </p>
            <p
              id="deleteBookTitle"
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--dark-green)",
                marginBottom: "14px"
              }}
            >
              {bookToDelete.title} (by {bookToDelete.author})
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--secondary-text)",
                marginBottom: 0
              }}
            >
              This action will remove the title from both Administrator and Student portals.
            </p>

            <div className="modal-footer">
              <button
                type="button"
                id="cancelDeleteBtn"
                className="btn btn-outline"
                onClick={() => setDeleteBookModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirmDeleteBtn"
                className="btn"
                style={{
                  backgroundColor: "#8C2B2B",
                  color: "#FFFFFF",
                  border: "1px solid #8C2B2B"
                }}
                onClick={handleConfirmDeleteBook}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================
           MODAL 3: EDIT USER
      =============================================== */}
      {userModalOpen && (
        <div
          id="userEditModal"
          className="modal-backdrop show-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="userEditModalTitle"
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3 id="userEditModalTitle">Edit User Information</h3>
              <button
                type="button"
                className="modal-close-btn"
                id="closeUserModalXBtn"
                onClick={() => setUserModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {userModalError && (
              <div
                id="userEditErrorBox"
                className="error-box"
                role="alert"
                style={{ display: "block", marginBottom: "14px" }}
              >
                {userModalError}
              </div>
            )}

            <form id="userEditForm" noValidate onSubmit={handleSaveUser}>
              <div className="form-group">
                <label htmlFor="editUserFullName">Full Name</label>
                <input
                  type="text"
                  id="editUserFullName"
                  className="form-control"
                  placeholder="Full Name"
                  value={userFormData.fullName}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editUserStudentId">Student / Staff ID</label>
                <input
                  type="text"
                  id="editUserStudentId"
                  className="form-control"
                  placeholder="Student ID"
                  value={userFormData.studentId}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, studentId: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editUserEmail">Email Address</label>
                <input
                  type="email"
                  id="editUserEmail"
                  className="form-control"
                  placeholder="Email"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editUserRole">System Role</label>
                <select
                  id="editUserRole"
                  className="form-control"
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, role: e.target.value })
                  }
                  required
                >
                  <option value="user">Student / User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editUserMembership">Library Membership</label>
                <select
                  id="editUserMembership"
                  className="form-control"
                  value={userFormData.membership}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, membership: e.target.value })
                  }
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  id="closeUserModalBtn"
                  className="btn btn-outline"
                  onClick={() => setUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" id="saveUserBtn" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================
           MODAL 4: DELETE USER CONFIRMATION
      =============================================== */}
      {deleteUserModalOpen && userToDelete && (
        <div
          id="deleteUserModal"
          className="modal-backdrop show-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deleteUserModalTitle"
        >
          <div className="modal-card" style={{ maxWidth: "440px" }}>
            <div className="modal-header">
              <h3 id="deleteUserModalTitle">Confirm Delete User</h3>
              <button
                type="button"
                className="modal-close-btn"
                id="closeDeleteUserModalXBtn"
                onClick={() => setDeleteUserModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {deleteUserAlert && (
              <div
                id="deleteUserAlertBox"
                className="error-box"
                role="alert"
                style={{ display: "block", marginBottom: "14px" }}
              >
                {deleteUserAlert}
              </div>
            )}

            <p
              id="deleteUserQuestion"
              style={{ fontSize: "14px", color: "var(--text)", marginBottom: "8px" }}
            >
              Are you sure you want to delete this user?
            </p>
            <p
              id="deleteUserNameDisplay"
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--dark-green)",
                marginBottom: "14px"
              }}
            >
              {userToDelete.fullName} ({userToDelete.email})
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--secondary-text)",
                marginBottom: 0
              }}
            >
              This action will permanently remove the user account from localStorage.
            </p>

            <div className="modal-footer">
              <button
                type="button"
                id="cancelDeleteUserBtn"
                className="btn btn-outline"
                onClick={() => setDeleteUserModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirmDeleteUserBtn"
                className="btn"
                style={{
                  backgroundColor: "#8C2B2B",
                  color: "#FFFFFF",
                  border: "1px solid #8C2B2B"
                }}
                onClick={handleConfirmDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
