'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';
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
    <html lang='en'>
      <body className={cn(inter.className, 'flex h-screen')}>
        <SessionProvider>
          <div className='w-64 border-r'>
            <AppSidebar />
          </div>
          <main className='flex-1 overflow-y-auto p-8'>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
