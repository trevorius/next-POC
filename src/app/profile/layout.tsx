import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className='container py-6'>
      <div className='flex flex-col gap-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Profile Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and preferences.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
