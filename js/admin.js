/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Admin Dashboard Script (admin.js)
   Complete Phase 3 Administrator Functionality
=================================================== */

// ===================================================
// 1. ROLE-BASED ACCESS PROTECTION
// ===================================================
// Only users with userRole === "admin" are allowed.
var currentRole = localStorage.getItem("userRole");

if (currentRole !== "admin") {
    // If not logged in as administrator, redirect to login page immediately
    window.location.href = "index.html";
}

// ===================================================
// 2. SHARED INITIAL CATALOG DATA (35 BOOKS)
// ===================================================
// Identical dataset as user.js to ensure shared synchronization
var initialBooks = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", isbn: "9780132350884", status: "available" },
    { id: 2, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Algorithms", isbn: "9780262033848", status: "available" },
    { id: 3, title: "Database System Concepts", author: "Abraham Silberschatz", category: "Database", isbn: "9780073523323", status: "available" },
    { id: 4, title: "JavaScript: The Definitive Guide", author: "David Flanagan", category: "Web Development", isbn: "9781491952023", status: "available" },
    { id: 5, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", category: "Artificial Intelligence", isbn: "9780136042594", status: "available" },
    { id: 6, title: "Hands-On Machine Learning", author: "Aurélien Géron", category: "Machine Learning", isbn: "9781492032649", status: "available" },
    { id: 7, title: "Python Crash Course", author: "Eric Matthes", category: "Programming", isbn: "9781593279288", status: "available" },
    { id: 8, title: "Computer Networks", author: "Andrew S. Tanenbaum", category: "Computer Networks", isbn: "9780132126953", status: "available" },
    { id: 9, title: "Operating System Concepts", author: "Abraham Silberschatz", category: "Operating Systems", isbn: "9781119800361", status: "available" },
    { id: 10, title: "Design Patterns", author: "Erich Gamma & Ralph Johnson", category: "Software Engineering", isbn: "9780201633610", status: "available" },
    { id: 11, title: "The Pragmatic Programmer", author: "Andrew Hunt & David Thomas", category: "Programming", isbn: "9780201616224", status: "borrowed" },
    { id: 12, title: "Head First Java", author: "Kathy Sierra & Bert Bates", category: "Programming", isbn: "9780596009205", status: "available" },
    { id: 13, title: "Learning SQL", author: "Alan Beaulieu", category: "Database", isbn: "9781492057611", status: "available" },
    { id: 14, title: "Don't Make Me Think", author: "Steve Krug", category: "Web Development", isbn: "9780321965516", status: "available" },
    { id: 15, title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Web Development", isbn: "9781593279509", status: "available" },
    { id: 16, title: "Deep Learning", author: "Ian Goodfellow & Yoshua Bengio", category: "Artificial Intelligence", isbn: "9780262035613", status: "available" },
    { id: 17, title: "Pattern Recognition and Machine Learning", author: "Christopher Bishop", category: "Machine Learning", isbn: "9780387310732", status: "available" },
    { id: 18, title: "Data Structures and Algorithms in Java", author: "Robert Lafore", category: "Computer Science", isbn: "9780672324536", status: "available" },
    { id: 19, title: "Modern Operating Systems", author: "Andrew S. Tanenbaum", category: "Operating Systems", isbn: "9780133591620", status: "available" },
    { id: 20, title: "Computer Organization and Design", author: "David Patterson & John Hennessy", category: "Computer Science", isbn: "9780128122754", status: "available" },
    { id: 21, title: "Software Engineering", author: "Ian Sommerville", category: "Software Engineering", isbn: "9780133943030", status: "available" },
    { id: 22, title: "Computer Security: Principles & Practice", author: "William Stallings", category: "Cyber Security", isbn: "9780134772806", status: "available" },
    { id: 23, title: "Cloud Computing: Principles & Paradigms", author: "Rajkumar Buyya", category: "Cloud Computing", isbn: "9780470887998", status: "available" },
    { id: 24, title: "Reinforcement Learning", author: "Richard S. Sutton & Andrew Barto", category: "Artificial Intelligence", isbn: "9780262039246", status: "available" },
    { id: 25, title: "The C Programming Language", author: "Brian Kernighan & Dennis Ritchie", category: "Programming", isbn: "9780131103627", status: "available" },
    { id: 26, title: "Effective Java", author: "Joshua Bloch", category: "Programming", isbn: "9780134685991", status: "available" },
    { id: 27, title: "C++ Primer", author: "Stanley Lippman", category: "Programming", isbn: "9780321714114", status: "available" },
    { id: 28, title: "Web Design with HTML, CSS, JavaScript", author: "Jon Duckett", category: "Web Development", isbn: "9781118008188", status: "available" },
    { id: 29, title: "Algorithms", author: "Robert Sedgewick & Kevin Wayne", category: "Algorithms", isbn: "9780321573513", status: "available" },
    { id: 30, title: "Introduction to Data Mining", author: "Pang-Ning Tan", category: "Data Science", isbn: "9780133128901", status: "available" },
    { id: 31, title: "Fundamentals of Database Systems", author: "Ramez Elmasri & Shamkant Navathe", category: "Database", isbn: "9780133970777", status: "available" },
    { id: 32, title: "Artificial Intelligence For Dummies", author: "John Paul Mueller", category: "Artificial Intelligence", isbn: "9781119796763", status: "available" },
    { id: 33, title: "Discrete Mathematics and Its Applications", author: "Kenneth H. Rosen", category: "Mathematics", isbn: "9780073383095", status: "available" },
    { id: 34, title: "Python Data Science Handbook", author: "Jake VanderPlas", category: "Data Science", isbn: "9781491912058", status: "available" },
    { id: 35, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", isbn: "9780061120084", status: "available" }
];

// ===================================================
// 3. STORAGE INITIALIZATION & ACCESS HELPERS
// ===================================================

function initStorage() {
    // Initialize or load books safely
    var storedBooks = null;
    try {
        storedBooks = JSON.parse(localStorage.getItem("books"));
    } catch (e) {
        storedBooks = null;
    }

    if (!storedBooks || storedBooks.length < 30) {
        var currentBorrowed = getBorrowedBooks();
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

    if (!localStorage.getItem("borrowedBooks")) {
        localStorage.setItem("borrowedBooks", JSON.stringify([]));
    }
    if (!localStorage.getItem("reservations")) {
        localStorage.setItem("reservations", JSON.stringify([]));
    }
    if (!localStorage.getItem("history")) {
        localStorage.setItem("history", JSON.stringify([]));
    }
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

// Data access helpers (SHARED with user.js)
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

// Retrieve registered users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Save registered users to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ===================================================
// ADMIN IDENTITY & PROFILE HELPERS
// ===================================================

// Find the currently logged-in administrator from localStorage users array
function getLoggedInAdmin() {
    var users = getUsers();
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

// Display and synchronize administrator profile & top-right header identity
function updateAdminIdentityDisplay() {
    var currentAdmin = getLoggedInAdmin();

    var adminName = currentAdmin ? currentAdmin.fullName : "Library Administrator";
    var adminId = currentAdmin ? currentAdmin.studentId : "ADMIN001";
    var adminEmail = currentAdmin ? currentAdmin.email : (localStorage.getItem("userEmail") || "admin@gmail.com");

    // 1. Top-Right Header Admin Identity
    var headerName = document.getElementById("adminHeaderName");
    var headerId = document.getElementById("adminHeaderId");
    if (headerName) headerName.textContent = adminName;
    if (headerId) headerId.textContent = adminId;

    // 2. Profile Card Inputs & Displays
    var profileHeaderName = document.getElementById("adminProfileHeaderName");
    var profileFullName = document.getElementById("adminProfileFullName");
    var profileAdminId = document.getElementById("adminProfileAdminId");
    var profileEmail = document.getElementById("adminProfileEmail");
    var profileRoleDisplay = document.getElementById("adminProfileRoleDisplay");

    if (profileHeaderName) profileHeaderName.textContent = adminName;
    if (profileFullName) profileFullName.value = adminName;
    if (profileAdminId) profileAdminId.value = adminId;
    if (profileEmail) profileEmail.value = adminEmail;
    if (profileRoleDisplay) profileRoleDisplay.textContent = "Administrator";
}

// Save Administrator Profile Changes
function handleSaveAdminProfile(event) {
    event.preventDefault();

    var currentAdmin = getLoggedInAdmin();
    if (!currentAdmin) return;

    var nameInput = document.getElementById("adminProfileFullName");
    var idInput = document.getElementById("adminProfileAdminId");
    var emailInput = document.getElementById("adminProfileEmail");

    var newName = nameInput ? nameInput.value.trim() : "";
    var newId = idInput ? idInput.value.trim() : "";
    var newEmail = emailInput ? emailInput.value.trim() : "";

    // 1. Validate non-empty fields
    if (newName === "" || newId === "" || newEmail === "") {
        showNotification("Please complete all required fields.", "warning");
        return;
    }

    // 2. Validate email format
    if (newEmail.indexOf("@") === -1 || newEmail.indexOf(".") === -1) {
        showNotification("Please enter a valid email address.", "warning");
        return;
    }

    var users = getUsers();

    // 3. Check if email is already registered by another account
    for (var i = 0; i < users.length; i++) {
        if (users[i].id !== currentAdmin.id && users[i].email.toLowerCase() === newEmail.toLowerCase()) {
            showNotification("That email is already registered.", "warning");
            return;
        }
    }

    // 4. Check if Admin ID is already registered by another account
    for (var j = 0; j < users.length; j++) {
        if (users[j].id !== currentAdmin.id && users[j].studentId.toLowerCase() === newId.toLowerCase()) {
            showNotification("This Admin ID is already registered.", "warning");
            return;
        }
    }

    // 5. Update administrator object in users array
    for (var k = 0; k < users.length; k++) {
        if (users[k].id === currentAdmin.id) {
            users[k].fullName = newName;
            users[k].studentId = newId;
            users[k].email = newEmail;
            break;
        }
    }

    // 6. Save back to localStorage
    saveUsers(users);

    // 7. Update session email
    localStorage.setItem("userEmail", newEmail);

    // 8. Immediately update header, profile display, and user management table
    updateAdminIdentityDisplay();
    renderUsers();
    renderDashboard();

    // 9. Show success notification
    showNotification("Profile updated successfully.", "success");
}

// ===================================================
// 4. DATE FORMATTING & OVERDUE CALCULATION
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
    var target = new Date(dateStr);
    var now = new Date();
    return now.getTime() > target.getTime();
}

function getDaysOverdue(dateStr) {
    var target = new Date(dateStr).getTime();
    var now = new Date().getTime();
    var diff = now - target;
    if (diff <= 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ===================================================
// 5. IN-PAGE NOTIFICATIONS
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
// 6. DASHBOARD STATISTICS & RECENT ACTIVITY
// ===================================================
function renderDashboard() {
    var books = getBooks();
    var borrowed = getBorrowedBooks();
    var reservations = getReservations();
    var users = getUsers();
    var history = getHistory();

    var totalBooks = books.length;
    var borrowedCount = borrowed.length;
    var reservationsCount = reservations.length;
    var totalUsersCount = users.length;

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

    // Update statistical counters
    document.getElementById("statTotalBooks").textContent = totalBooks;
    document.getElementById("statAvailableBooks").textContent = availableCount;
    document.getElementById("statBorrowedBooks").textContent = borrowedCount;
    document.getElementById("statTotalUsers").textContent = totalUsersCount;
    document.getElementById("statReservations").textContent = reservationsCount;
    document.getElementById("statOverdueBooks").textContent = overdueCount;

    // Render Recent Library Activity
    var activityContainer = document.getElementById("recentActivityList");
    var studentName = localStorage.getItem("studentName") || "Student User";

    var activityItems = [];

    // History activities
    for (var h = history.length - 1; h >= 0 && activityItems.length < 5; h--) {
        var hItem = history[h];
        activityItems.push({
            text: studentName + " " + (hItem.status === "Borrowed" ? "borrowed" : "returned") + " \"" + hItem.title + "\"",
            date: hItem.borrowDate
        });
    }

    // Reservation activities
    for (var r = reservations.length - 1; r >= 0 && activityItems.length < 6; r--) {
        var rItem = reservations[r];
        activityItems.push({
            text: studentName + " reserved \"" + rItem.title + "\"",
            date: rItem.reservationDate
        });
    }

    if (activityItems.length === 0) {
        activityContainer.innerHTML = '<p style="font-size: 13px; color: var(--secondary-text); padding: 10px 0;">No recent activity.</p>';
    } else {
        var html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        for (var a = 0; a < activityItems.length; a++) {
            html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px;">' +
                '<div><span style="color: var(--primary-green); font-weight: 700;">&bull;</span> ' + activityItems[a].text + '</div>' +
                '<div style="font-size: 12px; color: var(--secondary-text);">' + activityItems[a].date + '</div>' +
                '</div>';
        }
        html += '</div>';
        activityContainer.innerHTML = html;
    }
}

// ===================================================
// 7. MANAGE BOOKS (SEARCH, FILTER & TABLE)
// ===================================================
function renderBooks() {
    var tbody = document.getElementById("adminBooksTableBody");
    var searchInput = document.getElementById("adminBookSearch");
    var categoryFilter = document.getElementById("adminCategoryFilter");

    var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var selectedCategory = categoryFilter ? categoryFilter.value : "All Categories";

    var books = getBooks();
    var html = "";
    var count = 0;

    for (var i = 0; i < books.length; i++) {
        var book = books[i];

        // 1. Category Filter
        if (selectedCategory !== "All Categories" && book.category !== selectedCategory) {
            continue;
        }

        // 2. Search Filter (Title, Author, or ISBN)
        var titleMatch = book.title.toLowerCase().indexOf(searchTerm) !== -1;
        var authorMatch = book.author.toLowerCase().indexOf(searchTerm) !== -1;
        var isbnMatch = book.isbn ? book.isbn.indexOf(searchTerm) !== -1 : false;

        if (searchTerm !== "" && !titleMatch && !authorMatch && !isbnMatch) {
            continue;
        }

        count++;

        var statusBadge = (book.status === "available")
            ? '<span class="badge-available">Available</span>'
            : '<span class="badge-borrowed">Borrowed</span>';

        html += '<tr>' +
            '<td><strong>' + book.title + '</strong></td>' +
            '<td>' + book.author + '</td>' +
            '<td><span class="badge" style="background-color: var(--secondary-bg);">' + book.category + '</span></td>' +
            '<td style="font-family: monospace; font-size: 12px;">' + book.isbn + '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td style="text-align: right;">' +
                '<div class="table-actions" style="justify-content: flex-end;">' +
                    '<button type="button" class="btn-sm btn-edit" onclick="openEditBookModal(' + book.id + ')">Edit</button>' +
                    '<button type="button" class="btn-sm btn-delete" onclick="openDeleteBookModal(' + book.id + ')">Delete</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }

    if (count === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--secondary-text); padding: 30px;">No books found matching your criteria.</td></tr>';
    } else {
        tbody.innerHTML = html;
    }
}

// ===================================================
// 8. ADD & EDIT BOOK MODALS
// ===================================================
function openAddBookModal() {
    document.getElementById("modalHeaderTitle").textContent = "Add New Book";
    document.getElementById("modalBookId").value = "";
    document.getElementById("modalTitle").value = "";
    document.getElementById("modalAuthor").value = "";
    document.getElementById("modalCategory").value = "Programming";
    document.getElementById("modalIsbn").value = "";
    document.getElementById("modalStatus").value = "available";

    document.getElementById("bookModal").classList.add("show-modal");
}

function openEditBookModal(bookId) {
    var books = getBooks();
    var target = null;
    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            target = books[i];
            break;
        }
    }

    if (!target) return;

    document.getElementById("modalHeaderTitle").textContent = "Edit Book Details";
    document.getElementById("modalBookId").value = target.id;
    document.getElementById("modalTitle").value = target.title;
    document.getElementById("modalAuthor").value = target.author;
    document.getElementById("modalCategory").value = target.category;
    document.getElementById("modalIsbn").value = target.isbn;
    document.getElementById("modalStatus").value = target.status;

    document.getElementById("bookModal").classList.add("show-modal");
}

function closeBookModal() {
    document.getElementById("bookModal").classList.remove("show-modal");
}

// Save Book (Add or Edit)
function handleSaveBook(event) {
    event.preventDefault();

    var idField = document.getElementById("modalBookId").value;
    var title = document.getElementById("modalTitle").value.trim();
    var author = document.getElementById("modalAuthor").value.trim();
    var category = document.getElementById("modalCategory").value;
    var isbn = document.getElementById("modalIsbn").value.trim();
    var status = document.getElementById("modalStatus").value;

    if (title === "" || author === "" || isbn === "") {
        showNotification("Please fill in all required fields.", "warning");
        return;
    }

    var books = getBooks();

    if (idField === "") {
        // ADD NEW BOOK
        var newId = Date.now();
        var newBook = {
            id: newId,
            title: title,
            author: author,
            category: category,
            isbn: isbn,
            status: status
        };
        books.unshift(newBook); // add to top of catalog
        saveBooks(books);
        showNotification("Book added successfully.", "success");
    } else {
        // EDIT EXISTING BOOK
        var bookId = parseInt(idField);
        for (var i = 0; i < books.length; i++) {
            if (books[i].id === bookId) {
                books[i].title = title;
                books[i].author = author;
                books[i].category = category;
                books[i].isbn = isbn;
                books[i].status = status;
                break;
            }
        }
        saveBooks(books);
        showNotification("Book updated successfully.", "success");
    }

    closeBookModal();
    renderBooks();
    renderDashboard();
    renderReports();
}

// ===================================================
// 9. DELETE BOOK MODAL & LOGIC
// ===================================================
function openDeleteBookModal(bookId) {
    var books = getBooks();
    var target = null;
    for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            target = books[i];
            break;
        }
    }

    if (!target) return;

    // Safety check: Cannot delete book if currently borrowed
    if (target.status === "borrowed") {
        showNotification("This book is currently borrowed and cannot be deleted.", "warning");
        return;
    }

    var borrowed = getBorrowedBooks();
    for (var b = 0; b < borrowed.length; b++) {
        if (borrowed[b].bookId === bookId) {
            showNotification("This book is currently borrowed and cannot be deleted.", "warning");
            return;
        }
    }

    // Set delete modal fields
    document.getElementById("deleteBookId").value = target.id;
    document.getElementById("deleteBookTitle").textContent = target.title + " (by " + target.author + ")";
    document.getElementById("deleteModal").classList.add("show-modal");
}

function closeDeleteModal() {
    document.getElementById("deleteModal").classList.remove("show-modal");
}

function handleConfirmDelete() {
    var bookId = parseInt(document.getElementById("deleteBookId").value);
    var books = getBooks();
    var updated = [];

    for (var i = 0; i < books.length; i++) {
        if (books[i].id !== bookId) {
            updated.push(books[i]);
        }
    }

    saveBooks(updated);
    closeDeleteModal();
    showNotification("Book deleted successfully.", "success");

    renderBooks();
    renderDashboard();
    renderReports();
}

// ===================================================
// 10. MANAGE USERS (SEARCH, FILTER & TABLE)
// ===================================================
function renderUsers() {
    var tbody = document.getElementById("adminUsersTableBody");
    var searchInput = document.getElementById("adminUserSearch");
    var roleFilter = document.getElementById("adminUserRoleFilter");

    var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var selectedRole = roleFilter ? roleFilter.value : "All Roles";

    var users = getUsers();
    var html = "";
    var count = 0;

    for (var i = 0; i < users.length; i++) {
        var u = users[i];

        // 1. Role Filter
        if (selectedRole !== "All Roles" && u.role !== selectedRole) {
            continue;
        }

        // 2. Search Filter (Full Name, Student ID, Email)
        var nameMatch = u.fullName ? u.fullName.toLowerCase().indexOf(searchTerm) !== -1 : false;
        var idMatch = u.studentId ? u.studentId.toLowerCase().indexOf(searchTerm) !== -1 : false;
        var emailMatch = u.email ? u.email.toLowerCase().indexOf(searchTerm) !== -1 : false;

        if (searchTerm !== "" && !nameMatch && !idMatch && !emailMatch) {
            continue;
        }

        count++;

        // Friendly role label and badge style
        var roleLabel = u.role === "admin" ? "Administrator" : "Student / User";
        var roleBadge = u.role === "admin" 
            ? '<span class="badge" style="background-color: #E6EAE4; color: var(--dark-green); font-weight: 700; border: 1px solid var(--border);">Administrator</span>'
            : '<span class="badge" style="background-color: var(--light-green); color: var(--dark-green); font-weight: 600;">Student / User</span>';
        var membershipStatus = u.membership || "Active";

        html += '<tr>' +
            '<td><strong>' + u.fullName + '</strong></td>' +
            '<td><code>' + u.studentId + '</code></td>' +
            '<td>' + u.email + '</td>' +
            '<td>' + roleBadge + '</td>' +
            '<td><span class="badge-available">' + membershipStatus + '</span></td>' +
            '<td style="text-align: right;">' +
                '<div class="table-actions" style="justify-content: flex-end;">' +
                    '<button type="button" class="btn-sm btn-edit" onclick="openEditUserModal(' + u.id + ')">Edit</button>' +
                    '<button type="button" class="btn-sm btn-delete" onclick="openDeleteUserModal(' + u.id + ')">Delete</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }

    if (count === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--secondary-text); padding: 30px;">No registered users found matching your criteria.</td></tr>';
    } else {
        tbody.innerHTML = html;
    }
}

// ===================================================
// USER EDIT & DELETE MODALS
// ===================================================

function openEditUserModal(userId) {
    var users = getUsers();
    var target = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            target = users[i];
            break;
        }
    }

    if (!target) return;

    // Fill form fields
    document.getElementById("editUserId").value = target.id;
    document.getElementById("editUserFullName").value = target.fullName;
    document.getElementById("editUserStudentId").value = target.studentId;
    document.getElementById("editUserEmail").value = target.email;
    document.getElementById("editUserRole").value = target.role;
    document.getElementById("editUserMembership").value = target.membership || "Active";

    var errorBox = document.getElementById("userEditErrorBox");
    if (errorBox) {
        errorBox.textContent = "";
        errorBox.style.display = "none";
    }

    document.getElementById("userEditModal").classList.add("show-modal");
}

function closeUserModal() {
    var modal = document.getElementById("userEditModal");
    if (modal) modal.classList.remove("show-modal");
}

function handleSaveUser(event) {
    event.preventDefault();

    var errorBox = document.getElementById("userEditErrorBox");
    if (errorBox) {
        errorBox.textContent = "";
        errorBox.style.display = "none";
    }

    var userId = parseInt(document.getElementById("editUserId").value, 10);
    var fullName = document.getElementById("editUserFullName").value.trim();
    var studentId = document.getElementById("editUserStudentId").value.trim();
    var email = document.getElementById("editUserEmail").value.trim();
    var role = document.getElementById("editUserRole").value;
    var membership = document.getElementById("editUserMembership").value;

    if (fullName === "" || studentId === "" || email === "") {
        if (errorBox) {
            errorBox.textContent = "Please fill in all required fields.";
            errorBox.style.display = "block";
        }
        return;
    }

    var users = getUsers();

    // Check duplicate email (excluding current user)
    for (var i = 0; i < users.length; i++) {
        if (users[i].id !== userId && users[i].email.toLowerCase() === email.toLowerCase()) {
            if (errorBox) {
                errorBox.textContent = "An account with this email already exists.";
                errorBox.style.display = "block";
            }
            return;
        }
    }

    // Check duplicate studentId (excluding current user)
    for (var j = 0; j < users.length; j++) {
        if (users[j].id !== userId && users[j].studentId.toLowerCase() === studentId.toLowerCase()) {
            if (errorBox) {
                errorBox.textContent = "This Student ID is already registered.";
                errorBox.style.display = "block";
            }
            return;
        }
    }

    // Update user object in array
    for (var k = 0; k < users.length; k++) {
        if (users[k].id === userId) {
            users[k].fullName = fullName;
            users[k].studentId = studentId;
            users[k].email = email;
            users[k].role = role;
            users[k].membership = membership;
            break;
        }
    }

    saveUsers(users);
    closeUserModal();
    showNotification("User updated successfully.", "success");

    renderUsers();
    renderDashboard();
}

function openDeleteUserModal(userId) {
    var users = getUsers();
    var target = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            target = users[i];
            break;
        }
    }

    if (!target) return;

    // Check if admin is attempting to delete their own active account
    var loggedInUserId = localStorage.getItem("loggedInUserId");
    var loggedInUserEmail = localStorage.getItem("userEmail");

    if ((loggedInUserId && String(target.id) === String(loggedInUserId)) ||
        (loggedInUserEmail && target.email.toLowerCase() === loggedInUserEmail.toLowerCase())) {
        showNotification("Your current admin account cannot be deleted.", "warning");
        return;
    }

    document.getElementById("deleteUserId").value = target.id;
    document.getElementById("deleteUserNameDisplay").textContent = target.fullName + " (" + target.email + ")";

    var alertBox = document.getElementById("deleteUserAlertBox");
    if (alertBox) {
        alertBox.textContent = "";
        alertBox.style.display = "none";
    }

    document.getElementById("deleteUserModal").classList.add("show-modal");
}

