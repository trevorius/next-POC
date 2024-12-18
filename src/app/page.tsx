import { getUserOrganizations } from '@/app/actions/user';
import { auth } from '@/auth';
import { OrganizationSelector } from '@/components/organization-selector';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const organizations = await getUserOrganizations();

  // If user has no organizations, show message
  if (organizations.length === 0) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>No Organizations Available</h1>
          <p className='mt-2 text-muted-foreground'>
            You are not a member of any organizations.
          </p>
        </div>
      </div>
    );
  }

  // If user has exactly one organization, redirect to it
  if (organizations.length === 1) {
    redirect(`/organizations/${organizations[0].id}`);
  }

  // If user has multiple organizations, show selector
  return (
    <div className='flex h-full items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Select Your Organization</h1>
        <p className='mt-2 mb-4 text-muted-foreground'>
          Choose an organization to continue
        </p>
        <OrganizationSelector />
      </div>
    </div>
  );
}
