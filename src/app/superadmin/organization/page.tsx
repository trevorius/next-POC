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
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold'>Organization Management</h1>
        <CreateOrganizationDialog />
      </div>
      <OrganizationList organizations={organizations} />
    </div>
  );
}
