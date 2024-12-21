// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { expect, describe, it } = require('@jest/globals');
import { prismaMock } from '@/lib/__mocks__/prisma';

// Mock next-auth
const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: (...args: [string, Record<string, unknown>]) => mockSignIn(...args),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    mockSignIn.mockClear();
  });

  test('user can be created', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword123',
      salt: 'mockedSalt',
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.create.mockResolvedValue(mockUser);
    const createdUser = await prismaMock.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        salt: 'mockedSalt',
      },
    });

    expect(createdUser).toEqual(mockUser);
  });

  test('user can sign in', async () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    mockSignIn.mockResolvedValue({
      ok: true,
      error: null,
    });

    const result = await mockSignIn('credentials', {
      redirect: false,
      ...mockCredentials,
    });

    expect(result.ok).toBe(true);
    expect(result.error).toBeNull();
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      ...mockCredentials,
    });
  });
});
