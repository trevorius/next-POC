import { OrganizationRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getOrganizationData } from './actions/organization.actions';
import RoleGuardian from './components/RoleGuardian';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
};

type MetadataProps = {
  params: Promise<{ organizationId: string }>;
};

export type OrganizationData = {
  organizationId: string;
  userRole: OrganizationRole | undefined;
  userId: string;
};

export default async function OrganizationLayout({
  children,
  params,
}: LayoutProps) {
  const { organizationId } = await params;
  const data = await getOrganizationData(organizationId);

  if (!data) {
    redirect('/auth/signin');
  }
  if (!data.userRole) {
    redirect('/');
  }

  return (
    <RoleGuardian
      routeParams={{ organizationId }}
      roles={[
        OrganizationRole.OWNER,
        OrganizationRole.ADMIN,
        OrganizationRole.USER,
      ]}
      variant='redirect'
      userRole={data.userRole}
    >
      {children}
    </RoleGuardian>
  );
}

// Make organization data available to all pages under this layout
export const generateMetadata = async ({ params }: MetadataProps) => {
  const data = await getOrganizationData((await params).organizationId);
  if (!data) redirect('/auth/signin');
  return { organizationData: data };
};
