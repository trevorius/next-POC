'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type UpdateProfileData = {
  field: 'name' | 'email';
  value: string;
};

export async function updateProfile({ field, value }: UpdateProfileData) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    // Validate email format if updating email
    if (field === 'email' && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email format');
    }

    // Check if email is already taken by another user
    if (field === 'email') {
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
