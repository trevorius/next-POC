'use server';

import { auth } from '@/auth';
import { hashPassword } from '@/lib/auth.utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type UpdateProfileData = {
  field: 'name' | 'email' | 'password';
  value: string;
};

const validatePassword = (password: string) => {
  if (password.length < 12) {
    throw new Error('Password must be at least 12 characters long');
  }

  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  return true;
};

export async function updateProfile({ field, value }: UpdateProfileData) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    if (field === 'email') {
      // Validate email format if updating email
      if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Invalid email format');
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: value,
          NOT: {
            id: session.user.id,
          },
        },
      });

      if (existingUser) {
        throw new Error('Email already taken');
      }
    }

    if (field === 'password') {
      // Validate password requirements
      validatePassword(value);
      // Hash the password using Web Crypto API
      const { hash, salt } = await hashPassword(value);
      // Store both hash and salt in the database
      const user = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          password: hash,
          salt: salt,
        },
      });

      revalidatePath('/profile');
      return { success: true, data: user };
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [field]: value,
      },
    });

    revalidatePath('/profile');
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}
