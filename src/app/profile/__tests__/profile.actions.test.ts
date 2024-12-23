import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateProfile } from '../profile.actions';
const { expect, it, describe, beforeEach } = require('@jest/globals');

// Mock dependencies
jest.mock('@/auth');
jest.mock('@/lib/prisma', () => {
  return {
    prisma: {
      user: {
        update: jest.fn(),
        findFirst: jest.fn(),
      },
    },
  };
});
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('updateProfile', () => {
  // Mock data
  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockSession = {
    user: mockUser,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Default auth mock to return a valid session
    (auth as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should throw error if user is not authenticated', async () => {
      // Mock auth to return null session
      (auth as jest.Mock).mockResolvedValue(null);

      const result = await updateProfile({
        field: 'name',
        value: 'New Name',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw error if session has no user', async () => {
      // Mock auth to return session without user
      (auth as jest.Mock).mockResolvedValue({ user: null });

      const result = await updateProfile({
        field: 'name',
        value: 'New Name',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('Email Updates', () => {
    it('should validate email format', async () => {
      const result = await updateProfile({
        field: 'email',
        value: 'invalid-email',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email format');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should check for existing email', async () => {
      // Mock finding an existing user with the same email
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({
        id: 'other-user',
        email: 'new@example.com',
      });

      const result = await updateProfile({
        field: 'email',
        value: 'new@example.com',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already taken');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should allow updating to a unique email', async () => {
      // Mock no existing user with the email
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      // Mock successful update
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: 'new@example.com',
      });

      const result = await updateProfile({
        field: 'email',
        value: 'new@example.com',
      });

      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { email: 'new@example.com' },
      });
    });
  });

  describe('Name Updates', () => {
    it('should update user name', async () => {
      // Mock successful update
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        name: 'New Name',
      });

      const result = await updateProfile({
        field: 'name',
        value: 'New Name',
      });

      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { name: 'New Name' },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle prisma errors', async () => {
      // Mock prisma error
      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const result = await updateProfile({
        field: 'name',
        value: 'New Name',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });
});
