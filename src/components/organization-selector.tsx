'use client';

import { getUserOrganizations } from '@/app/actions/user';
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

  return <></>;
}
