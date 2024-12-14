import { User } from '@prisma/client';
import crypto from 'crypto';

export function verifyPassword(
  inputPassword: string,
  hashedPassword: string,
  salt: string
): boolean {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  return inputHash === hashedPassword;
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
