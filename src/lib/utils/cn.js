/**
 * Tiny className joiner: cn("a", cond && "b", undefined) -> "a b"
 */
export function cn(...parts) {
  return parts.flat().filter(Boolean).join(" ");
}
