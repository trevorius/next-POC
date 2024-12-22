import { getUserOrganizationRole } from '@/app/actions/organization';
import { auth } from '@/auth';
import { OrganizationRole } from '@prisma/client';
import { redirect } from 'next/navigation';

type RoleGuardianProps = {
  children: React.ReactNode;
  roles: OrganizationRole[];
  userRole?: OrganizationRole;
  variant: 'redirect' | 'render';
  fallback?: React.ReactNode;
  routeParams: { organizationId: string };
};

export default async function RoleGuardian({
  roles,
  userRole,
  variant,
  children,
  fallback,
  routeParams,
}: RoleGuardianProps) {
  const { organizationId } = routeParams;
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const updatedUserRole =
    userRole ??
    (await getUserOrganizationRole(organizationId, session.user.id))?.role;

  // If user has no role in the organization
  if (!updatedUserRole) {
    if (variant === 'redirect') {
      redirect('/unauthorized');
    }
    return fallback || null;
  }

  // Check if user's role is in the allowed roles array
  const hasPermission = roles.includes(updatedUserRole);

  if (hasPermission) {
    return <>{children}</>;
  }

  // Handle unauthorized access
  if (variant === 'redirect') {
    redirect('/unauthorized');
  }

  return fallback || null;
}
