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
  };

  return (
    <Select onValueChange={handleRoleChange} defaultValue={currentRole}>
      <SelectTrigger className='w-[110px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={OrganizationRole.USER}>User</SelectItem>
        <SelectItem value={OrganizationRole.ADMIN}>Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
