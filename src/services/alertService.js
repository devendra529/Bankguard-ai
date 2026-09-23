import "server-only";
import * as alertRepository from "@/repositories/alertRepository";
import * as transactionRepository from "@/repositories/transactionRepository";
import * as accountRepository from "@/repositories/accountRepository";
import * as fraudCaseRepository from "@/repositories/fraudCaseRepository";
import * as notificationRepository from "@/repositories/notificationRepository";
import * as auditService from "@/services/auditService";
import { formatCurrency } from "@/lib/utils/format";

export function createFromTransaction(transaction) {
  return alertRepository.create({
    transactionId: transaction.id,
    accountId: transaction.accountId,
    userId: transaction.userId,
    amount: transaction.amount,
    fraudProbability: transaction.fraudProbability,
    riskLevel: transaction.riskLevel,
    reasons: transaction.reasons,
  });
}

export function listAll(filters = {}) {
  let alerts = alertRepository.getAll();
  if (filters.status) alerts = alerts.filter((a) => a.status === filters.status);
  if (filters.riskLevel) alerts = alerts.filter((a) => a.riskLevel === filters.riskLevel);
  if (filters.assignedAnalystId) alerts = alerts.filter((a) => a.assignedAnalystId === filters.assignedAnalystId);
  return alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getById(id) {
  return alertRepository.getById(id);
}

function closeCaseIfAny(alertId, status) {
  const existing = fraudCaseRepository.getByAlertId(alertId);
  if (existing) fraudCaseRepository.update(existing.id, { status });
}

export function assign(alertId, analyst) {
  const updated = alertRepository.update(alertId, { assignedAnalystId: analyst.id, status: "INVESTIGATING" });
  auditService.log({
    userId: analyst.id,
    userName: analyst.name,
    action: "ALERT_ASSIGNED",
    resourceType: "ALERT",
    resourceId: alertId,
    metadata: {},
  });
  return updated;
}

export function investigate(alertId, analyst) {
  const alert = alertRepository.getById(alertId);
  if (!alert) return null;
  const updated = alertRepository.update(alertId, {
    status: "INVESTIGATING",
    assignedAnalystId: alert.assignedAnalystId || analyst.id,
  });
  if (!fraudCaseRepository.getByAlertId(alertId)) {
    fraudCaseRepository.create({
      alertId,
      transactionId: alert.transactionId,
      userId: alert.userId,
      analystId: analyst.id,
      status: "IN_PROGRESS",
    });
  }
  auditService.log({
    userId: analyst.id,
    userName: analyst.name,
    action: "ALERT_INVESTIGATING",
    resourceType: "ALERT",
    resourceId: alertId,
    metadata: {},
  });
  return updated;
}

export function approve(alertId, analyst) {
  const alert = alertRepository.getById(alertId);
  if (!alert) return null;
  const transaction = transactionRepository.getById(alert.transactionId);
  transactionRepository.update(transaction.id, { status: "COMPLETED" });
  accountRepository.adjustBalance(transaction.accountId, -transaction.amount);

  const updated = alertRepository.update(alertId, {
    status: "APPROVED",
    assignedAnalystId: alert.assignedAnalystId || analyst.id,
  });
  closeCaseIfAny(alertId, "CLOSED");

  auditService.log({
    userId: analyst.id,
    userName: analyst.name,
    action: "TRANSACTION_APPROVED",
    resourceType: "TRANSACTION",
    resourceId: transaction.id,
    metadata: { alertId },
  });
  notificationRepository.create({
    userId: alert.userId,
    type: "SECURITY",
    title: "Transaction approved",
    message: `Your transaction of ${formatCurrency(alert.amount)} was reviewed and approved.`,
  });
  return updated;
}

export function block(alertId, analyst) {
  const alert = alertRepository.getById(alertId);
  if (!alert) return null;
  transactionRepository.update(alert.transactionId, { status: "BLOCKED" });

  const updated = alertRepository.update(alertId, {
    status: "BLOCKED",
    assignedAnalystId: alert.assignedAnalystId || analyst.id,
  });
  closeCaseIfAny(alertId, "CLOSED");

  auditService.log({
    userId: analyst.id,
    userName: analyst.name,
    action: "TRANSACTION_BLOCKED",
    resourceType: "TRANSACTION",
    resourceId: alert.transactionId,
    metadata: { alertId },
  });
  notificationRepository.create({
    userId: alert.userId,
    type: "SECURITY",
    title: "Transaction blocked",
    message: `Your transaction of ${formatCurrency(alert.amount)} was blocked after review.`,
  });
  return updated;
}

export function resolve(alertId, analyst, note) {
  const alert = alertRepository.getById(alertId);
  if (!alert) return null;
  if (note) {
    alertRepository.addNote(alertId, {
      analystId: analyst.id,
      analystName: analyst.name,
      note,
      createdAt: new Date().toISOString(),
    });
  }
  const updated = alertRepository.update(alertId, {
    status: "RESOLVED",
    assignedAnalystId: alert.assignedAnalystId || analyst.id,
  });
  closeCaseIfAny(alertId, "CLOSED");

  auditService.log({
    userId: analyst.id,
    userName: analyst.name,
    action: "ALERT_RESOLVED",
    resourceType: "ALERT",
    resourceId: alertId,
    metadata: {},
  });
  return updated;
}

export function addNote(alertId, analyst, note) {
  const entry = { analystId: analyst.id, analystName: analyst.name, note, createdAt: new Date().toISOString() };
  const updated = alertRepository.addNote(alertId, entry);
  auditService.log({
    userId: analyst.id,
    userName: analyst.name,
    action: "ALERT_NOTE_ADDED",
    resourceType: "ALERT",
    resourceId: alertId,
    metadata: {},
  });
  return updated;
}

export function listCasesForAnalyst(analystId) {
  return fraudCaseRepository.getAll().filter((c) => c.analystId === analystId);
}

export function listAllCases() {
  return fraudCaseRepository.getAll();
}
