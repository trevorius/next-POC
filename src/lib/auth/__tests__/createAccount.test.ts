import { prisma } from '@/lib/prisma';

import { generateSalt, hashPassword } from '../../auth';
import { generatePassword } from '../../words';
import { createOrFindAccount } from '../createAccount';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../../auth', () => ({
  generateSalt: jest.fn(),
  hashPassword: jest.fn(),
}));

jest.mock('../../words', () => ({
  generatePassword: jest.fn(),
}));

describe('createOrFindAccount', () => {
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';
  const mockSalt = 'mockedSalt123';
  const mockTempPassword = 'tempPass123';
  const mockHashedPassword = 'hashedPass123';

  beforeEach(() => {
    jest.clearAllMocks();
    (generateSalt as jest.Mock).mockReturnValue(mockSalt);
    (generatePassword as jest.Mock).mockReturnValue(mockTempPassword);
    (hashPassword as jest.Mock).mockResolvedValue(mockHashedPassword);
  });

  it('should create new user if one does not exist', async () => {
    // Mock user not found
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock user creation
    const mockUser = {
      id: '1',
      email: mockEmail,
      name: mockName,
      salt: mockSalt,
      password: mockHashedPassword,
    };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await createOrFindAccount(mockEmail, mockName);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true, email: true, name: true, password: true },
    });
    expect(generateSalt).toHaveBeenCalled();
    expect(generatePassword).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith(mockTempPassword, mockSalt);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: mockEmail,
        name: mockName,
        salt: mockSalt,
        password: mockHashedPassword,
      },
    });
    expect(result).toEqual({
      ...mockUser,
      password: mockTempPassword, // Should return temp password for new users
    });
  });

  it('should return existing user if one exists', async () => {
    // Mock existing user
    const mockUser = {
      id: '1',
      email: mockEmail,
      name: mockName,
      password: 'existingHashedPass',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await createOrFindAccount(mockEmail, mockName);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true, email: true, name: true, password: true },
    });
    expect(generateSalt).not.toHaveBeenCalled();
    expect(generatePassword).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      ...mockUser,
      password: null, // Should return null password for existing users
    });
  });
});
