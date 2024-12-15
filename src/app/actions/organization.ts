'use server';

import { auth } from '@/auth';
import { generateSalt, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface CreateOrganizationData {
  name: string;
  ownerEmail: string;
  ownerName: string;
}

export async function createOrganization(data: CreateOrganizationData) {
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

  // Create owner account
  const salt = generateSalt();
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await hashPassword(tempPassword, salt);

  const user = await prisma.user.create({
    data: {
      email: ownerEmail,
      name: ownerName,
      salt,
      password: hashedPassword,
    },
  });

  // Create organization membership
  await prisma.organizationMember.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  return organization;
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
