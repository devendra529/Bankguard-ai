import "server-only";
import * as userRepository from "@/repositories/userRepository";
import * as accountRepository from "@/repositories/accountRepository";
import * as notificationRepository from "@/repositories/notificationRepository";
import * as loginHistoryRepository from "@/repositories/loginHistoryRepository";
import * as deviceRepository from "@/repositories/deviceRepository";
import { hashPassword } from "@/lib/auth/password";

/** Strip the password hash before anything reaches the client. */
export function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

export function listAll() {
  return userRepository.getAll().map(toPublicUser);
}

export function listCustomers() {
  return userRepository.getByRole("CUSTOMER").map(toPublicUser);
}

export function listAnalysts() {
  return userRepository.getByRole("ANALYST").map(toPublicUser);
}

export function getById(id) {
  return toPublicUser(userRepository.getById(id));
}

export function setStatus(id, status) {
  return toPublicUser(userRepository.update(id, { status }));
}

export function setRole(id, role) {
  return toPublicUser(userRepository.update(id, { role }));
}

export async function createStaffUser({ name, email, phone, password, role }) {
  const passwordHash = await hashPassword(password);
  const user = userRepository.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    passwordHash,
    role,
  });
  return toPublicUser(user);
}

export function accountSummaryForCustomer(userId) {
  const accounts = accountRepository.getByUserId(userId);
  return {
    accountCount: accounts.length,
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
  };
}

export function listNotifications(userId, limit = 15) {
  return notificationRepository.getByUserId(userId).slice(0, limit);
}

export function markAllNotificationsRead(userId) {
  const unread = notificationRepository.getByUserId(userId).filter((n) => !n.read);
  unread.forEach((n) => notificationRepository.markRead(n.id));
  return unread.length;
}

export function getLoginHistory(userId, limit = 10) {
  return loginHistoryRepository.getByUserId(userId).slice(0, limit);
}

export function getDevices(userId) {
  return deviceRepository.getByUserId(userId);
}

export function counts() {
  const users = userRepository.getAll();
  return {
    customers: users.filter((u) => u.role === "CUSTOMER").length,
    analysts: users.filter((u) => u.role === "ANALYST").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };
}
