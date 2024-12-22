'use server';

import { auth } from '@/auth';
import { createOrFindAccount } from '@/lib/auth/createAccount';
import { prisma } from '@/lib/prisma';
import { OrganizationRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { canManageRole } from '../helpers/roles.helper';

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect('/unauthorized');
  }

  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as OrganizationRole;
  const orgId = formData.get('orgId') as string;

  const currentUserRole = await hasPermission(session.user.id, orgId, [
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
  ]);

  if (!canManageRole(currentUserRole, role)) {
    redirect('/unauthorized');
  }

  const user = await createOrFindAccount(email, name);

  // Create organization membership
  await prisma.organizationMember.create({
    data: {
      organizationId: orgId,
      userId: user.id,
      role,
    },
  });

  revalidatePath(`/organization/${orgId}/users`);
  return { success: true, tempPassword: user.password };
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

export async function updateUserRole(
  userId: string,
  orgId: string,
  newRole: OrganizationRole
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const userRole = await hasPermission(session.user.id, orgId, [
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
  ]);
  if (!userRole) {
    throw new Error('Unauthorized');
  }
  if (!canManageRole(userRole, newRole)) {
    throw new Error('Unauthorized');
  }

  await prisma.organizationMember.update({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
    data: {
      role: newRole,
    },
  });

  revalidatePath(`/organization/${orgId}/users`);
  return { success: true };
}

const hasPermission = async (
  userId: string,
  orgId: string,
  permittedRoles: OrganizationRole[]
) => {
  // Check if current user has permission
  const currentMember = await prisma.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId: userId,
    },
  });
  if (!currentMember) {
    return redirect('/unauthorized');
  }
  const memberHasPermission = permittedRoles.includes(currentMember.role);
  if (!memberHasPermission) {
    return redirect('/unauthorized');
  }
  return currentMember.role;
};
