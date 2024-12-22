import { prisma } from '@/lib/prisma';
import { Membership } from '@/types/organization.types';
import { OrganizationRole } from '@prisma/client';
import RoleGuardian from '../components/RoleGuardian';
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

type Props = {
  params: Promise<{ organizationId: string }>;
};

export default async function UsersPage({ params }: Props) {
  const { organizationData } = await (
    await import('../layout')
  ).generateMetadata({ params });

  const users = await getUsersWithRoles(organizationData.organizationId);

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Organization Members</h1>
        <RoleGuardian
          routeParams={{ organizationId: organizationData.organizationId }}
          variant='render'
          userRole={organizationData.userRole}
          roles={[OrganizationRole.OWNER, OrganizationRole.ADMIN]}
        >
          <CreateUserButton
            orgId={organizationData.organizationId}
            currentUserRole={organizationData.userRole ?? OrganizationRole.USER}
          />
        </RoleGuardian>
      </div>
      <UserManagementTable
        users={users}
        currentUserRole={organizationData.userRole}
        orgId={organizationData.organizationId}
      />
    </div>
  );
}
