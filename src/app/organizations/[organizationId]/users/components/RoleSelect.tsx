// src/app/organization/[orgId]/users/components/RoleSelect.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrganizationRole } from '@prisma/client';
import { updateUserRole } from '../actions';

export default function RoleSelect({
  currentRole,
  userId,
  orgId,
}: {
  currentRole: OrganizationRole;
  userId: string;
  orgId: string;
}) {
  const handleRoleChange = async (newRole: string) => {
    // TODO: Implement role change logic with server action
    console.info('Role changed:', { userId, newRole, orgId });
    await updateUserRole(userId, orgId, newRole as OrganizationRole);
  };

  // Determine which roles can be assigned based on the current user's role
  const canAssignOwner = currentRole === OrganizationRole.OWNER;
  const canAssignAdmin = currentRole === OrganizationRole.OWNER;
  const canAssignUser = !!currentRole;

  return (
    <Select onValueChange={handleRoleChange} defaultValue={currentRole}>
      <SelectTrigger className='w-[110px]'>
        <SelectValue placeholder='Select role' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={OrganizationRole.OWNER} disabled={!canAssignOwner}>
          Owner
        </SelectItem>
        <SelectItem value={OrganizationRole.ADMIN} disabled={!canAssignAdmin}>
          Admin
        </SelectItem>
        <SelectItem value={OrganizationRole.USER} disabled={!canAssignUser}>
          User
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