function closeDeleteUserModal() {
    var modal = document.getElementById("deleteUserModal");
    if (modal) modal.classList.remove("show-modal");
}

function handleConfirmDeleteUser() {
    var userId = parseInt(document.getElementById("deleteUserId").value, 10);
    var users = getUsers();
    var updated = [];

    for (var i = 0; i < users.length; i++) {
        if (users[i].id !== userId) {
            updated.push(users[i]);
        }
    }

    saveUsers(updated);
    closeDeleteUserModal();
    showNotification("User deleted successfully.", "success");

    renderUsers();
    renderDashboard();
}

// ===================================================
// 11. BORROWED BOOKS SECTION
// ===================================================
function renderBorrowedBooks() {
    var tbody = document.getElementById("adminBorrowedTableBody");
    var borrowed = getBorrowedBooks();
    var studentName = localStorage.getItem("studentName") || "Student User";
    var studentId = localStorage.getItem("studentId") || "STU-2026-8841";

    if (borrowed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--secondary-text); padding: 30px;">No books currently in circulation.</td></tr>';
        return;
    }

    var html = "";
    for (var i = 0; i < borrowed.length; i++) {
        var item = borrowed[i];
        var isLate = isOverdue(item.dueDate);
        var statusBadge = isLate
            ? '<span class="badge-overdue">Overdue</span>'
            : '<span class="badge-available">Active</span>';

        html += '<tr>' +
            '<td><strong>' + item.title + '</strong><br><span style="font-size: 12px; color: var(--secondary-text);">' + item.author + '</span></td>' +
            '<td><strong>' + studentName + '</strong><br><span style="font-size: 11px; color: var(--secondary-text);">' + studentId + '</span></td>' +
            '<td>' + item.borrowDate + '</td>' +
            '<td>' + item.dueDate + '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td style="text-align: right;">' +
                '<button type="button" class="btn-sm btn-return" onclick="adminReturnBook(' + item.bookId + ')">Mark Returned</button>' +
            '</td>' +
        '</tr>';
    }

    tbody.innerHTML = html;
}

