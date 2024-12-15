import { auth } from '@/auth';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.has('sidebar:state');

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
