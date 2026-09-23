import "server-only";
import * as auditRepository from "@/repositories/auditRepository";

/** Record one audit-log entry. Every sensitive action in the app calls this. */
export function log({ userId, userName, action, resourceType, resourceId, metadata = {} }) {
  return auditRepository.record({ userId, userName, action, resourceType, resourceId, metadata });
}

export function listAll(filters = {}) {
  let logs = auditRepository.getAll();
  if (filters.action) logs = logs.filter((entry) => entry.action === filters.action);
  if (filters.resourceType) logs = logs.filter((entry) => entry.resourceType === filters.resourceType);
  if (filters.userId) logs = logs.filter((entry) => entry.userId === filters.userId);
  return logs;
}

export function recentActivity(limit = 8) {
  return auditRepository.getAll().slice(0, limit);
}
