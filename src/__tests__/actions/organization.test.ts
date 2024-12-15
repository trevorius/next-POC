import {
  createOrganization,
  getOrganizations,
} from '@/app/actions/organization';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Mock auth and prisma
jest.mock('@/auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    organization: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    organizationMember: {
      create: jest.fn(),
    },
  },
}));

describe('Organization Server Actions', () => {
  const mockSuperAdminSession = {
    user: {
      id: '1',
      email: 'admin@example.com',
      isSuperAdmin: true,
    },
  };

  const mockNonSuperAdminSession = {
    user: {
      id: '2',
      email: 'user@example.com',
      isSuperAdmin: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrganization', () => {
    const mockOrganizationData = {
      name: 'Test Organization',
      ownerEmail: 'owner@example.com',
      ownerName: 'Test Owner',
    };

    it('should throw error if user is not super admin', async () => {
      (auth as jest.Mock).mockResolvedValue(mockNonSuperAdminSession);

      await expect(createOrganization(mockOrganizationData)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should create organization with owner account', async () => {
      (auth as jest.Mock).mockResolvedValue(mockSuperAdminSession);

      const mockOrganization = { id: '1', ...mockOrganizationData };
      const mockUser = {
        id: '2',
        email: mockOrganizationData.ownerEmail,
        name: mockOrganizationData.ownerName,
      };

      (prisma.organization.create as jest.Mock).mockResolvedValue(
        mockOrganization
      );
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.organizationMember.create as jest.Mock).mockResolvedValue({
        id: '3',
        organizationId: mockOrganization.id,
        userId: mockUser.id,
        role: 'OWNER',
      });

      const result = await createOrganization(mockOrganizationData);

      expect(result).toEqual(mockOrganization);
      expect(prisma.organization.create).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.organizationMember.create).toHaveBeenCalled();
    });
  });

  describe('getOrganizations', () => {
    it('should throw error if user is not super admin', async () => {
      (auth as jest.Mock).mockResolvedValue(mockNonSuperAdminSession);

      await expect(getOrganizations()).rejects.toThrow('Unauthorized');
    });

    it('should return list of organizations', async () => {
      (auth as jest.Mock).mockResolvedValue(mockSuperAdminSession);

      const mockOrganizations = [
        { id: '1', name: 'Org 1' },
        { id: '2', name: 'Org 2' },
      ];

      (prisma.organization.findMany as jest.Mock).mockResolvedValue(
        mockOrganizations
      );

      const result = await getOrganizations();

      expect(result).toEqual(mockOrganizations);
      expect(prisma.organization.findMany).toHaveBeenCalled();
    });
  });
});
