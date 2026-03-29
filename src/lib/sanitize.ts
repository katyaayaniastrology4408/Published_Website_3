// Strip HTML tags and dangerous characters to prevent XSS/injection
export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>"'`]/g, "") // strip remaining dangerous chars
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(input: unknown): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().toLowerCase().slice(0, 254);
  // Basic RFC 5322 email check
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed) ? trimmed : "";
}

export function sanitizePhone(input: unknown): string {
  if (typeof input !== "string") return "";
  // Keep only digits, +, -, spaces, parentheses
  return input.replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 20);
}
