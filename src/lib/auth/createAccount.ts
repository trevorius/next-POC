// existing imports...

import 'server-only';
import { generateSalt, hashPassword } from '../auth';
import { prisma } from '../prisma';
import { generatePassword } from '../words';

/**
 * Creates or finds a user and assigns them as an organization owner
 * @param ownerEmail Email of the organization owner
 * @param ownerName Name of the organization owner
 * @returns The user object
 */
export async function createOrFindAccount(
  ownerEmail: string,
  ownerName: string
) {
  // First try to find existing user without selecting password field
  let user: {
    id: string;
    email: string;
    name: string | null;
    password: string | null;
  } | null = await prisma.user.findUnique({
    where: { email: ownerEmail },
    select: { id: true, email: true, name: true, password: true },
  });

  if (user) {
    user.password = null;
  } else {
    const salt = generateSalt();
    const tempPassword = generatePassword();
    const hashedPassword = await hashPassword(tempPassword, salt);

    user = await prisma.user.create({
      data: {
        email: ownerEmail,
        name: ownerName,
        salt,
        password: hashedPassword,
      },
    });
    user.password = tempPassword;
  }

  return user;
}
