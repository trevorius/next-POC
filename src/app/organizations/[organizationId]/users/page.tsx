import { getUserOrganizationRole } from '@/app/actions/organization';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Membership } from '@/types/organization.types';
import { OrganizationRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import CreateUserButton from './components/CreateUserButton';
import UserManagementTable from './components/UserManagementTable';

async function getUsersWithRoles(orgId: string) {
  const members: Membership[] = await prisma.organizationMember.findMany({
    where: { organizationId: orgId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return members;
}

export default async function UsersPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  const session = await auth();
  if (!session) redirect('/auth/signin');

  const userRole = await getUserOrganizationRole(
    organizationId,
    session.user.id
  );
  const { role } = userRole || {};

  if (role !== OrganizationRole.OWNER && role !== OrganizationRole.ADMIN)
    redirect('/');

  const users = await getUsersWithRoles(organizationId);

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Organization Members</h1>
        {(role === OrganizationRole.OWNER).toString()}
        {(role === OrganizationRole.OWNER ||
          role === OrganizationRole.ADMIN) && (
          <CreateUserButton orgId={organizationId} currentUserRole={role} />
        )}
      </div>
      <UserManagementTable
        users={users}
        currentUserRole={role}
        orgId={organizationId}
      />
    </div>
  );
}
