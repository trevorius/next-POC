'use client';

import { OrganizationSwitcher } from '@/components/organization/organization-switcher';
import { Building2, LayoutDashboard, LogOut } from 'lucide-react';
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '../ui/sidebar';

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.isSuperAdmin;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const OrganizationNavigation = [
    {
      name: 'Dashboard',
      href: session?.user?.isSuperAdmin ? '/superadmin' : '/',
      icon: LayoutDashboard,
      show: session?.user,
    },
  ];
  const SuperAdminNavigation = [
    {
      name: 'Organizations',
      href: '/superadmin/organization',
      icon: Building2,
      show: session?.user?.isSuperAdmin,
    },
    // {
    //   name: 'Users',
    //   href: '/superadmin/users',
    //   icon: Users,
    //   show: session?.user?.isSuperAdmin,
    // },
    // {
    //   name: 'Settings',
    //   href: '/settings',
    //   icon: Settings,
    //   show: session?.user?.isSuperAdmin,
    // },
  ];

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='px-6 flex flex-col group-data-[collapsible=icon]:px-2'>
        <Link
          href='/'
          className='flex items-center gap-2 font-semibold group-data-[collapsible=icon]:overflow-hidden'
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        {session?.user && (
          <div className='group-data-[collapsible=icon]:hidden'>
            <OrganizationSwitcher />
          </div>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {isSuperAdmin && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SuperAdminNavigation.filter((item) => item.show).map(
                    (item) => {
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
                    }
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
              <SidebarSeparator />
            </SidebarGroup>
          </>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {OrganizationNavigation.filter((item) => item.show).map(
                (item) => {
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
                }
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {session?.user && (
        <SidebarFooter
          className='border-t p-4 group-data-[collapsible=icon]:p-2'
          data-testid='sidebar-footer'
        >
          <div className='flex items-center gap-3 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'>
            <Avatar>
              <AvatarFallback>
                {session?.user?.name ? getInitials(session.user.name) : '??'}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden'>
              <span className='text-sm font-medium'>{session?.user?.name}</span>
              <span className='text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap'>
                {session?.user?.email}
              </span>
            </div>
          </div>
          <Button
            variant='ghost'
            className='w-full justify-start mt-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mt-2'
            onClick={() => signOut()}
          >
            <LogOut className='mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0' />
            <span className='group-data-[collapsible=icon]:hidden'>Logout</span>
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