// Mark book returned from Admin side
function adminReturnBook(bookId) {
    var borrowed = getBorrowedBooks();
    var updated = [];
    var returnedItem = null;

    for (var i = 0; i < borrowed.length; i++) {
        if (borrowed[i].bookId === bookId) {
            returnedItem = borrowed[i];
        } else {
            updated.push(borrowed[i]);
        }
    }

    if (!returnedItem) return;

    saveBorrowedBooks(updated);

    // Update book status in catalog to available
    var books = getBooks();
    for (var j = 0; j < books.length; j++) {
        if (books[j].id === bookId) {
            books[j].status = "available";
            break;
        }
    }
    saveBooks(books);

    // Update history
    var history = getHistory();
    for (var h = 0; h < history.length; h++) {
        if (history[h].bookId === bookId && history[h].status === "Borrowed") {
            history[h].status = "Returned (" + formatDate(new Date()) + ")";
            break;
        }
    }
    saveHistory(history);

    showNotification("Book marked as returned.", "success");

    renderBorrowedBooks();
    renderDashboard();
    renderBooks();
    renderOverdueBooks();
    renderReports();
}

// ===================================================
// 12. RESERVATIONS SECTION
// ===================================================
function renderReservations() {
    var tbody = document.getElementById("adminReservationsTableBody");
    var reservations = getReservations();
    var studentName = localStorage.getItem("studentName") || "Student User";

    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--secondary-text); padding: 30px;">No pending reservations recorded.</td></tr>';
        return;
    }

    var html = "";
    for (var i = 0; i < reservations.length; i++) {
        var item = reservations[i];
        html += '<tr>' +
            '<td><strong>' + item.title + '</strong><br><span style="font-size: 12px; color: var(--secondary-text);">' + item.author + '</span></td>' +
            '<td>' + studentName + '</td>' +
            '<td>' + item.reservationDate + '</td>' +
            '<td><span class="badge-waiting">' + item.status + '</span></td>' +
            '<td style="text-align: right;">' +
                '<button type="button" class="btn-sm btn-delete" onclick="adminCancelReservation(' + item.bookId + ')">Cancel Reservation</button>' +
            '</td>' +
        '</tr>';
    }

    tbody.innerHTML = html;
}

