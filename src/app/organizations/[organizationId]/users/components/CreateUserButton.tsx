'use client';

import { getManageableRoles } from '@/app/organizations/[organizationId]/helpers/roles.helper';
import { createUser } from '@/app/organizations/[organizationId]/users/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { OrganizationRole } from '@prisma/client';
import { useState } from 'react';

export default function CreateUserButton({
  orgId,
  currentUserRole,
}: {
  orgId: string;
  currentUserRole: OrganizationRole;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData);
    if (result.tempPassword) {
      setTempPassword(result.tempPassword);
    }
  }

  // Get available roles that the current user can manage
  const availableRoles = getManageableRoles(currentUserRole);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <UserPlusIcon className='h-4 w-4 mr-2' />
        Add User
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          {!tempPassword ? (
            <form action={handleSubmit} className='space-y-4'>
              <input type='hidden' name='orgId' value={orgId} />
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  required
                  placeholder='Enter user name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  name='email'
                  required
                  placeholder='Enter user email'
                />
              </div>

              {currentUserRole !== OrganizationRole.USER && (
                <div className='space-y-2'>
                  <Label htmlFor='role'>Role</Label>
                  <Select name='role' defaultValue={OrganizationRole.USER}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type='submit' className='w-full'>
                Add User
              </Button>
            </form>
          ) : (
            <div className='space-y-4'>
              <p>Temporary password for new user:</p>
              <code className='block w-full p-2 bg-muted rounded'>
                {tempPassword}
              </code>
              <Button
                className='w-full'
                onClick={() => {
                  setTempPassword('');
                  setIsOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
