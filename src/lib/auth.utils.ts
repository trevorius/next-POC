import { User } from '@prisma/client';

/**
 * Verifies a password against a stored hash using Web Crypto API
 * @param inputPassword - The password to verify
 * @param storedHash - The stored hash to compare against
 * @param storedSalt - The salt used in the original hash
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(
  inputPassword: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const encoder = new TextEncoder();

  // Convert salt from hex string to Uint8Array
  const salt = new Uint8Array(
    storedSalt.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  // Create hash of input password
  const passwordBuffer = encoder.encode(inputPassword);
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...passwordBuffer])
  );

  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const inputHash = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return inputHash === storedHash;
}

/**
 * Generates a new password hash using Web Crypto API
 * @param password - The password to hash
 * @returns Promise<{hash: string, salt: string}> - The hash and salt
 */
export async function hashPassword(
  password: string
): Promise<{ hash: string; salt: string }> {
  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();

  // Create hash
  const passwordBuffer = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...passwordBuffer])
  );

  // Convert to hex strings
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const saltArray = Array.from(salt);

  return {
    hash: hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''),
    salt: saltArray.map((b) => b.toString(16).padStart(2, '0')).join(''),
  };
}

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  isSuperAdmin: boolean;
};

export function sanitizeUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
  };
}
