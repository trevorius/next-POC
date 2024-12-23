'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { OrganizationProvider } from '@/providers/organization.provider';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='h-full'>
      <body className={`${inter.className} h-full`}>
        <SessionProvider>
          <OrganizationProvider>
            <SidebarProvider>
              <div className='flex h-full w-full'>
                <AppSidebar />
                <main className='flex flex-col flex-1 min-h-0 w-full'>
                  <div className='h-14 border-b px-6 flex items-center shrink-0'>
                    <SidebarTrigger />
                  </div>
                  <div className='flex-1 overflow-y-auto p-8'>{children}</div>
                </main>
              </div>
            </SidebarProvider>
          </OrganizationProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
