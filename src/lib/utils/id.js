/**
 * Generates the next sequential, zero-padded id for a record collection,
 * e.g. nextSequentialId(users, "USR") -> "USR-0021" when USR-0020 is the highest.
 */
export function nextSequentialId(records, prefix, padLength = 4) {
  let max = 0;
  for (const record of records) {
    const match = typeof record?.id === "string" && record.id.match(/-(\d+)$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return `${prefix}-${String(max + 1).padStart(padLength, "0")}`;
}

/** 16-digit account number, formatted only for display (see maskAccountNumber). */
export function generateAccountNumber() {
  let digits = "";
  for (let i = 0; i < 16; i += 1) digits += Math.floor(Math.random() * 10);
  return digits;
}
