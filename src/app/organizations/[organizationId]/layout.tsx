import { getUserOrganizationRole } from '@/app/actions/organization';
import { auth } from '@/auth';
import { OrganizationRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import RoleGuardian from './components/RoleGuardian';

type LayoutProps = {
  children: React.ReactNode;
  params: { organizationId: string };
};

type MetadataProps = {
  params: { organizationId: string };
};

export type OrganizationData = {
  organizationId: string;
  userRole: OrganizationRole | undefined;
  userId: string;
};

// This function can be imported and reused in any server component if needed
export async function getOrganizationData(
  organizationId: string
): Promise<OrganizationData | null> {
  const session = await auth();
  if (!session) return null;

  const userRole = await getUserOrganizationRole(
    organizationId,
    session.user.id
  );

  return {
    organizationId,
    userRole: userRole?.role,
    userId: session.user.id,
  };
}

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
