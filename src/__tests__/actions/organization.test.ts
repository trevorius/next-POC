import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
} from '@/app/actions/organization';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { words } from '@/lib/words';

// Mock auth and prisma
jest.mock('@/auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    organization: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    organizationMember: {
      create: jest.fn(),
      deleteMany: jest.fn(),
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

    it('should create organization with owner account and return temporary password', async () => {
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

      // Verify organization creation
      expect(result.organization).toEqual(mockOrganization);
      expect(prisma.organization.create).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.organizationMember.create).toHaveBeenCalled();

      // Verify password format
      expect(result.temporaryPassword).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/);
      const passwordParts = result.temporaryPassword.split('-');
      expect(passwordParts).toHaveLength(3);
      passwordParts.forEach((word) => {
        expect(words).toContain(word);
      });
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

  describe('deleteOrganization', () => {
    it('should throw error if user is not super admin', async () => {
      (auth as jest.Mock).mockResolvedValue(mockNonSuperAdminSession);

      await expect(deleteOrganization('1')).rejects.toThrow('Unauthorized');
    });

    it('should delete organization and its members', async () => {
      (auth as jest.Mock).mockResolvedValue(mockSuperAdminSession);

      const organizationId = '1';
      (prisma.organizationMember.deleteMany as jest.Mock).mockResolvedValue({
        count: 2,
      });
      (prisma.organization.delete as jest.Mock).mockResolvedValue({
        id: organizationId,
      });

      await deleteOrganization(organizationId);

      expect(prisma.organizationMember.deleteMany).toHaveBeenCalledWith({
        where: { organizationId },
      });
      expect(prisma.organization.delete).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
    });

    it('should throw error if organization does not exist', async () => {
      (auth as jest.Mock).mockResolvedValue(mockSuperAdminSession);

      (prisma.organization.delete as jest.Mock).mockRejectedValue(
        new Error('Organization not found')
      );

      await expect(deleteOrganization('999')).rejects.toThrow(
        'Organization not found'
      );
    });
  });
});
