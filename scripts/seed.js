/**
 * BankGuard AI - development seed data generator.
 *
 * Plain CommonJS Node script (not part of the Next.js build) that writes
 * fictional demo data straight into /data/*.json. Run with:
 *   node scripts/seed.js
 *
 * All customers, accounts, transactions, devices and locations are
 * invented for this simulation. Nothing here is a real person or bank.
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_DIR = path.join(process.cwd(), "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

function write(fileName, data) {
  fs.writeFileSync(path.join(DATA_DIR, fileName), JSON.stringify(data, null, 2));
  console.log(`  wrote ${fileName} (${Array.isArray(data) ? data.length : 0} records)`);
}

function id(prefix, n, pad = 4) {
  return `${prefix}-${String(n).padStart(pad, "0")}`;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isoDaysAgo(days, hour = randomInt(7, 22)) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, randomInt(0, 59), randomInt(0, 59), 0);
  return d.toISOString();
}

const DEMO_PASSWORD_HASH = bcrypt.hashSync("Demo@1234", 10);

const FIRST_NAMES = [
  "Rahul", "Priya", "Ananya", "Vikram", "Neha", "Arjun", "Sanya", "Karan", "Divya", "Rohan",
  "Ishaan", "Meera", "Aditya", "Kavya", "Siddharth", "Pooja", "Aryan", "Riya", "Nikhil", "Tanya",
  "Rajesh", "Sunita", "Manish", "Kritika", "Varun",
];
const LAST_NAMES = [
  "Sharma", "Patel", "Verma", "Gupta", "Reddy", "Nair", "Iyer", "Singh", "Mehta", "Kapoor",
  "Joshi", "Chopra", "Malhotra", "Bansal", "Rao",
];
const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
const DEVICE_TEMPLATES = [
  { deviceName: "iPhone 15", os: "iOS 18", browser: "Safari" },
  { deviceName: "Samsung Galaxy S24", os: "Android 15", browser: "Chrome" },
  { deviceName: "Windows PC", os: "Windows 11", browser: "Edge" },
  { deviceName: "MacBook Pro", os: "macOS Sonoma", browser: "Safari" },
  { deviceName: "OnePlus 12", os: "Android 15", browser: "Chrome" },
];
const TXN_TYPES = ["TRANSFER", "UPI", "BILL_PAYMENT", "CARD"];
const MERCHANTS = ["Amazon", "Flipkart", "Swiggy", "Zomato", "Electricity Bill", "Airtel Postpaid", "Myntra", "BookMyShow", "Uber", "Netflix"];

console.log("Seeding BankGuard AI demo data...\n");

// ---------------------------------------------------------------------
// Users: 1 admin, 5 analysts, 20 customers
// ---------------------------------------------------------------------
const users = [];
let uCounter = 1;

users.push({
  id: id("USR", uCounter++),
  name: "Admin User",
  email: "admin@bankguard.demo",
  phone: "9800000001",
  passwordHash: DEMO_PASSWORD_HASH,
  role: "ADMIN",
  status: "ACTIVE",
  createdAt: isoDaysAgo(365),
  updatedAt: isoDaysAgo(1),
});

const analystNames = ["Ananya Patel", "Vikram Nair", "Sanya Kapoor", "Rohan Iyer", "Meera Joshi"];
const analysts = analystNames.map((name, i) => {
  const rec = {
    id: id("USR", uCounter++),
    name,
    email: i === 0 ? "analyst@bankguard.demo" : `analyst${i + 1}@bankguard.demo`,
    phone: `98000000${10 + i}`,
    passwordHash: DEMO_PASSWORD_HASH,
    role: "ANALYST",
    status: "ACTIVE",
    createdAt: isoDaysAgo(300 - i * 10),
    updatedAt: isoDaysAgo(1),
  };
  users.push(rec);
  return rec;
});

const customers = [];
for (let i = 0; i < 20; i += 1) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = pick(LAST_NAMES);
  const rec = {
    id: id("USR", uCounter++),
    name: `${first} ${last}`,
    email: i === 0 ? "customer@bankguard.demo" : `${first.toLowerCase()}.${last.toLowerCase()}${i}@bankguard.demo`,
    phone: `90000${String(10000 + i)}`,
    passwordHash: DEMO_PASSWORD_HASH,
    role: "CUSTOMER",
    status: "ACTIVE",
    homeCity: pick(CITIES),
    createdAt: isoDaysAgo(randomInt(60, 400)),
    updatedAt: isoDaysAgo(randomInt(0, 20)),
  };
  users.push(rec);
  customers.push(rec);
}

// ---------------------------------------------------------------------
// Accounts: 1-2 per customer, 30 total
// ---------------------------------------------------------------------
const accounts = [];
let aCounter = 1000;
function newAccountNumber() {
  let s = "";
  for (let i = 0; i < 16; i += 1) s += randomInt(0, 9);
  return s;
}
customers.forEach((customer, idx) => {
  const count = idx < 10 ? 2 : 1; // first 10 customers get 2 accounts -> 30 total
  for (let j = 0; j < count; j += 1) {
    const type = j === 0 ? "SAVINGS" : "CURRENT";
    const balance = randomInt(15000, 450000);
    accounts.push({
      id: id("ACC", aCounter++),
      userId: customer.id,
      accountNumber: newAccountNumber(),
      type,
      balance,
      availableBalance: balance,
      currency: "INR",
      status: "ACTIVE",
      createdAt: customer.createdAt,
    });
  }
});

// ---------------------------------------------------------------------
// Devices: 1-2 per customer
// ---------------------------------------------------------------------
const devices = [];
let dCounter = 1;
const deviceByUser = {};
customers.forEach((customer) => {
  const own = [];
  const count = randomInt(1, 2);
  for (let j = 0; j < count; j += 1) {
    const template = pick(DEVICE_TEMPLATES);
    const rec = {
      id: id("DEV", dCounter++),
      userId: customer.id,
      deviceId: `dev-${customer.id.toLowerCase()}-${j}`,
      ...template,
      isTrusted: true,
      firstSeenAt: customer.createdAt,
      lastSeenAt: isoDaysAgo(randomInt(0, 5)),
    };
    devices.push(rec);
    own.push(rec);
  }
  deviceByUser[customer.id] = own;
});

// ---------------------------------------------------------------------
// Fraud rules (defaults, editable later at /admin/rules)
// ---------------------------------------------------------------------
const fraudRules = [
  { key: "LARGE_TRANSACTION", name: "Large Transaction", description: "Flags transfers above a fixed rupee amount.", threshold: 50000, weight: 0.3, severity: "HIGH" },
  { key: "HIGH_VELOCITY", name: "High Transaction Velocity", description: "Flags accounts sending several transfers in a short window.", threshold: 3, weight: 0.2, severity: "MEDIUM" },
  { key: "NEW_DEVICE", name: "New Device", description: "Flags a transfer made from a device not seen on this account before.", threshold: 1, weight: 0.2, severity: "MEDIUM" },
  { key: "NEW_LOCATION", name: "New Location", description: "Flags a transfer made from a city not seen on this account before.", threshold: 1, weight: 0.15, severity: "MEDIUM" },
  { key: "UNUSUAL_TIME", name: "Unusual Transaction Time", description: "Flags transfers initiated late at night (00:00-05:00).", threshold: 1, weight: 0.1, severity: "LOW" },
  { key: "HIGH_AMOUNT_RATIO", name: "High Amount-to-Balance Ratio", description: "Flags a transfer that moves a large share of the available balance.", threshold: 0.5, weight: 0.25, severity: "HIGH" },
].map((rule, i) => ({
  id: id("RULE", i + 1),
  ...rule,
  enabled: true,
  createdAt: isoDaysAgo(365),
  updatedAt: isoDaysAgo(30),
}));

function getRiskLevel(p) {
  if (p >= 0.7) return "HIGH";
  if (p >= 0.3) return "MEDIUM";
  return "LOW";
}
function decisionFor(level) {
  return { LOW: "APPROVED", MEDIUM: "REVIEW", HIGH: "FLAGGED" }[level];
}
function statusFor(level) {
  return { LOW: "COMPLETED", MEDIUM: "REVIEW", HIGH: "FLAGGED" }[level];
}

// ---------------------------------------------------------------------
// Transactions: 100+ across all customer accounts, mixed risk
// ---------------------------------------------------------------------
const transactions = [];
let tCounter = 10001;
const alerts = [];
let alCounter = 1;
const fraudCases = [];
let caseCounter = 1;
const notifications = [];
let nCounter = 1;

const RISK_MIX = ["LOW", "LOW", "LOW", "LOW", "LOW", "LOW", "MEDIUM", "MEDIUM", "MEDIUM", "HIGH"]; // ~60/30/10

accounts.forEach((account) => {
  const owner = customers.find((c) => c.id === account.userId);
  const ownerDevices = deviceByUser[account.userId] || [];
  const txnCount = randomInt(3, 6);

  for (let k = 0; k < txnCount; k += 1) {
    const level = pick(RISK_MIX);
    const daysAgo = randomInt(0, 21);
    const hour = level === "HIGH" && Math.random() < 0.4 ? randomInt(0, 4) : randomInt(7, 23);
    const createdAt = isoDaysAgo(daysAgo, hour);
    const type = pick(TXN_TYPES);

    let amount;
    let reasons = [];
    let device = ownerDevices.length ? pick(ownerDevices).deviceName : "Unknown device";
    let location = owner.homeCity;
    let isNewDevice = false;
    let isNewLocation = false;

    if (level === "LOW") {
      amount = randomInt(200, 8000);
    } else if (level === "MEDIUM") {
      amount = randomInt(15000, 48000);
      if (Math.random() < 0.5) {
        reasons.push("High amount-to-balance ratio");
      } else {
        reasons.push("High transaction velocity");
      }
    } else {
      amount = randomInt(60000, 95000);
      reasons.push("Unusually high transaction amount");
      if (Math.random() < 0.6) {
        isNewDevice = true;
        device = "Unrecognised device";
        reasons.push("New device detected");
      }
      if (Math.random() < 0.4) {
        isNewLocation = true;
        location = pick(CITIES.filter((c) => c !== owner.homeCity));
        reasons.push("Unusual location for this account");
      }
      if (hour < 5) reasons.push("Unusual transaction time");
      if (reasons.length < 2) reasons.push("High transaction velocity");
    }

    const fraudProbability =
      level === "LOW" ? Math.round((Math.random() * 0.29) * 100) / 100 :
      level === "MEDIUM" ? Math.round((0.3 + Math.random() * 0.39) * 100) / 100 :
      Math.round((0.7 + Math.random() * 0.29) * 100) / 100;

    const receiverIsMerchant = type !== "TRANSFER" || Math.random() < 0.5;
    const receiverName = receiverIsMerchant ? pick(MERCHANTS) : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const receiverAccount = receiverIsMerchant ? null : newAccountNumber();

    const status = statusFor(level);
    const txn = {
      id: id("TXN", tCounter++, 5),
      accountId: account.id,
      userId: account.userId,
      type,
      amount,
      description: receiverIsMerchant ? `Payment to ${receiverName}` : `Transfer to ${receiverName}`,
      receiverAccount,
      receiverName,
      device,
      location,
      fraudProbability,
      riskLevel: level,
      reasons,
      status,
      createdAt,
    };
    transactions.push(txn);

    if (level === "HIGH") {
      const assign = Math.random() < 0.6;
      const analyst = assign ? pick(analysts) : null;
      const alertStatus = assign ? pick(["OPEN", "INVESTIGATING", "INVESTIGATING", "RESOLVED"]) : "OPEN";
      const alert = {
        id: id("ALT", alCounter++),
        transactionId: txn.id,
        accountId: account.id,
        userId: account.userId,
        amount,
        fraudProbability,
        riskLevel: level,
        reasons,
        status: alertStatus,
        assignedAnalystId: analyst ? analyst.id : null,
        notes:
          alertStatus === "RESOLVED"
            ? [
                {
                  analystId: analyst.id,
                  analystName: analyst.name,
                  note: pick([
                    "Confirmed with customer by phone. Transaction is legitimate.",
                    "Pattern matches known merchant. Cleared after review.",
                    "Customer travel confirmed. Releasing transaction.",
                  ]),
                  createdAt: isoDaysAgo(Math.max(daysAgo - 1, 0)),
                },
              ]
            : [],
        createdAt,
        updatedAt: isoDaysAgo(Math.max(daysAgo - (alertStatus === "OPEN" ? 0 : 1), 0)),
      };
      alerts.push(alert);

      if (alertStatus === "RESOLVED") {
        txn.status = Math.random() < 0.5 ? "COMPLETED" : "BLOCKED";
      }

      if (assign && alertStatus === "INVESTIGATING") {
        fraudCases.push({
          id: id("CASE", caseCounter++),
          alertId: alert.id,
          transactionId: txn.id,
          userId: account.userId,
          analystId: analyst.id,
          status: "IN_PROGRESS",
          notes: [],
          createdAt: alert.updatedAt,
          updatedAt: alert.updatedAt,
        });
      }

      notifications.push({
        id: id("NOT", nCounter++),
        userId: account.userId,
        type: "SECURITY",
        title: "Transaction flagged for review",
        message: `Your transaction of ₹${amount.toLocaleString("en-IN")} was flagged and is being reviewed.`,
        read: Math.random() < 0.5,
        createdAt,
      });
    }
  }
});

transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

console.log(`Generated ${transactions.length} transactions, ${alerts.length} alerts, ${fraudCases.length} cases.\n`);

// ---------------------------------------------------------------------
// Login history: a handful of entries per user, mostly successful
// ---------------------------------------------------------------------
const loginHistory = [];
let lCounter = 1;
[...customers, ...analysts, users[0]].forEach((user) => {
  const count = randomInt(3, 8);
  for (let i = 0; i < count; i += 1) {
    const success = Math.random() < 0.85;
    loginHistory.push({
      id: id("LOG", lCounter++),
      userId: user.id,
      email: user.email,
      status: success ? "SUCCESS" : "FAILED",
      ip: `10.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
      device: (deviceByUser[user.id] && pick(deviceByUser[user.id])?.deviceName) || "Web browser",
      createdAt: isoDaysAgo(randomInt(0, 30)),
    });
  }
});
loginHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// ---------------------------------------------------------------------
// Audit logs: derived from the interesting events above
// ---------------------------------------------------------------------
const auditLogs = [];
let auCounter = 1;
function audit(userId, userName, action, resourceType, resourceId, metadata, timestamp) {
  auditLogs.push({
    id: id("AUD", auCounter++),
    userId,
    userName,
    action,
    resourceType,
    resourceId,
    metadata: metadata || {},
    timestamp,
  });
}

loginHistory.slice(0, 60).forEach((entry) => {
  const user = users.find((u) => u.id === entry.userId);
  audit(
    entry.userId,
    user?.name || "Unknown",
    entry.status === "SUCCESS" ? "LOGIN" : "FAILED_LOGIN",
    "USER",
    entry.userId,
    { ip: entry.ip },
    entry.createdAt
  );
});

transactions.forEach((txn) => {
  const user = customers.find((c) => c.id === txn.userId);
  audit(txn.userId, user?.name || "Unknown", "TRANSACTION_CREATED", "TRANSACTION", txn.id, { amount: txn.amount, riskLevel: txn.riskLevel }, txn.createdAt);
});

alerts.forEach((alert) => {
  audit("USR-0001", "System", "FRAUD_ALERT_CREATED", "ALERT", alert.id, { riskLevel: alert.riskLevel }, alert.createdAt);
  if (alert.assignedAnalystId) {
    const analyst = analysts.find((a) => a.id === alert.assignedAnalystId);
    audit(alert.assignedAnalystId, analyst?.name || "Analyst", "ALERT_ASSIGNED", "ALERT", alert.id, {}, alert.updatedAt);
  }
  if (alert.status === "RESOLVED") {
    const analyst = analysts.find((a) => a.id === alert.assignedAnalystId);
    audit(alert.assignedAnalystId, analyst?.name || "Analyst", "ALERT_RESOLVED", "ALERT", alert.id, {}, alert.updatedAt);
  }
});

fraudRules.forEach((rule) => {
  audit("USR-0001", "Admin User", "RULE_UPDATED", "FRAUD_RULE", rule.id, { name: rule.name }, rule.updatedAt);
});

auditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

// ---------------------------------------------------------------------
// Persist everything
// ---------------------------------------------------------------------
write("users.json", users);
write("accounts.json", accounts);
write("transactions.json", transactions);
write("alerts.json", alerts);
write("fraud-cases.json", fraudCases);
write("devices.json", devices);
write("login-history.json", loginHistory);
write("audit-logs.json", auditLogs);
write("notifications.json", notifications);
write("fraud-rules.json", fraudRules);

console.log("\nDemo accounts (all use password: Demo@1234):");
console.log("  customer@bankguard.demo  (CUSTOMER)");
console.log("  analyst@bankguard.demo   (ANALYST)");
console.log("  admin@bankguard.demo     (ADMIN)");
console.log("\nSeed complete.");
