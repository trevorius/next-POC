'use client';

import { cn } from '@/lib/utils';
import {
  Building2,
  FileText,
  Home,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

interface SidebarProps {
  userRole: 'SUPER_ADMIN' | 'OWNER' | 'USER';
  className?: string;
}
export function Sidebar({ userRole, className }: SidebarProps) {
  const pathname = usePathname();
export function Sidebar({ userRole }: SidebarProps) {
  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <ShieldCheck className='h-6 w-6' />
        <h2 className='text-lg font-semibold'>Loi 25</h2>
      </div>
      <nav className='flex-1 space-y-1 p-4'>
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              )}
            >
              <Icon className='h-4 w-4' />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
