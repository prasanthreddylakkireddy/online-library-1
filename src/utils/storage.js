/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Storage Utilities & Initial Data (storage.js)
   Synchronizes with localStorage to maintain original state
=================================================== */

export const ADMIN_ACCESS_CODE = "LIBRARY@2026";

export const initialUsers = [
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

export const initialBooks = [
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

export function initStorage() {
  if (typeof window === "undefined") return;

  // 1. Initialize Users
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(initialUsers));
  }

  // 2. Initialize Books
  let storedBooks = null;
  try {
    storedBooks = JSON.parse(localStorage.getItem("books"));
  } catch (e) {
    storedBooks = null;
  }

  if (!storedBooks || storedBooks.length < 30) {
    const borrowed = getBorrowedBooks();
    const booksToSave = initialBooks.map((b) => {
      const isBorrowed = borrowed.some((item) => item.bookId === b.id);
      return isBorrowed ? { ...b, status: "borrowed" } : b;
    });
    localStorage.setItem("books", JSON.stringify(booksToSave));
  }

  // 3. Initialize other collections
  if (!localStorage.getItem("borrowedBooks")) {
    localStorage.setItem("borrowedBooks", JSON.stringify([]));
  }
  if (!localStorage.getItem("reservations")) {
    localStorage.setItem("reservations", JSON.stringify([]));
  }
  if (!localStorage.getItem("history")) {
    localStorage.setItem("history", JSON.stringify([]));
  }
  if (!localStorage.getItem("studentName")) {
    localStorage.setItem("studentName", "Student User");
  }
  if (!localStorage.getItem("studentId")) {
    localStorage.setItem("studentId", "STU-2026-8841");
  }
}

export function getBooks() {
  try {
    return JSON.parse(localStorage.getItem("books")) || [];
  } catch {
    return [];
  }
}

export function saveBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getBorrowedBooks() {
  try {
    return JSON.parse(localStorage.getItem("borrowedBooks")) || [];
  } catch {
    return [];
  }
}

export function saveBorrowedBooks(borrowed) {
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));
}

export function getReservations() {
  try {
    return JSON.parse(localStorage.getItem("reservations")) || [];
  } catch {
    return [];
  }
}

export function saveReservations(reservations) {
  localStorage.setItem("reservations", JSON.stringify(reservations));
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("history")) || [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  localStorage.setItem("history", JSON.stringify(history));
}

export function getLoggedInUser() {
  const users = getUsers();
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const userEmail = localStorage.getItem("userEmail");

  for (let i = 0; i < users.length; i++) {
    if (loggedInUserId && String(users[i].id) === String(loggedInUserId)) {
      return users[i];
    }
    if (userEmail && users[i].email.toLowerCase() === userEmail.toLowerCase()) {
      return users[i];
    }
  }
  return null;
}
