/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   User Dashboard Script (user.js)
   Complete Phase 2 Student Functionality & Profile
=================================================== */

// ===================================================
// 1. ROLE-BASED ACCESS PROTECTION
// ===================================================
// Only users with userRole === "user" are allowed.
var currentRole = localStorage.getItem("userRole");

if (currentRole !== "user") {
    // Redirect unauthenticated or unauthorized users back to login
    window.location.href = "index.html";
}

// ===================================================
// 2. EXPANDED ACADEMIC BOOK COLLECTION (35 BOOKS)
// ===================================================
var initialBooks = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        isbn: "9780132350884",
        status: "available"
    },
    {
        id: 2,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Algorithms",
        isbn: "9780262033848",
        status: "available"
    },
    {
        id: 3,
        title: "Database System Concepts",
        author: "Abraham Silberschatz",
        category: "Database",
        isbn: "9780073523323",
        status: "available"
    },
    {
        id: 4,
        title: "JavaScript: The Definitive Guide",
        author: "David Flanagan",
        category: "Web Development",
        isbn: "9781491952023",
        status: "available"
    },
    {
        id: 5,
        title: "Artificial Intelligence: A Modern Approach",
        author: "Stuart Russell & Peter Norvig",
        category: "Artificial Intelligence",
        isbn: "9780136042594",
        status: "available"
    },
    {
        id: 6,
        title: "Hands-On Machine Learning",
        author: "Aurélien Géron",
        category: "Machine Learning",
        isbn: "9781492032649",
        status: "available"
    },
    {
        id: 7,
        title: "Python Crash Course",
        author: "Eric Matthes",
        category: "Programming",
        isbn: "9781593279288",
        status: "available"
    },
    {
        id: 8,
        title: "Computer Networks",
        author: "Andrew S. Tanenbaum",
        category: "Computer Networks",
        isbn: "9780132126953",
        status: "available"
    },
    {
        id: 9,
        title: "Operating System Concepts",
        author: "Abraham Silberschatz",
        category: "Operating Systems",
        isbn: "9781119800361",
        status: "available"
    },
    {
        id: 10,
        title: "Design Patterns",
        author: "Erich Gamma & Ralph Johnson",
        category: "Software Engineering",
        isbn: "9780201633610",
        status: "available"
    },
    {
        id: 11,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        category: "Programming",
        isbn: "9780201616224",
        status: "borrowed" // Starts as borrowed so students can test "Reserve Book" immediately
    },
    {
        id: 12,
        title: "Head First Java",
        author: "Kathy Sierra & Bert Bates",
        category: "Programming",
        isbn: "9780596009205",
        status: "available"
    },
    {
        id: 13,
        title: "Learning SQL",
        author: "Alan Beaulieu",
        category: "Database",
        isbn: "9781492057611",
        status: "available"
    },
    {
        id: 14,
        title: "Don't Make Me Think",
        author: "Steve Krug",
        category: "Web Development",
        isbn: "9780321965516",
        status: "available"
    },
    {
        id: 15,
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        category: "Web Development",
        isbn: "9781593279509",
        status: "available"
    },
    {
        id: 16,
        title: "Deep Learning",
        author: "Ian Goodfellow & Yoshua Bengio",
        category: "Artificial Intelligence",
        isbn: "9780262035613",
        status: "available"
    },
    {
        id: 17,
        title: "Pattern Recognition and Machine Learning",
        author: "Christopher Bishop",
        category: "Machine Learning",
        isbn: "9780387310732",
        status: "available"
    },
    {
        id: 18,
        title: "Data Structures and Algorithms in Java",
        author: "Robert Lafore",
        category: "Computer Science",
        isbn: "9780672324536",
        status: "available"
    },
    {
        id: 19,
        title: "Modern Operating Systems",
        author: "Andrew S. Tanenbaum",
        category: "Operating Systems",
        isbn: "9780133591620",
        status: "available"
    },
    {
        id: 20,
        title: "Computer Organization and Design",
        author: "David Patterson & John Hennessy",
        category: "Computer Science",
        isbn: "9780128122754",
        status: "available"
    },
    {
        id: 21,
        title: "Software Engineering",
        author: "Ian Sommerville",
        category: "Software Engineering",
        isbn: "9780133943030",
        status: "available"
    },
    {
        id: 22,
        title: "Computer Security: Principles & Practice",
        author: "William Stallings",
        category: "Cyber Security",
        isbn: "9780134772806",
        status: "available"
    },
    {
        id: 23,
        title: "Cloud Computing: Principles & Paradigms",
        author: "Rajkumar Buyya",
        category: "Cloud Computing",
        isbn: "9780470887998",
        status: "available"
    },
    {
        id: 24,
        title: "Reinforcement Learning",
        author: "Richard S. Sutton & Andrew Barto",
        category: "Artificial Intelligence",
        isbn: "9780262039246",
        status: "available"
    },
    {
        id: 25,
        title: "The C Programming Language",
        author: "Brian Kernighan & Dennis Ritchie",
        category: "Programming",
        isbn: "9780131103627",
        status: "available"
    },
    {
        id: 26,
        title: "Effective Java",
        author: "Joshua Bloch",
        category: "Programming",
        isbn: "9780134685991",
        status: "available"
    },
    {
        id: 27,
        title: "C++ Primer",
        author: "Stanley Lippman",
        category: "Programming",
        isbn: "9780321714114",
        status: "available"
    },
    {
        id: 28,
        title: "Web Design with HTML, CSS, JavaScript",
        author: "Jon Duckett",
        category: "Web Development",
        isbn: "9781118008188",
        status: "available"
    },
    {
        id: 29,
        title: "Algorithms",
        author: "Robert Sedgewick & Kevin Wayne",
        category: "Algorithms",
        isbn: "9780321573513",
        status: "available"
    },
    {
        id: 30,
        title: "Introduction to Data Mining",
        author: "Pang-Ning Tan",
        category: "Data Science",
        isbn: "9780133128901",
        status: "available"
    },
    {
        id: 31,
        title: "Fundamentals of Database Systems",
        author: "Ramez Elmasri & Shamkant Navathe",
        category: "Database",
        isbn: "9780133970777",
        status: "available"
    },
    {
        id: 32,
        title: "Artificial Intelligence For Dummies",
        author: "John Paul Mueller",
        category: "Artificial Intelligence",
        isbn: "9781119796763",
        status: "available"
    },
    {
        id: 33,
        title: "Discrete Mathematics and Its Applications",
        author: "Kenneth H. Rosen",
        category: "Mathematics",
        isbn: "9780073383095",
        status: "available"
    },
    {
        id: 34,
        title: "Python Data Science Handbook",
        author: "Jake VanderPlas",
        category: "Data Science",
        isbn: "9781491912058",
        status: "available"
    },
    {
        id: 35,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        isbn: "9780061120084",
        status: "available"
    }
];