function adminCancelReservation(bookId) {
    var reservations = getReservations();
    var updated = [];

    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].bookId !== bookId) {
            updated.push(reservations[i]);
        }
    }

    saveReservations(updated);
    showNotification("Reservation cancelled.", "info");

    renderReservations();
    renderDashboard();
    renderReports();
}

// ===================================================
// 13. OVERDUE BOOKS SECTION
// ===================================================
function renderOverdueBooks() {
    var tbody = document.getElementById("adminOverdueTableBody");
    var borrowed = getBorrowedBooks();
    var studentName = localStorage.getItem("studentName") || "Student User";

    var overdueList = [];
    for (var i = 0; i < borrowed.length; i++) {
        if (isOverdue(borrowed[i].dueDate)) {
            overdueList.push(borrowed[i]);
        }
    }

    if (overdueList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--secondary-text); padding: 30px;">No overdue books.</td></tr>';
        return;
    }

    var html = "";
    for (var j = 0; j < overdueList.length; j++) {
        var item = overdueList[j];
        var days = getDaysOverdue(item.dueDate);

        html += '<tr>' +
            '<td><strong>' + item.title + '</strong><br><span style="font-size: 12px; color: var(--secondary-text);">' + item.author + '</span></td>' +
            '<td>' + studentName + '</td>' +
            '<td>' + item.dueDate + '</td>' +
            '<td><span class="badge-overdue">' + days + ' days overdue</span></td>' +
            '<td style="text-align: right;">' +
                '<button type="button" class="btn-sm btn-return" onclick="adminReturnBook(' + item.bookId + ')">Mark Returned</button>' +
            '</td>' +
        '</tr>';
    }

    tbody.innerHTML = html;
}

