import { RequireOrgMembership } from '@/components/auth/RequireOrgMembership';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ organizationId: string }>;
}

export default async function OrganizationLayout({ children, params }: Props) {
  const { organizationId } = await params;

  return (
    <RequireOrgMembership organizationId={organizationId}>
      {children}
    </RequireOrgMembership>
  );
}
