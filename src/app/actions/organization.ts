'use server';

import { auth } from '@/auth';
import { createOrFindAccount } from '@/lib/auth/createAccount';
import { prisma } from '@/lib/prisma';

interface CreateOrganizationData {
  name: string;
  ownerEmail: string;
  ownerName: string;
}

interface CreateOrganizationResponse {
  organization: {
    id: string;
    name: string;
  };
  ownerEmail: string;
  temporaryPassword: string;
}

export async function createOrganization(
  data: CreateOrganizationData
): Promise<CreateOrganizationResponse> {
  const session = await auth();

  if (!session?.user?.isSuperAdmin) {
    throw new Error('Unauthorized');
  }

  const { name, ownerEmail, ownerName } = data;

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      name,
    },
  });

  const user = await createOrFindAccount(ownerEmail, ownerName);

  // Create organization membership
  await prisma.organizationMember.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  return {
    organization,
    ownerEmail,
    temporaryPassword: user.password || '',
  };
}

export async function getOrganizations() {
  const session = await auth();

  if (!session?.user?.isSuperAdmin) {
    throw new Error('Unauthorized');
  }

  return prisma.organization.findMany({
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteOrganization(organizationId: string) {
  const session = await auth();

  if (!session?.user?.isSuperAdmin) {
    throw new Error('Unauthorized');
  }

  try {
    // Delete all organization members first
    await prisma.organizationMember.deleteMany({
      where: { organizationId },
    });

    // Then delete the organization
    return await prisma.organization.delete({
      where: { id: organizationId },
    });
  } catch {
    throw new Error('Organization not found');
  }
}
export async function getUserOrganizationRole(
  organizationId: string,
  userId: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  try {
    const organizationMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
      select: {
        role: true,
      },
    });

    return organizationMember;
  } catch (error) {
    console.error('Failed to get user organisation role:', error);
    throw new Error('Failed to get user organisation role');
  }
}