// ===================================================
// 3. STORAGE INITIALIZATION & HELPERS
// ===================================================

function initStorage() {
    // 1. Initialize or expand books collection without erasing user activity
    var storedBooks = null;
    try {
        storedBooks = JSON.parse(localStorage.getItem("books"));
    } catch (e) {
        storedBooks = null;
    }

    if (!storedBooks || storedBooks.length < 30) {
        var currentBorrowed = getBorrowedBooks();
        // Sync any active borrowed books so their status stays borrowed in the new list
        for (var b = 0; b < initialBooks.length; b++) {
            for (var k = 0; k < currentBorrowed.length; k++) {
                if (currentBorrowed[k].bookId === initialBooks[b].id) {
                    initialBooks[b].status = "borrowed";
                    break;
                }
            }
        }
        saveBooks(initialBooks);
    }

    // 2. Initialize tracking arrays if not already present
    if (!localStorage.getItem("borrowedBooks")) {
        localStorage.setItem("borrowedBooks", JSON.stringify([]));
    }
    if (!localStorage.getItem("reservations")) {
        localStorage.setItem("reservations", JSON.stringify([]));
    }
    if (!localStorage.getItem("history")) {
        localStorage.setItem("history", JSON.stringify([]));
    }

    // 3. Initialize registered users and student profile defaults if not present
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
        localStorage.setItem("users", JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem("studentName")) {
        localStorage.setItem("studentName", "Student User");
    }
    if (!localStorage.getItem("studentId")) {
        localStorage.setItem("studentId", "STU-2026-8841");
    }
}