// ===================================================
// 14. REPORTS SECTION
// ===================================================
function renderReports() {
    var books = getBooks();
    var borrowed = getBorrowedBooks();
    var reservations = getReservations();
    var users = getUsers();

    var totalBooks = books.length;
    var borrowedCount = borrowed.length;
    var reservedCount = reservations.length;
    var usersCount = users.length;

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

    // 1. Summary box
    var summaryContainer = document.getElementById("reportSummaryBox");
    summaryContainer.innerHTML = '' +
        '<div class="report-stat-row"><span>Total Catalog Titles:</span><strong>' + totalBooks + '</strong></div>' +
        '<div class="report-stat-row"><span>Available for Checkout:</span><strong>' + availableCount + '</strong></div>' +
        '<div class="report-stat-row"><span>Currently Borrowed:</span><strong>' + borrowedCount + '</strong></div>' +
        '<div class="report-stat-row"><span>Pending Reservations:</span><strong>' + reservedCount + '</strong></div>' +
        '<div class="report-stat-row"><span>Overdue Loans:</span><strong style="color: #8C5311;">' + overdueCount + '</strong></div>' +
        '<div class="report-stat-row"><span>Total Registered Patrons:</span><strong>' + usersCount + '</strong></div>';

    // 2. Category distribution calculation
    var categoryCounts = {};
    for (var b = 0; b < books.length; b++) {
        var cat = books[b].category;
        if (!categoryCounts[cat]) {
            categoryCounts[cat] = 0;
        }
        categoryCounts[cat]++;
    }

    var breakdownContainer = document.getElementById("categoryReportList");
    var breakdownHtml = "";

    for (var category in categoryCounts) {
        var count = categoryCounts[category];
        var percentage = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;

        breakdownHtml += '<div class="category-bar-item">' +
            '<div class="category-bar-header">' +
                '<span>' + category + '</span>' +
                '<span>' + count + ' titles (' + percentage + '%)</span>' +
            '</div>' +
            '<div class="category-bar-track">' +
                '<div class="category-bar-fill" style="width: ' + percentage + '%;"></div>' +
            '</div>' +
        '</div>';
    }

    breakdownContainer.innerHTML = breakdownHtml;
}

