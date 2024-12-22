import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cache, ReactNode } from 'react';

interface Props {
  organizationId: string;
  children: ReactNode;
}

const getMembership = cache(async (organizationId: string, userId: string) => {
  return prisma.organizationMember.findFirst({
    where: {
      organizationId,
      userId,
    },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
});

export async function RequireOrgMembership({
  organizationId,
  children,
}: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Check membership using cached function
  const membership = await getMembership(organizationId, session.user.id);

  if (!membership) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
