'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function getUserOrganizations() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

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
      role: true,
    },
  });

  return memberships.map((m) => ({
    ...m.organization,
    role: m.role,
  }));
}
