'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function getUserOrganizations() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  // If user is super admin, return all organizations
  if (session.user.isSuperAdmin) {
    return prisma.organization.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  // Otherwise, return organizations where user is a member
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return memberships.map((m) => m.organization);
}
