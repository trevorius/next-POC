'use client';

import { deleteOrganization } from '@/app/actions/organization';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Organization, OrganizationMember } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface OrganizationWithMembers extends Organization {
  members: (OrganizationMember & {
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  })[];
}

interface OrganizationListProps {
  organizations: OrganizationWithMembers[];
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (organizationId: string) => {
    setSelectedOrganization(organizationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrganization) return;

    try {
      await deleteOrganization(selectedOrganization);
      router.refresh();
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to delete organization');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedOrganization(null);
    }
  };

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => {
              const owner = org.members.find(
                (member) => member.role === 'OWNER'
              );
              return (
                <TableRow key={org.id}>
                  <TableCell className='font-medium'>{org.name}</TableCell>
                  <TableCell>{owner?.user.email}</TableCell>
                  <TableCell>{org.members.length}</TableCell>
                  <TableCell>
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='destructive'
                      size='icon'
                      onClick={() => handleDelete(org.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this organization? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <div className='mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
          {error}
        </div>
      )}
    </>
  );
}
