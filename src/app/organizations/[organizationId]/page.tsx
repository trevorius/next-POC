import { auth } from '@/auth';
import { RequireOrgMembership } from '@/components/auth/RequireOrgMembership';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getOrganizationData } from './actions/organization.actions';

const getFullOrganizationData = cache(
  async (organizationId: string, userId: string) => {
    return prisma.organization.findFirst({
      where: {
        id: organizationId,
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }
);

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const session = await auth();
  const { organizationId } = await params;
  if (!session?.user) {
    redirect('/login');
  }

  const organizationMember = await getOrganizationData(organizationId);
  if (!organizationMember) {
    redirect('/');
  }
  const organization = await getFullOrganizationData(
    organizationId,
    session?.user?.id
  );

  if (!organization) {
    redirect('/');
  }

  return (
    <RequireOrgMembership organizationId={organizationId}>
      <div className='space-y-8'>
        <h1 className='text-3xl font-bold tracking-tight'>
          {organization?.name}
        </h1>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-lg border bg-card p-6'>
            <h3 className='text-lg font-semibold'>Members</h3>
            <p className='mt-2 text-3xl font-bold'>
              {organization?._count.members}
            </p>
            <p className='text-sm text-muted-foreground'>Total members</p>
          </div>
          <div className='rounded-lg border bg-card p-6'>
            <h3 className='text-lg font-semibold'>Documents</h3>
            <p className='mt-2 text-3xl font-bold'>0</p>
            <p className='text-sm text-muted-foreground'>Total documents</p>
          </div>
          <div className='rounded-lg border bg-card p-6'>
            <h3 className='text-lg font-semibold'>Active Members</h3>
            <p className='mt-2 text-3xl font-bold'>0</p>
            <p className='text-sm text-muted-foreground'>
              Members active today
            </p>
          </div>
          <div className='rounded-lg border bg-card p-6'>
            <h3 className='text-lg font-semibold'>Compliance Score</h3>
            <p className='mt-2 text-3xl font-bold'>0%</p>
            <p className='text-sm text-muted-foreground'>Overall compliance</p>
          </div>
        </div>
      </div>
    </RequireOrgMembership>
  );
}