// Data access functions
function getBooks() {
    return JSON.parse(localStorage.getItem("books")) || [];
}

function saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
}

function getBorrowedBooks() {
    return JSON.parse(localStorage.getItem("borrowedBooks")) || [];
}

function saveBorrowedBooks(borrowed) {
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));
}

function getReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || [];
}

function saveReservations(reservations) {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

function getHistory() {
    return JSON.parse(localStorage.getItem("history")) || [];
}

function saveHistory(history) {
    localStorage.setItem("history", JSON.stringify(history));
}

// Find logged-in user from registered users array in localStorage
function getLoggedInUser() {
    var users = JSON.parse(localStorage.getItem("users")) || [];
    var loggedInUserId = localStorage.getItem("loggedInUserId");
    var userEmail = localStorage.getItem("userEmail");

    for (var i = 0; i < users.length; i++) {
        if (loggedInUserId && String(users[i].id) === String(loggedInUserId)) {
            return users[i];
        }
        if (userEmail && users[i].email.toLowerCase() === userEmail.toLowerCase()) {
            return users[i];
        }
    }
    return null;
}

// ===================================================
// 4. STUDENT IDENTITY DISPLAY & SYNC
// ===================================================
function updateUserIdentityDisplay() {
    // Read from the real registered user object in localStorage
    var currentUser = getLoggedInUser();

    var studentName = currentUser ? currentUser.fullName : (localStorage.getItem("studentName") || "Student User");
    var studentId = currentUser ? currentUser.studentId : (localStorage.getItem("studentId") || "STU-2026-8841");
    var userEmail = currentUser ? currentUser.email : (localStorage.getItem("userEmail") || "student@gmail.com");
    var userRole = currentUser ? currentUser.role : (localStorage.getItem("userRole") || "user");
    var membership = currentUser && currentUser.membership ? currentUser.membership : "Active";

    // 1. Top-Right Header User Identity
    var headerName = document.getElementById("headerStudentName");
    var headerId = document.getElementById("headerStudentId");
    if (headerName) headerName.textContent = studentName;
    if (headerId) headerId.textContent = studentId;

    // 2. Welcome Banner Display
    var welcomeDisplay = document.getElementById("welcomeEmailDisplay");
    if (welcomeDisplay) welcomeDisplay.textContent = studentName;

    // 3. Profile Card Inputs & Values
    var profileHeaderName = document.getElementById("profileHeaderName");
    var profileNameInput = document.getElementById("profileFullNameInput");
    var profileIdInput = document.getElementById("profileStudentIdInput");
    var profileEmailDisplay = document.getElementById("profileEmailDisplay");
    var profileRoleDisplay = document.getElementById("profileRoleDisplay");
    var profileMembershipBadge = document.querySelector("#section-profile .badge-active");

    if (profileHeaderName) profileHeaderName.textContent = studentName;
    if (profileNameInput) profileNameInput.value = studentName;
    if (profileIdInput) profileIdInput.value = studentId;
    if (profileEmailDisplay) profileEmailDisplay.textContent = userEmail;
    if (profileMembershipBadge) profileMembershipBadge.textContent = membership;

    // Automatic role mapping (not editable by student)
    if (profileRoleDisplay) {
        if (userRole === "user") {
            profileRoleDisplay.textContent = "Student / User";
        } else if (userRole === "admin") {
            profileRoleDisplay.textContent = "Administrator";
        } else {
            profileRoleDisplay.textContent = userRole;
        }
    }
}

// ===================================================
// 5. DATE FORMATTING & OVERDUE CHECK
// ===================================================
function formatDate(dateObj) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var day = dateObj.getDate();
    if (day < 10) day = "0" + day;
    var month = months[dateObj.getMonth()];
    var year = dateObj.getFullYear();
    return day + " " + month + " " + year;
}

