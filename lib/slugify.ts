import { randomBytes } from "crypto";

/**
 * Generates a short, URL-safe slug.
 * Example: "a3f9c2b1"
 */
export function generateSlug(length = 8): string {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}
