import { getUserOrganizations } from '@/app/actions/user';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const session = await auth();
  const organizationId = (await params).organizationId;

  if (!session?.user) {
    redirect('/login');
  }

  const organizations = await getUserOrganizations();
  const organization = organizations.find((org) => org.id === organizationId);

  if (!organization) {
    redirect('/');
  }

  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold tracking-tight'>
        {organization?.name}
      </h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Members</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
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
          <p className='text-sm text-muted-foreground'>Members active today</p>
        </div>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Compliance Score</h3>
          <p className='mt-2 text-3xl font-bold'>0%</p>
          <p className='text-sm text-muted-foreground'>Overall compliance</p>
        </div>
      </div>
    </div>
  );
}
