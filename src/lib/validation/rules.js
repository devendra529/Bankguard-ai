/**
 * Small, dependency-free validators shared by API route handlers and forms.
 * Every function returns an { field: message } error map; an empty object
 * means the input is valid.
 */

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function validateRegisterInput({ name, email, phone, password, confirmPassword }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Enter your full name.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!phone || String(phone).replace(/\D/g, "").length < 10) errors.phone = "Enter a valid phone number.";
  if (!password || password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function validateLoginInput({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  return errors;
}

export function validateTransferInput({ receiverAccount, amount, transactionType }) {
  const errors = {};
  const digits = String(receiverAccount || "").replace(/\s/g, "");
  if (!digits || digits.length < 8) errors.receiverAccount = "Enter a valid receiver account number.";
  const numericAmount = Number(amount);
  if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    errors.amount = "Enter an amount greater than zero.";
  }
  if (!transactionType) errors.transactionType = "Select a transaction type.";
  return errors;
}

export function validatePasswordChange({ currentPassword, newPassword, confirmPassword }) {
  const errors = {};
  if (!currentPassword) errors.currentPassword = "Enter your current password.";
  if (!newPassword || newPassword.length < 8) errors.newPassword = "New password must be at least 8 characters.";
  if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}
