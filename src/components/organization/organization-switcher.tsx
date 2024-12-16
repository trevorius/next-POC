'use client';

import { Building2, Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Organization = {
  id: string;
  name: string;
};

export function OrganizationSwitcher() {
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(
    null
  );

  // TODO: Replace with actual data fetching
  const organizations: Organization[] = [
    { id: '1', name: 'Acme Inc' },
    { id: '2', name: 'Monsters Inc' },
    { id: '3', name: 'Stark Industries' },
  ];

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
