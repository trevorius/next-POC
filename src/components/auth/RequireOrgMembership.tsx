import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  organizationId: string;
  children: ReactNode;
}

export async function RequireOrgMembership({
  organizationId,
  children,
}: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Check membership
  const membership = await prisma.organizationMember.findFirst({
    where: {
      organizationId: organizationId,
      userId: session.user.id,
    },
  });

  if (!membership) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
