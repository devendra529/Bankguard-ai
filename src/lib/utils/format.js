const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return currencyFormatter.format(value);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

/** "4000 1234 4521 6521" -> "XXXX XXXX XXXX 6521" */
export function maskAccountNumber(accountNumber) {
  const digits = String(accountNumber || "").replace(/\s/g, "");
  if (digits.length < 4) return digits;
  const last4 = digits.slice(-4);
  const groups = Math.max(Math.ceil(digits.length / 4) - 1, 0);
  return `${"XXXX ".repeat(groups).trim()} ${last4}`.trim();
}

export function formatAccountNumber(accountNumber) {
  return String(accountNumber || "").replace(/(.{4})/g, "$1 ").trim();
}

export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function formatPercent(value, digits = 0) {
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

export function timeAgo(value) {
  if (!value) return "-";
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}
