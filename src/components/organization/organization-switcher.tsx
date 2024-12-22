'use client';

import { getUserOrganizationRole } from '@/app/actions/organization';
import { getUserOrganizations } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganization } from '@/providers/organization.provider';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

type Organization = {
  id: string;
  name: string;
};

export function OrganizationSwitcher() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const { organizationState, organizationRoleState } = useOrganization();
  const [selectedOrg, setSelectedOrg] = organizationState;
  const [, setOrganizationRole] = organizationRoleState;
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = React.useState(true);

  const fetchUserOrganizationRole = async () => {
    if (selectedOrg) {
      setLoading(true);
      try {
        const data = await getUserOrganizationRole(
          selectedOrg.id,
          session?.user?.id ?? ''
        );
        setOrganizationRole(data?.role ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user organization role:', error);
        setLoading(false);
      }
    }
  };

  async function loadOrganizations() {
    setLoading(true);
    try {
      const orgs = await getUserOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0 && !selectedOrg) {
        setSelectedOrg(orgs[0]);
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    loadOrganizations();
  }, [session?.user?.id]);
  React.useEffect(() => {
    fetchUserOrganizationRole();
  }, [selectedOrg]);
  React.useEffect(() => {
    setTimeout(() => {
      if (!pathname.includes('organizations')) setSelectedOrg(null);
      else {
        const organizationId = pathname.split('/')[2];
        const organization = organizations.find(
          (org) => org.id === organizationId
        );
        if (organization) setSelectedOrg(organization);
      }
    }, 400);
  }, [pathname]);

  if (loading) {
    return (
      <Button variant='ghost' className='w-full justify-between' disabled>
        <div className='flex items-center gap-2'>
          <Building2 className='h-4 w-4 shrink-0' />
          <span>Loading...</span>
        </div>
      </Button>
    );
  }

  if (organizations.length === 0) {
    return (
      <Button variant='ghost' className='w-full justify-between' disabled>
        <div className='flex items-center gap-2'>
          <Building2 className='h-4 w-4 shrink-0' />
          <span>No organizations</span>
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'ghost'}
          className='w-full justify-between'
          role='button'
        >
          <div className='flex items-center gap-2 truncate'>
            <Building2 className='h-4 w-4 shrink-0' />
            <span className='truncate'>
              {selectedOrg?.name ?? 'Select organization'}
            </span>
          </div>
          <ChevronDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[--radix-dropdown-menu-trigger-width]'>
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => {
              setSelectedOrg(org);
              router.push(`/organizations/${org.id}`);
            }}
            className='cursor-pointer'
          >
            <Building2 className='mr-2 h-4 w-4 shrink-0' />
            <span className='flex-1 truncate'>{org.name}</span>
            {selectedOrg?.id === org.id && (
              <Check className='ml-auto h-4 w-4' />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
