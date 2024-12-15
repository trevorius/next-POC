'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Building2,
  FileText,
  Home,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';

type NavigationItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: ('SUPER_ADMIN' | 'OWNER' | 'USER')[];
};

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
    roles: ['SUPER_ADMIN', 'OWNER', 'USER'],
  },
  {
    title: 'Organizations',
    href: '/superadmin/organization',
    icon: Building2,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'Users',
    href: '/superadmin/users',
    icon: Users,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'My Organization',
    href: '/organization',
    icon: Building2,
    roles: ['OWNER', 'USER'],
  },
  {
    title: 'Members',
    href: '/organization/members',
    icon: Users,
    roles: ['OWNER'],
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FileText,
    roles: ['OWNER', 'USER'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'OWNER'],
  },
];

interface AppSidebarProps {
  userRole: 'SUPER_ADMIN' | 'OWNER' | 'USER';
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className='flex h-12 items-center gap-2 px-4'>
            <ShieldCheck className='h-6 w-6' />
            <h2 className='text-lg font-semibold tracking-tight'>
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h2>
          </div>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
