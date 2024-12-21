import { pbkdf2Sync, randomBytes } from 'crypto';

export function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string): string {
  return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(
  password: string,
  salt: string,
  hashedPassword: string
): boolean {
  const hash = hashPassword(password, salt);
  return hash === hashedPassword;
}