function isOverdue(dateStr) {
    var targetDate = new Date(dateStr);
    var now = new Date();
    return now.getTime() > targetDate.getTime();
}

// ===================================================
// 6. IN-PAGE NOTIFICATIONS
// ===================================================
function showNotification(message, type) {
    var banner = document.getElementById("notificationBanner");
    if (!banner) return;

    banner.textContent = message;
    banner.className = "notification-banner " + (type || "success");
    banner.style.display = "block";

    setTimeout(function () {
        banner.style.display = "none";
    }, 3500);
}

// ===================================================
// 7. DASHBOARD STATISTICS & OVERVIEW
// ===================================================
function renderDashboard() {
    var books = getBooks();
    var borrowed = getBorrowedBooks();
    var reservations = getReservations();

    var borrowedCount = borrowed.length;
    var reservedCount = reservations.length;

    var availableCount = 0;
    for (var i = 0; i < books.length; i++) {
        if (books[i].status === "available") {
            availableCount++;
        }
    }

    var overdueCount = 0;
    for (var j = 0; j < borrowed.length; j++) {
        if (isOverdue(borrowed[j].dueDate)) {
            overdueCount++;
        }
    }

    document.getElementById("statBorrowedCount").textContent = borrowedCount;
    document.getElementById("statReservedCount").textContent = reservedCount;
    document.getElementById("statAvailableCount").textContent = availableCount;
    document.getElementById("statOverdueCount").textContent = overdueCount;

    // Quick Loans Panel
    var summaryContainer = document.getElementById("dashboardBorrowedSummary");
    if (borrowed.length === 0) {
        summaryContainer.innerHTML = '<p style="font-size: 13px; color: var(--secondary-text);">No books currently borrowed. Browse the catalog to borrow academic books.</p>';
    } else {
        var summaryHtml = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        for (var k = 0; k < borrowed.length && k < 3; k++) {
            var item = borrowed[k];
            var isLate = isOverdue(item.dueDate);
            var statusBadge = isLate 
                ? '<span class="badge-overdue">Overdue</span>' 
                : '<span class="badge-active">Due: ' + item.dueDate + '</span>';

            summaryHtml += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px;">' +
                '<div><strong>' + item.title + '</strong><br><span style="color: var(--secondary-text);">' + item.author + '</span></div>' +
                '<div>' + statusBadge + '</div>' +
                '</div>';
        }
        summaryHtml += '</div>';
        summaryContainer.innerHTML = summaryHtml;
    }
}

