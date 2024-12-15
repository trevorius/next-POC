import { getOrganizations } from '@/app/actions/organization';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { CreateOrganizationDialog } from './create-organization-dialog';
import { OrganizationList } from './organization-list';

export default async function OrganizationManagement() {
  const session = await auth();

  if (!session?.user?.isSuperAdmin) {
    redirect('/unauthorized');
  }

  const organizations = await getOrganizations();

  return (
    <div className='container mx-auto p-8 space-y-8'>
      <div className='flex items-center justify-between border-b pb-4'>
        <h1 className='text-3xl font-bold tracking-tight pr-4'>
          Organization Management
        </h1>
        <CreateOrganizationDialog />
      </div>
      <OrganizationList organizations={organizations} />
    </div>
  );
}
