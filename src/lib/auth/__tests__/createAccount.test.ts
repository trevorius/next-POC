import { prisma } from '@/lib/prisma';
import { createOrFindAccount } from '../createAccount';

// Mock prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('createOrFindAccount', () => {
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create new user if one does not exist', async () => {
    // Mock user not found
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock user creation
    const mockUser = { id: '1', email: mockEmail, name: mockName };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await createOrFindAccount(mockEmail, mockName);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true, email: true, name: true, password: true },
    });
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should return existing user if one exists', async () => {
    // Mock existing user
    const mockUser = { id: '1', email: mockEmail, name: mockName };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await createOrFindAccount(mockEmail, mockName);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true, email: true, name: true, password: true },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });
});
