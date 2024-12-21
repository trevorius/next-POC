'use client';

import { cn } from '@/lib/utils';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Organizations',
      href: '/superadmin/organization',
      icon: Building2,
      show: session?.user?.isSuperAdmin,
    },
    {
      name: 'Users',
      href: '/superadmin/users',
      icon: Users,
      show: session?.user?.isSuperAdmin,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      show: session?.user?.isSuperAdmin,
    },
  ];

  return (
    <div className='flex h-full flex-col'>
      <div className='flex h-[60px] shrink-0 items-center border-b px-6'>
        <Link href='/' className='flex items-center gap-2 font-semibold'>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </div>

      <ScrollArea className='flex-1'>
        <div className='space-y-1 p-3'>
          {navigation
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
                    pathname === item.href ? 'bg-accent' : 'transparent'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  {item.name}
                </Link>
              );
            })}
        </div>
      </ScrollArea>

      <div data-testid='sidebar-footer' className='shrink-0 border-t p-4'>
        <div className='flex items-center gap-3 px-2'>
          <Avatar>
            <AvatarFallback>
              {session?.user?.name ? getInitials(session.user.name) : '??'}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col overflow-hidden'>
            <span className='text-sm font-medium'>{session?.user?.name}</span>
            <span className='text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap'>
              {session?.user?.email}
            </span>
          </div>
        </div>
        <Separator className='my-4' />
        <Button
          variant='ghost'
          className='w-full justify-start'
          onClick={() => signOut()}
        >
          <LogOut className='mr-2 h-4 w-4' />
          Logout
        </Button>
      </div>
    </div>
  );
}
