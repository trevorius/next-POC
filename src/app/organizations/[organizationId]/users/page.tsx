import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CreateUserButton from './components/CreateUserButton';
import UserManagementTable from './components/UserManagementTable';

async function getUsersWithRoles(orgId: string) {
  return await prisma.organizationMember.findMany({
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
}

async function getUserRole(orgId: string, userId: string) {
  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId: userId,
    },
  });
  return member?.role;
}

export default async function UsersPage({
  params,
}: {
  params: { orgId: string };
}) {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const userRole = await getUserRole(params.orgId, session.user.id);
  if (!userRole) redirect('/');

  const users = await getUsersWithRoles(params.orgId);

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Organization Members</h1>
        {(userRole === 'OWNER' || userRole === 'ADMIN') && (
          <CreateUserButton orgId={params.orgId} currentUserRole={userRole} />
        )}
      </div>
      <UserManagementTable
        users={users}
        currentUserRole={userRole}
        orgId={params.orgId}
      />
    </div>
  );
}