// ===================================================
// 8. BROWSE BOOKS (SEARCH & FILTER)
// ===================================================
function renderBooks() {
    var booksGrid = document.getElementById("booksGrid");
    var searchInput = document.getElementById("searchInput");
    var categoryFilter = document.getElementById("categoryFilter");

    var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var selectedCategory = categoryFilter ? categoryFilter.value : "All Categories";

    var books = getBooks();
    var borrowed = getBorrowedBooks();
    var reservations = getReservations();

    var html = "";
    var matchCount = 0;

    for (var i = 0; i < books.length; i++) {
        var book = books[i];

        // 1. Category Filter
        if (selectedCategory !== "All Categories" && book.category !== selectedCategory) {
            continue;
        }

        // 2. Search Filter (title or author)
        var titleMatch = book.title.toLowerCase().indexOf(searchTerm) !== -1;
        var authorMatch = book.author.toLowerCase().indexOf(searchTerm) !== -1;

        if (searchTerm !== "" && !titleMatch && !authorMatch) {
            continue;
        }

        matchCount++;

        // 3. Check Borrow Status for this User
        var isBorrowedByMe = false;
        var myDueDate = "";
        for (var b = 0; b < borrowed.length; b++) {
            if (borrowed[b].bookId === book.id) {
                isBorrowedByMe = true;
                myDueDate = borrowed[b].dueDate;
                break;
            }
        }

        // 4. Check Reservation Status for this User
        var isReservedByMe = false;
        for (var r = 0; r < reservations.length; r++) {
            if (reservations[r].bookId === book.id) {
                isReservedByMe = true;
                break;
            }
        }

        // 5. Availability Badge & Button
        var availabilityBadge = "";
        var actionButton = "";

        if (book.status === "available") {
            availabilityBadge = '<div class="book-availability status-available"><span class="availability-dot"></span>✓ Available</div>';
            actionButton = '<button type="button" class="btn btn-primary" onclick="borrowBook(' + book.id + ')">Borrow Book</button>';
        } else {
            availabilityBadge = '<div class="book-availability status-borrowed"><span class="availability-dot"></span>Currently Borrowed</div>';

            if (isBorrowedByMe) {
                actionButton = '<button type="button" class="btn btn-outline" disabled style="opacity: 0.8; cursor: default;">Borrowed (Due: ' + myDueDate + ')</button>';
            } else if (isReservedByMe) {
                actionButton = '<button type="button" class="btn btn-outline" disabled style="opacity: 0.8; cursor: default;">Reserved</button>';
            } else {
                actionButton = '<button type="button" class="btn btn-outline" onclick="reserveBook(' + book.id + ')">Reserve Book</button>';
            }
        }

        // 6. Build Book Card HTML
        html += '<div class="book-card">' +
            '<div class="book-cover">' +
                '<div class="book-cover-top">' +
                    '<span class="book-category-tag">' + book.category + '</span>' +
                    '<span class="book-emblem">📖</span>' +
                '</div>' +
                '<div class="book-isbn-tag">ISBN: ' + book.isbn + '</div>' +
            '</div>' +
            '<div class="book-body">' +
                '<h3 class="book-title">' + book.title + '</h3>' +
                '<div class="book-author">by ' + book.author + '</div>' +
                availabilityBadge +
            '</div>' +
            '<div class="book-actions">' +
                actionButton +
            '</div>' +
        '</div>';
    }

    if (matchCount === 0) {
        html = '<div class="empty-state" style="grid-column: 1 / -1;">' +
            '<span class="empty-state-icon">🔍</span>' +
            '<h4>No Books Found</h4>' +
            '<p>No catalog titles match your search criteria. Try a different query or click "Clear Filters".</p>' +
        '</div>';
    }

    booksGrid.innerHTML = html;
}

// ===================================================
// 9. BORROW BOOK
// ===================================================
function borrowBook(bookId) {
    var books = getBooks();
    var targetBook = null;

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            targetBook = books[i];
            break;
        }
    }

    if (!targetBook || targetBook.status !== "available") {
        showNotification("Unable to borrow this book.", "error");
        return;
    }

    // Update book status
    targetBook.status = "borrowed";
    saveBooks(books);

    // Compute dates: 14 days loan period
    var today = new Date();
    var dueDateObj = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

    var borrowDateStr = formatDate(today);
    var dueDateStr = formatDate(dueDateObj);

    // Add to borrowed books
    var borrowedList = getBorrowedBooks();
    borrowedList.push({
        bookId: targetBook.id,
        title: targetBook.title,
        author: targetBook.author,
        category: targetBook.category,
        isbn: targetBook.isbn,
        borrowDate: borrowDateStr,
        dueDate: dueDateStr,
        status: "Active"
    });
    saveBorrowedBooks(borrowedList);

    // Clear hold if user previously had reserved it
    var reservations = getReservations();
    var updatedReservations = [];
    for (var r = 0; r < reservations.length; r++) {
        if (reservations[r].bookId !== bookId) {
            updatedReservations.push(reservations[r]);
        }
    }
    saveReservations(updatedReservations);

    // Log to History
    var history = getHistory();
    history.push({
        bookId: targetBook.id,
        title: targetBook.title,
        author: targetBook.author,
        borrowDate: borrowDateStr,
        returnDueDate: dueDateStr,
        status: "Borrowed"
    });
    saveHistory(history);

    showNotification("Book borrowed successfully.", "success");

    renderBooks();
    renderDashboard();
    renderMyBooks();
    renderHistory();
}

