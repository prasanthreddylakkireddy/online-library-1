/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Student Dashboard (StudentDashboard.jsx)
   Pixel-identical migration of user.html & user.js
=================================================== */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getBooks,
  saveBooks,
  getBorrowedBooks,
  saveBorrowedBooks,
  getReservations,
  saveReservations,
  getHistory,
  saveHistory,
  getUsers,
  saveUsers
} from "../utils/storage";
import { formatDate, isOverdue } from "../utils/helpers";
import logoImg from "../assets/images/logo.png";
import "../styles/user.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout, refreshUser } = useAuth();

  // Active section: "dashboard", "books", "my-books", "reservations", "history", "profile"
  const [activeSection, setActiveSection] = useState("dashboard");

  // Notifications
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });
  const notifTimeoutRef = useRef(null);

  const showNotification = (message, type = "success") => {
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    setNotification({ message, type, visible: true });
    notifTimeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  // State collections
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [history, setHistory] = useState([]);

  // Search & Filter state for catalog
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profileId, setProfileId] = useState("");

  const mainContentRef = useRef(null);

  // Load data on mount & whenever user updates
  const reloadData = () => {
    setBooks(getBooks());
    setBorrowedBooks(getBorrowedBooks());
    setReservations(getReservations());
    setHistory(getHistory());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Update profile input defaults
  useEffect(() => {
    const sName = currentUser?.fullName || localStorage.getItem("studentName") || "Student User";
    const sId = currentUser?.studentId || localStorage.getItem("studentId") || "STU-2026-8841";
    setProfileName(sName);
    setProfileId(sId);
  }, [currentUser]);

  // Keep body overflow clean for desktop dashboard layout
  useEffect(() => {
    document.body.classList.add("dashboard-active");
    return () => {
      document.body.classList.remove("dashboard-active");
    };
  }, []);

  // Section switcher
  const handleSwitchSection = (sectionName) => {
    setActiveSection(sectionName);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Borrow Book
  const handleBorrowBook = (bookId) => {
    const currentBooks = getBooks();
    const targetBook = currentBooks.find((b) => b.id === bookId);

    if (!targetBook || targetBook.status !== "available") {
      showNotification("Unable to borrow this book.", "error");
      return;
    }

    // 1. Update book status in catalog
    targetBook.status = "borrowed";
    saveBooks(currentBooks);

    // 2. Dates: 14 days loan
    const today = new Date();
    const dueDateObj = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const borrowDateStr = formatDate(today);
    const dueDateStr = formatDate(dueDateObj);

    // 3. Add to borrowed
    const currentBorrowed = getBorrowedBooks();
    currentBorrowed.push({
      bookId: targetBook.id,
      title: targetBook.title,
      author: targetBook.author,
      category: targetBook.category,
      isbn: targetBook.isbn,
      borrowDate: borrowDateStr,
      dueDate: dueDateStr,
      status: "Active"
    });
    saveBorrowedBooks(currentBorrowed);

    // 4. Remove reservation if this user had reserved it
    const currentReservations = getReservations().filter((r) => r.bookId !== bookId);
    saveReservations(currentReservations);

    // 5. Log to history
    const currentHistory = getHistory();
    currentHistory.push({
      bookId: targetBook.id,
      title: targetBook.title,
      author: targetBook.author,
      borrowDate: borrowDateStr,
      returnDueDate: dueDateStr,
      status: "Borrowed"
    });
    saveHistory(currentHistory);

    showNotification("Book borrowed successfully.", "success");
    reloadData();
  };

  // Reserve Book
  const handleReserveBook = (bookId) => {
    const currentBooks = getBooks();
    const targetBook = currentBooks.find((b) => b.id === bookId);

    if (!targetBook) {
      showNotification("Book not found.", "error");
      return;
    }

    const currentReservations = getReservations();
    if (currentReservations.some((r) => r.bookId === bookId)) {
      showNotification("You have already reserved this book.", "warning");
      return;
    }

    currentReservations.push({
      bookId: targetBook.id,
      title: targetBook.title,
      author: targetBook.author,
      category: targetBook.category,
      reservationDate: formatDate(new Date()),
      status: "Waiting"
    });
    saveReservations(currentReservations);

    showNotification("Book reserved successfully.", "success");
    reloadData();
  };

  // Return Book
  const handleReturnBook = (bookId) => {
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

    // Update history entry
    const currentHistory = getHistory();
    for (let h = 0; h < currentHistory.length; h++) {
      if (currentHistory[h].bookId === bookId && currentHistory[h].status === "Borrowed") {
        currentHistory[h].status = `Returned (${formatDate(new Date())})`;
        break;
      }
    }
    saveHistory(currentHistory);

    showNotification("Book returned successfully.", "success");
    reloadData();
  };

  // Cancel Reservation
  const handleCancelReservation = (bookId) => {
    const currentReservations = getReservations().filter((r) => r.bookId !== bookId);
    saveReservations(currentReservations);

    showNotification("Reservation cancelled.", "warning");
    reloadData();
  };

  // Save Profile Form
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const newName = profileName.trim();
    const newId = profileId.trim();

    if (!newName || !newId) {
      showNotification("Please enter your name and student ID.", "warning");
      return;
    }

    const users = getUsers();
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const userEmail = localStorage.getItem("userEmail");

    for (let u = 0; u < users.length; u++) {
      if (
        (loggedInUserId && String(users[u].id) === String(loggedInUserId)) ||
        (userEmail && users[u].email.toLowerCase() === userEmail.toLowerCase())
      ) {
        users[u].fullName = newName;
        users[u].studentId = newId;
        break;
      }
    }
    saveUsers(users);

    localStorage.setItem("studentName", newName);
    localStorage.setItem("studentId", newId);

    refreshUser();
    showNotification("Profile updated successfully.", "success");
  };

  // Computed Dashboard Statistics
  const borrowedCount = borrowedBooks.length;
  const reservedCount = reservations.length;
  const availableCount = books.filter((b) => b.status === "available").length;
  const overdueCount = borrowedBooks.filter((b) => isOverdue(b.dueDate)).length;

  // Filtered books
  const filteredBooks = useMemo(() => {
    const cleanSearch = searchTerm.toLowerCase().trim();
    return books.filter((book) => {
      if (selectedCategory !== "All Categories" && book.category !== selectedCategory) {
        return false;
      }
      if (cleanSearch) {
        const titleMatch = book.title.toLowerCase().includes(cleanSearch);
        const authorMatch = book.author.toLowerCase().includes(cleanSearch);
        if (!titleMatch && !authorMatch) return false;
      }
      return true;
    });
  }, [books, searchTerm, selectedCategory]);

  const studentDisplayName =
    currentUser?.fullName || localStorage.getItem("studentName") || "Student User";
  const studentDisplayId =
    currentUser?.studentId || localStorage.getItem("studentId") || "STU-2026-8841";
  const studentEmail =
    currentUser?.email || localStorage.getItem("userEmail") || "student@gmail.com";
  const membershipStatus = currentUser?.membership || "Active";

  return (
    <div className="student-dashboard-wrapper">
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
          <span className="badge">STUDENT PORTAL</span>
        </div>
        <div className="nav-user-identity">
          <div className="user-identity-box">
            <div className="identity-avatar">👤</div>
            <div className="identity-text">
              <span id="headerStudentName" className="identity-name">
                {studentDisplayName}
              </span>
              <span id="headerStudentId" className="identity-id">
                {studentDisplayId}
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
        <aside className="sidebar" aria-label="Student Navigation">
          <ul className="sidebar-menu" id="sidebarMenu">
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
                <span className="nav-icon">📖</span>
                <span>Books</span>
              </a>
            </li>
            <li className={`sidebar-item ${activeSection === "my-books" ? "active" : ""}`}>
              <a
                href="#my-books"
                data-section="my-books"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("my-books");
                }}
              >
                <span className="nav-icon">📑</span>
                <span>My Books</span>
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
            <li className={`sidebar-item ${activeSection === "history" ? "active" : ""}`}>
              <a
                href="#history"
                data-section="history"
                onClick={(e) => {
                  e.preventDefault();
                  handleSwitchSection("history");
                }}
              >
                <span className="nav-icon">🕒</span>
                <span>History</span>
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
              <strong>Academic Session</strong>
              <br />
              2026 - 2027 &bull; Active Card
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
                <h1>USER DASHBOARD</h1>
                <p>
                  Welcome back, <strong id="welcomeEmailDisplay">{studentDisplayName}</strong> —
                  Manage your books, reservations and library activity.
                </p>
              </header>

              {/* 4 Statistics Cards */}
              <section className="stats-grid" aria-label="Library Overview Summary">
                <div className="stat-card">
                  <div className="stat-label">Borrowed Books</div>
                  <div id="statBorrowedCount" className="stat-value">
                    {borrowedCount}
                  </div>
                  <div className="stat-subtext">Currently checked out</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Reserved Books</div>
                  <div id="statReservedCount" className="stat-value">
                    {reservedCount}
                  </div>
                  <div className="stat-subtext">Waiting on hold</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Available Books</div>
                  <div id="statAvailableCount" className="stat-value">
                    {availableCount}
                  </div>
                  <div className="stat-subtext">Ready for checkout</div>
                </div>

                <div className="stat-card overdue-stat">
                  <div className="stat-label">Overdue Books</div>
                  <div id="statOverdueCount" className="stat-value">
                    {overdueCount}
                  </div>
                  <div className="stat-subtext">Requires return</div>
                </div>
              </section>

              {/* Dashboard Quick Panels */}
              <div className="dashboard-panels">
                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Active Loans Quick View</h3>
                    <span
                      className="panel-link"
                      data-switch="my-books"
                      onClick={() => handleSwitchSection("my-books")}
                    >
                      View All My Books &rarr;
                    </span>
                  </div>
                  <div id="dashboardBorrowedSummary">
                    {borrowedBooks.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "var(--secondary-text)" }}>
                        No books currently borrowed. Browse the catalog to borrow academic books.
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {borrowedBooks.slice(0, 3).map((item, idx) => {
                          const late = isOverdue(item.dueDate);
                          return (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 0",
                                borderBottom: "1px solid var(--border)",
                                fontSize: "13px"
                              }}
                            >
                              <div>
                                <strong>{item.title}</strong>
                                <br />
                                <span style={{ color: "var(--secondary-text)" }}>
                                  {item.author}
                                </span>
                              </div>
                              <div>
                                {late ? (
                                  <span className="badge-overdue">Overdue</span>
                                ) : (
                                  <span className="badge-active">Due: {item.dueDate}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="panel-card">
                  <div className="panel-header">
                    <h3>Catalog Quick Access</h3>
                    <span
                      className="panel-link"
                      data-switch="books"
                      onClick={() => handleSwitchSection("books")}
                    >
                      Browse Catalog &rarr;
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--secondary-text)",
                      marginBottom: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    Search our central academic catalog to borrow available texts for your semester
                    coursework or place reservations on in-demand titles.
                  </p>
                  <button
                    className="btn btn-outline"
                    style={{ width: "100%" }}
                    data-switch="books"
                    onClick={() => handleSwitchSection("books")}
                  >
                    Open Book Catalog
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 2: BROWSE BOOKS
          =============================================== */}
          {activeSection === "books" && (
            <section id="section-books" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Browse Books</h1>
                <p>Search by title or author, filter by academic discipline, and borrow or reserve books.</p>
              </header>

              {/* Search & Category Filter Toolbar */}
              <div className="filter-bar">
                <div className="search-input-group">
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Search by title or author..."
                    autoComplete="off"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="category-select-group">
                  <select
                    id="categoryFilter"
                    aria-label="Filter by Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                  id="clearFiltersBtn"
                  className="btn btn-clear-filters"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Clear Filters
                </button>
              </div>

              {/* Book Cards Grid */}
              <div id="booksGrid" className="books-grid">
                {filteredBooks.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
                    <span className="empty-state-icon">🔍</span>
                    <h4>No Books Found</h4>
                    <p>No catalog titles match your search criteria. Try a different query or click "Clear Filters".</p>
                  </div>
                ) : (
                  filteredBooks.map((book) => {
                    const isAvailable = book.status === "available";
                    const myBorrowedItem = borrowedBooks.find((b) => b.bookId === book.id);
                    const isBorrowedByMe = !!myBorrowedItem;
                    const isReservedByMe = reservations.some((r) => r.bookId === book.id);

                    return (
                      <div className="book-card" key={book.id}>
                        <div className="book-cover">
                          <div className="book-cover-top">
                            <span className="book-category-tag">{book.category}</span>
                            <span className="book-emblem">📖</span>
                          </div>
                          <div className="book-isbn-tag">ISBN: {book.isbn}</div>
                        </div>
                        <div className="book-body">
                          <h3 className="book-title">{book.title}</h3>
                          <div className="book-author">by {book.author}</div>
                          {isAvailable ? (
                            <div className="book-availability status-available">
                              <span className="availability-dot"></span>✓ Available
                            </div>
                          ) : (
                            <div className="book-availability status-borrowed">
                              <span className="availability-dot"></span>Currently Borrowed
                            </div>
                          )}
                        </div>
                        <div className="book-actions">
                          {isAvailable ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleBorrowBook(book.id)}
                            >
                              Borrow Book
                            </button>
                          ) : isBorrowedByMe ? (
                            <button
                              type="button"
                              className="btn btn-outline"
                              disabled
                              style={{ opacity: 0.8, cursor: "default" }}
                            >
                              Borrowed (Due: {myBorrowedItem.dueDate})
                            </button>
                          ) : isReservedByMe ? (
                            <button
                              type="button"
                              className="btn btn-outline"
                              disabled
                              style={{ opacity: 0.8, cursor: "default" }}
                            >
                              Reserved
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => handleReserveBook(book.id)}
                            >
                              Reserve Book
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 3: MY BORROWED BOOKS
          =============================================== */}
          {activeSection === "my-books" && (
            <section id="section-my-books" className="dashboard-section active-section">
              <header className="page-header">
                <h1>My Borrowed Books</h1>
                <p>Academic titles currently checked out to your student library account.</p>
              </header>

              <div id="myBooksList" className="items-list">
                {borrowedBooks.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-state-icon">📑</span>
                    <h4>No Borrowed Books</h4>
                    <p>You have not checked out any books yet. Browse the catalog to borrow available books.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSwitchSection("books")}
                    >
                      Browse Books
                    </button>
                  </div>
                ) : (
                  borrowedBooks.map((item, idx) => {
                    const isLate = isOverdue(item.dueDate);
                    return (
                      <div className="item-card" key={idx}>
                        <div className="item-info">
                          <h4>{item.title}</h4>
                          <p>
                            by {item.author} &bull; {item.category}
                          </p>
                          <div className="item-meta">
                            <span className="meta-badge">Borrowed: {item.borrowDate}</span>
                            <span className="meta-badge">Due: {item.dueDate}</span>
                            <span>
                              {isLate ? (
                                <span className="badge-overdue">Overdue</span>
                              ) : (
                                <span className="badge-active">Active</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="item-actions">
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => handleReturnBook(item.bookId)}
                          >
                            Return Book
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 4: RESERVATIONS
          =============================================== */}
          {activeSection === "reservations" && (
            <section id="section-reservations" className="dashboard-section active-section">
              <header className="page-header">
                <h1>My Reservations</h1>
                <p>Books currently borrowed by other patrons that you have reserved for priority checkout.</p>
              </header>

              <div id="reservationsList" className="items-list">
                {reservations.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-state-icon">🔖</span>
                    <h4>No Active Reservations</h4>
                    <p>You have not placed any books on hold. When books are checked out by others, you can reserve them here.</p>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleSwitchSection("books")}
                    >
                      View Catalog
                    </button>
                  </div>
                ) : (
                  reservations.map((item, idx) => (
                    <div className="item-card" key={idx}>
                      <div className="item-info">
                        <h4>{item.title}</h4>
                        <p>
                          by {item.author} &bull; {item.category}
                        </p>
                        <div className="item-meta">
                          <span className="meta-badge">Reserved on: {item.reservationDate}</span>
                          <span className="badge-waiting">Status: Waiting</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => handleCancelReservation(item.bookId)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* ==============================================
               SECTION 5: BORROWING HISTORY
          =============================================== */}
          {activeSection === "history" && (
            <section id="section-history" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Borrowing History</h1>
                <p>Historical audit of your past loans, returns, and issued items.</p>
              </header>

              <div className="table-responsive">
                <table className="academic-table">
                  <thead>
                    <tr>
                      <th>Book Title &amp; Author</th>
                      <th>Borrow Date</th>
                      <th>Return / Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="historyTableBody">
                    {history.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            textAlign: "center",
                            color: "var(--secondary-text)",
                            padding: "30px"
                          }}
                        >
                          No borrowing activity recorded yet.
                        </td>
                      </tr>
                    ) : (
                      [...history].reverse().map((item, idx) => {
                        const isBorrowed = item.status === "Borrowed";
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{item.title}</strong>
                              <br />
                              <span style={{ fontSize: "12px", color: "var(--secondary-text)" }}>
                                {item.author}
                              </span>
                            </td>
                            <td>{item.borrowDate}</td>
                            <td>{item.returnDueDate}</td>
                            <td>
                              {isBorrowed ? (
                                <span className="badge-active">Borrowed</span>
                              ) : (
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: "var(--secondary-bg)",
                                    color: "var(--text)"
                                  }}
                                >
                                  {item.status}
                                </span>
                              )}
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
               SECTION 6: PROFILE
          =============================================== */}
          {activeSection === "profile" && (
            <section id="section-profile" className="dashboard-section active-section">
              <header className="page-header">
                <h1>Student Profile</h1>
                <p>Verified institutional identification and library membership status.</p>
              </header>

              <div className="profile-card">
                <div className="profile-header-area">
                  <div className="profile-avatar">👨‍🎓</div>
                  <div>
                    <h3 id="profileHeaderName">{studentDisplayName}</h3>
                    <p style={{ fontSize: "13px", color: "var(--secondary-text)" }}>
                      Department of Computer Science &amp; Engineering
                    </p>
                  </div>
                </div>

                <form id="profileForm" noValidate onSubmit={handleSaveProfile}>
                  <div className="profile-details-grid">
                    <div className="profile-field">
                      <label htmlFor="profileFullNameInput" className="profile-field-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="profileFullNameInput"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="profileStudentIdInput" className="profile-field-label">
                        Student ID Number
                      </label>
                      <input
                        type="text"
                        id="profileStudentIdInput"
                        className="form-control"
                        placeholder="e.g. STU-2026-8841"
                        value={profileId}
                        onChange={(e) => setProfileId(e.target.value)}
                        required
                      />
                    </div>

                    <div className="profile-field">
                      <span className="profile-field-label">Institutional Email</span>
                      <span id="profileEmailDisplay" className="profile-field-value">
                        {studentEmail}
                      </span>
                    </div>

                    <div className="profile-field">
                      <span className="profile-field-label">System Role</span>
                      <span id="profileRoleDisplay" className="profile-field-value">
                        Student / User
                      </span>
                    </div>

                    <div className="profile-field">
                      <span className="profile-field-label">Library Membership</span>
                      <span className="profile-field-value">
                        <span className="badge-active">{membershipStatus}</span>
                      </span>
                    </div>

                    <div className="profile-field">
                      <span className="profile-field-label">Validity Period</span>
                      <span className="profile-field-value">Academic Year 2026 - 2027</span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                      paddingTop: "20px",
                      borderTop: "1px solid var(--border)"
                    }}
                  >
                    <button type="submit" id="saveProfileBtn" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
