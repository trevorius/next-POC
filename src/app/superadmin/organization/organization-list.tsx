import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Organization, OrganizationMember } from '@prisma/client';

interface OrganizationWithMembers extends Organization {
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
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => {
            const owner = org.members.find((member) => member.role === 'OWNER');
            return (
              <TableRow key={org.id}>
                <TableCell className='font-medium'>{org.name}</TableCell>
                <TableCell>{owner?.user.email}</TableCell>
                <TableCell>{org.members.length}</TableCell>
                <TableCell>
                  {new Date(org.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
