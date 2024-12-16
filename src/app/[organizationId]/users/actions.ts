'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  // const session = await auth();
  // if (!session?.user) {
  //   throw new Error('Unauthorized');
  // }

  // const email = formData.get('email') as string;
  // const role = formData.get('role') as string;
  // const orgId = formData.get('orgId') as string;

  // // Check if current user has permission
  // const currentMember = await prisma.organizationMember.findFirst({
  //   where: {
  //     organizationId: orgId,
  //     userId: session.user.id,
  //   },
  // });

  // if (
  //   !currentMember ||
  //   (currentMember.role !== 'OWNER' && currentMember.role !== 'ADMIN')
  // ) {
  //   throw new Error('Forbidden');
  // }

  // if (currentMember.role === 'ADMIN' && role === 'ADMIN') {
  //   throw new Error('Admins cannot create admin users');
  // }

  // const tempPassword = generateTemporaryPassword();

  // // Create user and add to organization
  // await prisma.user.create({
  //   data: {
  //     email,
  //     password: tempPassword, // In production, hash this password
  //     organizations: {
  //       create: {
  //         organization: {
  //           connect: { id: orgId },
  //         },
  //         role,
  //       },
  //     },
  //   },
  // });

  // revalidatePath(`/organization/${orgId}/users`);
  return { success: true, tempPassword: 'password' };
}

export async function deleteUser(userId: string, orgId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Delete the organization member
  await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  revalidatePath(`/organization/${orgId}/users`);
  return { success: true };
}
