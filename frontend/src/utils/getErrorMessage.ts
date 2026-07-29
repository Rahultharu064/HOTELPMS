/** Extracts a human-readable message from a caught error, falling back to a default. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
