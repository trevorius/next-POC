'use client';

import { getUserOrganizations } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

type Organization = {
  id: string;
  name: string;
};

export function OrganizationSwitcher() {
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadOrganizations() {
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

    loadOrganizations();
  }, [selectedOrg]);

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
        <Button variant='ghost' className='w-full justify-between'>
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
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => setSelectedOrg(org)}
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
