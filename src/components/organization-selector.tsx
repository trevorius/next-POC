'use client';

import { getUserOrganizations } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Building2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Organization {
  id: string;
  name: string;
}

export function OrganizationSelector() {
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Organization | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadOrganizations() {
      try {
        const orgs = await getUserOrganizations();
        setOrganizations(orgs);
        if (orgs.length === 1) {
          setSelected(orgs[0]);
          router.push(`/${orgs[0].id}`);
        }
      } catch (error) {
        console.error('Failed to load organizations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadOrganizations();
  }, [router]);

  const handleSelect = (org: Organization) => {
    setSelected(org);
    setOpen(false);
    router.push(`/${org.id}`);
  };

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  if (organizations.length === 0) {
    return <div>No organizations found</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          {selected ? (
            <>
              <Building2 className='mr-2 h-4 w-4' />
              {selected.name}
            </>
          ) : (
            <>
              <Building2 className='mr-2 h-4 w-4' />
              Select organization...
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder='Search organizations...' />
          <CommandList>
            <CommandEmpty>No organizations found</CommandEmpty>
            <CommandGroup>
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => handleSelect(org)}
                  className='cursor-pointer'
                >
                  <Building2 className='mr-2 h-4 w-4' />
                  {org.name}
                  {selected?.id === org.id && (
                    <Check className='ml-auto h-4 w-4' />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
