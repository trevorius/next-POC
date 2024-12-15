import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  // Determine user role
  let userRole: 'SUPER_ADMIN' | 'OWNER' | 'USER' = 'USER';
  if (session?.user?.isSuperAdmin) {
    userRole = 'SUPER_ADMIN';
  } else if (session?.user?.organizationRole === 'OWNER') {
    userRole = 'OWNER';
  }

  return (
    <html lang='en'>
      <body>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className='flex min-h-screen'>
            <AppSidebar userRole={userRole} />
            <main className='flex-1'>
              <SidebarTrigger />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
