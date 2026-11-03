/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   General Helper Utilities (helpers.js)
=================================================== */

export function formatDate(dateObj) {
  if (!dateObj) return "";
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isNaN(d.getTime())) return String(dateObj);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let day = d.getDate();
  if (day < 10) day = "0" + day;
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  const targetDate = new Date(dateStr);
  const now = new Date();
  return now.getTime() > targetDate.getTime();
}

export function getDaysOverdue(dateStr) {
  if (!dateStr) return 0;
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diff = now - target;
  if (diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