// ===================================================
// 10. RESERVE BOOK
// ===================================================
function reserveBook(bookId) {
    var books = getBooks();
    var targetBook = null;

    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            targetBook = books[i];
            break;
        }
    }

    if (!targetBook) {
        showNotification("Book not found.", "error");
        return;
    }

    var reservations = getReservations();

    // Prevent duplicate reservations
    for (var j = 0; j < reservations.length; j++) {
        if (reservations[j].bookId === bookId) {
            showNotification("You have already reserved this book.", "warning");
            return;
        }
    }

    reservations.push({
        bookId: targetBook.id,
        title: targetBook.title,
        author: targetBook.author,
        category: targetBook.category,
        reservationDate: formatDate(new Date()),
        status: "Waiting"
    });
    saveReservations(reservations);

    showNotification("Book reserved successfully.", "success");

    renderBooks();
    renderDashboard();
    renderReservations();
}

// ===================================================
// 11. RETURN BOOK
// ===================================================
function returnBook(bookId) {
    var borrowedList = getBorrowedBooks();
    var updatedBorrowed = [];
    var returnedItem = null;

    for (var i = 0; i < borrowedList.length; i++) {
        if (borrowedList[i].bookId === bookId) {
            returnedItem = borrowedList[i];
        } else {
            updatedBorrowed.push(borrowedList[i]);
        }
    }

    if (!returnedItem) return;

    saveBorrowedBooks(updatedBorrowed);

    // Make book available in catalog
    var books = getBooks();
    for (var j = 0; j < books.length; j++) {
        if (books[j].id === bookId) {
            books[j].status = "available";
            break;
        }
    }
    saveBooks(books);

    // Update history entry
    var history = getHistory();
    for (var h = 0; h < history.length; h++) {
        if (history[h].bookId === bookId && history[h].status === "Borrowed") {
            history[h].status = "Returned (" + formatDate(new Date()) + ")";
            break;
        }
    }
    saveHistory(history);

    showNotification("Book returned successfully.", "success");

    renderBooks();
    renderDashboard();
    renderMyBooks();
    renderHistory();
}

// ===================================================
// 12. CANCEL RESERVATION
// ===================================================
function cancelReservation(bookId) {
    var reservations = getReservations();
    var updated = [];

    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].bookId !== bookId) {
            updated.push(reservations[i]);
        }
    }

    saveReservations(updated);
    showNotification("Reservation cancelled.", "info");

    renderBooks();
    renderDashboard();
    renderReservations();
}

// ===================================================
// 13. RENDER MY BOOKS
// ===================================================
function renderMyBooks() {
    var container = document.getElementById("myBooksList");
    var borrowed = getBorrowedBooks();

    if (borrowed.length === 0) {
        container.innerHTML = '<div class="empty-state">' +
            '<span class="empty-state-icon">📑</span>' +
            '<h4>No Borrowed Books</h4>' +
            '<p>You have not checked out any books yet. Browse the catalog to borrow available books.</p>' +
            '<button class="btn btn-primary" onclick="switchSection(\'books\')">Browse Books</button>' +
        '</div>';
        return;
    }

    var html = "";
    for (var i = 0; i < borrowed.length; i++) {
        var item = borrowed[i];
        var isLate = isOverdue(item.dueDate);
        var statusBadge = isLate
            ? '<span class="badge-overdue">Overdue</span>'
            : '<span class="badge-active">Active</span>';

        html += '<div class="item-card">' +
            '<div class="item-info">' +
                '<h4>' + item.title + '</h4>' +
                '<p>by ' + item.author + ' &bull; ' + item.category + '</p>' +
                '<div class="item-meta">' +
                    '<span class="meta-badge">Borrowed: ' + item.borrowDate + '</span>' +
                    '<span class="meta-badge">Due: ' + item.dueDate + '</span>' +
                    '<span>' + statusBadge + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="item-actions">' +
                '<button type="button" class="btn btn-outline" onclick="returnBook(' + item.bookId + ')">Return Book</button>' +
            '</div>' +
        '</div>';
    }

    container.innerHTML = html;
}

