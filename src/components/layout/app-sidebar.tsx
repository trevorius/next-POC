'use client';

import { OrganizationSwitcher } from '@/components/organization/organization-switcher';
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

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
      href: session?.user?.isSuperAdmin ? '/superadmin' : '/',
      icon: LayoutDashboard,
      show: session?.user,
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
    <Sidebar>
      <SidebarHeader className=' px-6 flex flex-col'>
        <Link href='/' className='flex items-center gap-2 font-semibold'>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        {session?.user && <OrganizationSwitcher />}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation
                .filter((item) => item.show)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.href}
                          className='flex items-center gap-3'
                        >
                          <Icon className='h-4 w-4' />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {session?.user && (
        <SidebarFooter className='border-t p-4' data-testid='sidebar-footer'>
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
          <Button
            variant='ghost'
            className='w-full justify-start mt-4'
            onClick={() => signOut()}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
