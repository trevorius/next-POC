'use client';

import { OrganizationSwitcher } from '@/components/organization/organization-switcher';
import { useOrganization } from '@/providers/organization.provider';
import { OrganizationRole } from '@prisma/client';
import { Building2, LayoutDashboard, LogOut, User, Users } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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
  const { organizationState, organizationRoleState } = useOrganization();
  const [organizationRole] = organizationRoleState;
  const [organization] = organizationState;

  const ownerShow = organizationRole?.toString() === OrganizationRole.OWNER;
  const adminShow =
    organizationRole?.toString() === OrganizationRole.ADMIN || ownerShow;
  const userShow =
    organizationRole?.toString() === OrganizationRole.USER || adminShow;

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
      href: `/organizations/${organization?.id}`,
      icon: LayoutDashboard,
      show: session?.user,
    },

    // owner routes
    // owner/admin routes
    {
      name: 'Users',
      href: `/organizations/${organization?.id}/users`,
      icon: Users,
      show: userShow,
    },
    // owner/admin/user routes
  ];
  const SuperAdminNavigation = [
    {
      name: 'Dashboard',
      href: '/superadmin',
      icon: LayoutDashboard,
      show: session?.user,
    },
    {
      name: 'Organizations',
      href: '/superadmin/organization',
      icon: Building2,
      show: session?.user?.isSuperAdmin,
    },
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
        {organization && (
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
            <SidebarSeparator />
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      {session?.user && (
        <SidebarFooter
          className='border-t p-4 group-data-[collapsible=icon]:p-2'
          data-testid='sidebar-footer'
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex items-center gap-3 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center hover:cursor-pointer'>
                <Avatar>
                  <AvatarFallback>
                    {session?.user?.name
                      ? getInitials(session.user.name)
                      : '??'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden'>
                  <span className='text-sm font-medium'>
                    {session?.user?.name}
                  </span>
                  <span className='text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap'>
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-56'>
              <DropdownMenuItem asChild>
                <Link
                  href='/profile'
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <User className='h-4 w-4' />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive focus:text-destructive cursor-pointer'
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className='h-4 w-4 mr-2' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