// ===================================================
// 14. RENDER RESERVATIONS
// ===================================================
function renderReservations() {
    var container = document.getElementById("reservationsList");
    var reservations = getReservations();

    if (reservations.length === 0) {
        container.innerHTML = '<div class="empty-state">' +
            '<span class="empty-state-icon">🔖</span>' +
            '<h4>No Active Reservations</h4>' +
            '<p>You have not placed any books on hold. When books are checked out by others, you can reserve them here.</p>' +
            '<button class="btn btn-outline" onclick="switchSection(\'books\')">View Catalog</button>' +
        '</div>';
        return;
    }

    var html = "";
    for (var i = 0; i < reservations.length; i++) {
        var item = reservations[i];
        html += '<div class="item-card">' +
            '<div class="item-info">' +
                '<h4>' + item.title + '</h4>' +
                '<p>by ' + item.author + ' &bull; ' + item.category + '</p>' +
                '<div class="item-meta">' +
                    '<span class="meta-badge">Reserved on: ' + item.reservationDate + '</span>' +
                    '<span class="badge-waiting">Status: Waiting</span>' +
                '</div>' +
            '</div>' +
            '<div class="item-actions">' +
                '<button type="button" class="btn btn-outline" onclick="cancelReservation(' + item.bookId + ')">Cancel</button>' +
            '</div>' +
        '</div>';
    }

    container.innerHTML = html;
}

// ===================================================
// 15. RENDER BORROWING HISTORY
// ===================================================
function renderHistory() {
    var tbody = document.getElementById("historyTableBody");
    var history = getHistory();

    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--secondary-text); padding: 30px;">No borrowing activity recorded yet.</td></tr>';
        return;
    }

    var html = "";
    for (var i = history.length - 1; i >= 0; i--) {
        var item = history[i];
        var statusBadge = "";
        if (item.status === "Borrowed") {
            statusBadge = '<span class="badge-active">Borrowed</span>';
        } else {
            statusBadge = '<span class="badge" style="background-color: var(--secondary-bg); color: var(--text);">' + item.status + '</span>';
        }

        html += '<tr>' +
            '<td><strong>' + item.title + '</strong><br><span style="font-size: 12px; color: var(--secondary-text);">' + item.author + '</span></td>' +
            '<td>' + item.borrowDate + '</td>' +
            '<td>' + item.returnDueDate + '</td>' +
            '<td>' + statusBadge + '</td>' +
        '</tr>';
    }

    tbody.innerHTML = html;
}

// ===================================================
// 16. TAB NAVIGATION SWITCHER
// ===================================================
function switchSection(sectionName) {
    var sidebarItems = document.querySelectorAll(".sidebar-item");
    for (var i = 0; i < sidebarItems.length; i++) {
        var link = sidebarItems[i].querySelector("a");
        if (link && link.getAttribute("data-section") === sectionName) {
            sidebarItems[i].classList.add("active");
        } else {
            sidebarItems[i].classList.remove("active");
        }
    }

    var sections = document.querySelectorAll(".dashboard-section");
    for (var j = 0; j < sections.length; j++) {
        if (sections[j].id === "section-" + sectionName) {
            sections[j].classList.add("active-section");
        } else {
            sections[j].classList.remove("active-section");
        }
    }

    if (sectionName === "dashboard") {
        renderDashboard();
    } else if (sectionName === "books") {
        renderBooks();
    } else if (sectionName === "my-books") {
        renderMyBooks();
    } else if (sectionName === "reservations") {
        renderReservations();
    } else if (sectionName === "history") {
        renderHistory();
    } else if (sectionName === "profile") {
        updateUserIdentityDisplay();
    }

    // Reset vertical scroll position for main content
    var mainContent = document.querySelector(".main-content");
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    window.scrollTo(0, 0);
}

