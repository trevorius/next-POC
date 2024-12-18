'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import DeleteUserDialog from './DeleteUserDialog';
import RoleSelect from './RoleSelect';

// In UserManagementTable.tsx
type User = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  id: string;
  role: 'OWNER' | 'ADMIN' | 'USER';
  organizationId: string;
  userId: string;
};

export default function UserManagementTable({
  users,
  currentUserRole,
  orgId,
}: {
  users: User[];
  currentUserRole: string;
  orgId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const canManageUser = (userRole: string) => {
    if (currentUserRole === 'OWNER') return true;
    if (currentUserRole === 'ADMIN' && userRole === 'USER') return true;
    return false;
  };

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user.id}>
                <TableCell>{user.user.name}</TableCell>
                <TableCell>{user.user.email}</TableCell>
                <TableCell>
                  {currentUserRole === 'OWNER' ? (
                    <RoleSelect
                      currentRole={user.role}
                      userId={user.user.id}
                      orgId={orgId}
                    />
                  ) : (
                    <span className='capitalize'>
                      {user.role.toLowerCase()}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {canManageUser(user.role) && (
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteDialog(true);
                      }}
                      className='text-red-600 hover:text-red-900 hover:bg-red-50'
                    >
                      <TrashIcon className='h-4 w-4' />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteUserDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        user={selectedUser}
        orgId={orgId}
      />
    </>
  );
}
