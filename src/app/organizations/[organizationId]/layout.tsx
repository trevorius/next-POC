import { RequireOrgMembership } from '@/components/auth/RequireOrgMembership';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: {
    organizationId: string;
  };
}

export default function OrganizationLayout({ children, params }: Props) {
  return (
    <RequireOrgMembership organizationId={params.organizationId}>
      {children}
    </RequireOrgMembership>
  );
}