// ===================================================
// 17. PAGE INITIALIZATION ON DOM LOAD
// ===================================================
document.addEventListener("DOMContentLoaded", function () {

    // 1. Initialize localStorage data
    initStorage();

    // 2. Display student profile information & sync identity
    updateUserIdentityDisplay();

    // 3. Setup Sidebar Navigation
    var navLinks = document.querySelectorAll(".sidebar-menu a");
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function (event) {
            event.preventDefault();
            var targetSection = this.getAttribute("data-section");
            if (targetSection) {
                switchSection(targetSection);
            }
        });
    }

    // 4. Setup In-Page Shortcut Switches
    var switchLinks = document.querySelectorAll("[data-switch]");
    for (var s = 0; s < switchLinks.length; s++) {
        switchLinks[s].addEventListener("click", function () {
            var target = this.getAttribute("data-switch");
            if (target) {
                switchSection(target);
            }
        });
    }

    // 5. Setup Live Search & Category Filtering
    var searchInput = document.getElementById("searchInput");
    var categoryFilter = document.getElementById("categoryFilter");
    var clearFiltersBtn = document.getElementById("clearFiltersBtn");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            renderBooks();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", function () {
            renderBooks();
        });
    }

    // 6. Clear Filters Button Handler
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            if (categoryFilter) categoryFilter.value = "All Categories";
            renderBooks();
        });
    }

    // 7. Profile Form Submit (Save Changes)
    var profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var nameInput = document.getElementById("profileFullNameInput");
            var idInput = document.getElementById("profileStudentIdInput");

            var newName = nameInput ? nameInput.value.trim() : "";
            var newId = idInput ? idInput.value.trim() : "";

            // Simple validation
            if (newName === "" || newId === "") {
                showNotification("Please enter your name and student ID.", "warning");
                return;
            }

            // Update the user record in localStorage users array
            var users = JSON.parse(localStorage.getItem("users")) || [];
            var loggedInUserId = localStorage.getItem("loggedInUserId");
            var userEmail = localStorage.getItem("userEmail");

            for (var u = 0; u < users.length; u++) {
                if ((loggedInUserId && String(users[u].id) === String(loggedInUserId)) ||
                    (userEmail && users[u].email.toLowerCase() === userEmail.toLowerCase())) {
                    users[u].fullName = newName;
                    users[u].studentId = newId;
                    break;
                }
            }
            localStorage.setItem("users", JSON.stringify(users));

            // Also keep legacy session variables updated
            localStorage.setItem("studentName", newName);
            localStorage.setItem("studentId", newId);

            // Immediately update header, welcome text, and profile card
            updateUserIdentityDisplay();

            // Provide visual feedback
            showNotification("Profile updated successfully.", "success");
        });
    }

    // 8. Logout Handlers
    function handleLogout() {
        localStorage.removeItem("loggedInUserId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("studentName");
        localStorage.removeItem("studentId");
        window.location.href = "index.html";
    }

    var logoutBtn = document.getElementById("logoutBtn");
    var sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener("click", handleLogout);

    // 9. Initial Render of Dashboard Views
    renderDashboard();
    renderBooks();
    renderMyBooks();
    renderReservations();
    renderHistory();

});

// Global window assignments for inline onclick actions
window.borrowBook = borrowBook;
window.reserveBook = reserveBook;
window.returnBook = returnBook;
window.cancelReservation = cancelReservation;
window.switchSection = switchSection;
