'use server';

import { getUserOrganizationRole } from '@/app/actions/organization';
import { auth } from '@/auth';
import { OrganizationData } from '../layout';

// This function can be imported and reused in any server component if needed
export async function getOrganizationData(
  organizationId: string
): Promise<OrganizationData | null> {
  const session = await auth();
  if (!session) return null;

  const userRole = await getUserOrganizationRole(
    organizationId,
    session.user.id
  );

  return {
    organizationId,
    userRole: userRole?.role,
    userId: session.user.id,
  };
}
