/**
 * hashEmail.js - Utility function to hash an email address using SHA-256.
 *
 * This function is used to securely hash email addresses before storing or sending them.
 * Hashing ensures that sensitive data remains protected and non-reversible.
 *
 * - Uses the SubtleCrypto API to perform SHA-256 hashing.
 * - Encodes the email into a Uint8Array before hashing.
 * - Converts the hash result into a hexadecimal string.
 *
 * Usage:
 *   import { hashEmail } from "@/utils/hashedEmail";
 *   const hashed = await hashEmail("user@example.com");
 *
 * @param {string} email - The email address to be hashed.
 * @returns {Promise<string>} - A SHA-256 hashed representation of the email in hexadecimal format.
 */

export async function hashEmail(email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
