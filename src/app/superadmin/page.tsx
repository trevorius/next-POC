import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SuperAdminDashboard() {
  const session = await auth();

  if (!session?.user?.isSuperAdmin) {
    redirect('/unauthorized');
  }

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold'>Super Admin Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Organizations</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
          <p className='text-sm text-muted-foreground'>Total organizations</p>
        </div>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Users</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
          <p className='text-sm text-muted-foreground'>Total users</p>
        </div>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Active Users</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
          <p className='text-sm text-muted-foreground'>Users active today</p>
        </div>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>New Organizations</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
          <p className='text-sm text-muted-foreground'>Created this month</p>
        </div>
      </div>
    </div>
  );
}