// ===================================================
// 15. SECTION NAVIGATION SWITCHER
// ===================================================
function switchSection(sectionName) {
    var sidebarItems = document.querySelectorAll("#adminSidebarMenu .sidebar-item");
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

    // Scroll to top of content
    var mainContent = document.querySelector(".main-content");
    if (mainContent) mainContent.scrollTop = 0;
    window.scrollTo(0, 0);

    // Refresh active section
    if (sectionName === "dashboard") renderDashboard();
    else if (sectionName === "books") renderBooks();
    else if (sectionName === "users") renderUsers();
    else if (sectionName === "borrowed-books") renderBorrowedBooks();
    else if (sectionName === "reservations") renderReservations();
    else if (sectionName === "overdue-books") renderOverdueBooks();
    else if (sectionName === "reports") renderReports();
    else if (sectionName === "profile") updateAdminIdentityDisplay();
}

// ===================================================
// 16. PAGE INITIALIZATION ON DOM LOAD
// ===================================================
document.addEventListener("DOMContentLoaded", function () {

    // 1. Initialize storage data
    initStorage();

    // 2. Setup Sidebar Navigation Clicks
    var navLinks = document.querySelectorAll("#adminSidebarMenu a");
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function (event) {
            event.preventDefault();
            var target = this.getAttribute("data-section");
            if (target) {
                switchSection(target);
            }
        });
    }

    // 3. Setup Book Search & Category Filter
    var bookSearch = document.getElementById("adminBookSearch");
    var categoryFilter = document.getElementById("adminCategoryFilter");
    var clearFiltersBtn = document.getElementById("adminClearFiltersBtn");

    if (bookSearch) {
        bookSearch.addEventListener("input", function () {
            renderBooks();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", function () {
            renderBooks();
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", function () {
            if (bookSearch) bookSearch.value = "";
            if (categoryFilter) categoryFilter.value = "All Categories";
            renderBooks();
        });
    }

    // 4. Setup Add Book Button & Modal
    var openAddBookBtn = document.getElementById("openAddBookBtn");
    var closeBookModalBtn = document.getElementById("closeBookModalBtn");
    var closeBookModalXBtn = document.getElementById("closeBookModalXBtn");
    var bookForm = document.getElementById("bookForm");

    if (openAddBookBtn) openAddBookBtn.addEventListener("click", openAddBookModal);
    if (closeBookModalBtn) closeBookModalBtn.addEventListener("click", closeBookModal);
    if (closeBookModalXBtn) closeBookModalXBtn.addEventListener("click", closeBookModal);
    if (bookForm) bookForm.addEventListener("submit", handleSaveBook);

    // 5. Setup Delete Modal
    var cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    var closeDeleteModalXBtn = document.getElementById("closeDeleteModalXBtn");
    var confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    if (closeDeleteModalXBtn) closeDeleteModalXBtn.addEventListener("click", closeDeleteModal);
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener("click", handleConfirmDelete);

    // 6. Setup User Search & Role Filter
    var userSearch = document.getElementById("adminUserSearch");
    var userRoleFilter = document.getElementById("adminUserRoleFilter");
    var userClearFiltersBtn = document.getElementById("adminUserClearFiltersBtn");

    if (userSearch) {
        userSearch.addEventListener("input", function () {
            renderUsers();
        });
    }

    if (userRoleFilter) {
        userRoleFilter.addEventListener("change", function () {
            renderUsers();
        });
    }

    if (userClearFiltersBtn) {
        userClearFiltersBtn.addEventListener("click", function () {
            if (userSearch) userSearch.value = "";
            if (userRoleFilter) userRoleFilter.value = "All Roles";
            renderUsers();
        });
    }

    // 7. Setup User Edit Modal Buttons
    var closeUserModalBtn = document.getElementById("closeUserModalBtn");
    var closeUserModalXBtn = document.getElementById("closeUserModalXBtn");
    var userEditForm = document.getElementById("userEditForm");

    if (closeUserModalBtn) closeUserModalBtn.addEventListener("click", closeUserModal);
    if (closeUserModalXBtn) closeUserModalXBtn.addEventListener("click", closeUserModal);
    if (userEditForm) userEditForm.addEventListener("submit", handleSaveUser);

    // 8. Setup User Delete Modal Buttons
    var cancelDeleteUserBtn = document.getElementById("cancelDeleteUserBtn");
    var closeDeleteUserModalXBtn = document.getElementById("closeDeleteUserModalXBtn");
    var confirmDeleteUserBtn = document.getElementById("confirmDeleteUserBtn");

    if (cancelDeleteUserBtn) cancelDeleteUserBtn.addEventListener("click", closeDeleteUserModal);
    if (closeDeleteUserModalXBtn) closeDeleteUserModalXBtn.addEventListener("click", closeDeleteUserModal);
    if (confirmDeleteUserBtn) confirmDeleteUserBtn.addEventListener("click", handleConfirmDeleteUser);

    // 9. Setup Admin Profile Form Submit
    var adminProfileForm = document.getElementById("adminProfileForm");
    if (adminProfileForm) {
        adminProfileForm.addEventListener("submit", handleSaveAdminProfile);
    }

    // 10. Setup Logout Handlers
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

    // 11. Initial Render of Dashboard Views & Profile Identity
    updateAdminIdentityDisplay();
    renderDashboard();
    renderBooks();
    renderUsers();
    renderBorrowedBooks();
    renderReservations();
    renderOverdueBooks();
    renderReports();

});

// Global window assignments for inline actions
window.openAddBookModal = openAddBookModal;
window.openEditBookModal = openEditBookModal;
window.openDeleteBookModal = openDeleteBookModal;
window.openEditUserModal = openEditUserModal;
window.openDeleteUserModal = openDeleteUserModal;
window.closeUserModal = closeUserModal;
window.closeDeleteUserModal = closeDeleteUserModal;
window.updateAdminIdentityDisplay = updateAdminIdentityDisplay;
window.adminReturnBook = adminReturnBook;
window.adminCancelReservation = adminCancelReservation;
window.switchSection = switchSection;
