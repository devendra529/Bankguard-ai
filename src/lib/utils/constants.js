/**
 * App-wide constants. Safe to import from both server and client code.
 * (Risk thresholds are intentionally NOT defined here - they will live in a
 * single fraud configuration file in Step 5.)
 */
export const APP_NAME = "BankGuard AI";
export const APP_TAGLINE = "Real-Time Banking Fraud Detection & Prevention";
export const THEME_STORAGE_KEY = "bankguard-theme";

export const ROLES = Object.freeze({
  CUSTOMER: "CUSTOMER",
  ANALYST: "ANALYST",
  ADMIN: "ADMIN",
});

export const ROLE_HOME = Object.freeze({
  CUSTOMER: "/customer/dashboard",
  ANALYST: "/analyst/dashboard",
  ADMIN: "/admin/dashboard",
});

export const ROLE_LABELS = Object.freeze({
  CUSTOMER: "Customer",
  ANALYST: "Fraud Analyst",
  ADMIN: "Administrator",
});

/**
 * Sidebar navigation per role. `icon` is a string key resolved to a
 * lucide-react component inside AppSidebar (keeps this file serializable).
 * Routes are built in later steps; links resolve once those pages exist.
 */
export const NAV_BY_ROLE = Object.freeze({
  CUSTOMER: [
    { label: "Dashboard", href: "/customer/dashboard", icon: "dashboard" },
    { label: "Accounts", href: "/customer/accounts", icon: "accounts" },
    { label: "Transactions", href: "/customer/transactions", icon: "transactions" },
    { label: "Transfer", href: "/customer/transfer", icon: "transfer" },
    { label: "Security", href: "/customer/security", icon: "security" },
    { label: "Profile", href: "/customer/profile", icon: "profile" },
  ],
  ANALYST: [
    { label: "Dashboard", href: "/analyst/dashboard", icon: "dashboard" },
    { label: "Transactions", href: "/analyst/transactions", icon: "transactions" },
    { label: "Fraud Alerts", href: "/analyst/alerts", icon: "alerts" },
    { label: "Cases", href: "/analyst/cases", icon: "cases" },
    { label: "Customers", href: "/analyst/customers", icon: "users" },
    { label: "Reports", href: "/analyst/reports", icon: "reports" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { label: "Users", href: "/admin/users", icon: "users" },
    { label: "Analysts", href: "/admin/analysts", icon: "analysts" },
    { label: "Fraud Rules", href: "/admin/rules", icon: "rules" },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: "audit" },
    { label: "System", href: "/admin/system", icon: "system" },
  ],
});

export const AUDIT_ACTIONS = Object.freeze({
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  LOGIN_FAILED: "LOGIN_FAILED",
  USER_REGISTERED: "USER_REGISTERED",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  PASSWORD_RESET_REQUESTED: "PASSWORD_RESET_REQUESTED",
  TRANSACTION_CREATED: "TRANSACTION_CREATED",
  FRAUD_ALERT_CREATED: "FRAUD_ALERT_CREATED",
  ALERT_ASSIGNED: "ALERT_ASSIGNED",
  ALERT_INVESTIGATING: "ALERT_INVESTIGATING",
  ALERT_NOTE_ADDED: "ALERT_NOTE_ADDED",
  TRANSACTION_APPROVED: "TRANSACTION_APPROVED",
  TRANSACTION_BLOCKED: "TRANSACTION_BLOCKED",
  ALERT_RESOLVED: "ALERT_RESOLVED",
  RULE_UPDATED: "RULE_UPDATED",
  USER_UPDATED: "USER_UPDATED",
});

export const TRANSACTION_TYPE_LABELS = Object.freeze({
  TRANSFER: "Transfer",
  PAYMENT: "Payment",
  CASH_OUT: "Cash out",
  DEBIT: "Debit",
});
