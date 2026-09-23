import "server-only";
import * as userRepository from "@/repositories/userRepository";
import * as accountRepository from "@/repositories/accountRepository";
import * as loginHistoryRepository from "@/repositories/loginHistoryRepository";
import * as auditService from "@/services/auditService";
import { toPublicUser } from "@/services/userService";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { validateLoginInput, validatePasswordChange, validateRegisterInput } from "@/lib/validation/rules";
import { generateAccountNumber } from "@/lib/utils/id";

export class AuthError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = "AuthError";
    this.fieldErrors = fieldErrors;
  }
}

const CUSTOMER_STARTING_BALANCE = 25000;

/** Registers a new CUSTOMER and opens a default savings account for them. */
export async function register(input) {
  const errors = validateRegisterInput(input);
  if (Object.keys(errors).length) throw new AuthError("Check the highlighted fields.", errors);

  if (userRepository.getByEmail(input.email)) {
    throw new AuthError("An account with this email already exists.", { email: "This email is already registered." });
  }

  const passwordHash = await hashPassword(input.password);
  const user = userRepository.create({
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    passwordHash,
    role: "CUSTOMER",
    homeCity: input.homeCity || "Delhi",
  });

  accountRepository.create({
    userId: user.id,
    accountNumber: generateAccountNumber(),
    type: "SAVINGS",
    balance: CUSTOMER_STARTING_BALANCE,
    availableBalance: CUSTOMER_STARTING_BALANCE,
  });

  auditService.log({
    userId: user.id,
    userName: user.name,
    action: "USER_REGISTERED",
    resourceType: "USER",
    resourceId: user.id,
  });

  return toPublicUser(user);
}

/** Verifies credentials, records login history + audit log. Throws AuthError on failure. */
export async function login({ email, password }, meta = {}) {
  const errors = validateLoginInput({ email, password });
  if (Object.keys(errors).length) throw new AuthError("Enter a valid email and password.", errors);

  const user = userRepository.getByEmail(email);

  if (!user) {
    loginHistoryRepository.record({ userId: "UNKNOWN", email, status: "FAILED", ip: meta.ip, device: meta.device });
    throw new AuthError("Incorrect email or password.");
  }
  if (user.status !== "ACTIVE") {
    loginHistoryRepository.record({ userId: user.id, email, status: "FAILED", ip: meta.ip, device: meta.device });
    throw new AuthError("This account has been suspended. Contact an administrator.");
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    loginHistoryRepository.record({ userId: user.id, email, status: "FAILED", ip: meta.ip, device: meta.device });
    auditService.log({
      userId: user.id,
      userName: user.name,
      action: "FAILED_LOGIN",
      resourceType: "USER",
      resourceId: user.id,
    });
    throw new AuthError("Incorrect email or password.");
  }

  loginHistoryRepository.record({ userId: user.id, email, status: "SUCCESS", ip: meta.ip, device: meta.device });
  auditService.log({ userId: user.id, userName: user.name, action: "LOGIN", resourceType: "USER", resourceId: user.id });

  return toPublicUser(user);
}

export function logout(user) {
  if (!user) return;
  auditService.log({ userId: user.id, userName: user.name, action: "LOGOUT", resourceType: "USER", resourceId: user.id });
}

/** Always succeeds the same way whether or not the email exists, to avoid user enumeration. */
export function requestPasswordReset(email) {
  const user = userRepository.getByEmail(email);
  if (user) {
    auditService.log({
      userId: user.id,
      userName: user.name,
      action: "PASSWORD_RESET_REQUESTED",
      resourceType: "USER",
      resourceId: user.id,
    });
  }
  return true;
}

export async function changePassword(user, { currentPassword, newPassword, confirmPassword }) {
  const errors = validatePasswordChange({ currentPassword, newPassword, confirmPassword });
  if (Object.keys(errors).length) throw new AuthError("Check the highlighted fields.", errors);

  const record = userRepository.getById(user.id);
  const validCurrent = await verifyPassword(currentPassword, record.passwordHash);
  if (!validCurrent) {
    throw new AuthError("Current password is incorrect.", { currentPassword: "Current password is incorrect." });
  }

  const passwordHash = await hashPassword(newPassword);
  userRepository.update(user.id, { passwordHash });
  auditService.log({
    userId: user.id,
    userName: user.name,
    action: "PASSWORD_CHANGED",
    resourceType: "USER",
    resourceId: user.id,
  });
  return true;
}
