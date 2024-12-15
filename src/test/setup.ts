import '@testing-library/jest-dom';

// Mock next/navigation
const useRouter = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: () => useRouter(),
  headers: () => new Headers(),
}));

// Set default useRouter mock implementation
useRouter.mockImplementation(() => ({
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock headers
jest.mock('next/headers', () => ({
  headers: () => new Headers(),
  cookies: () => ({
    get: jest.fn(),
    has: jest.fn(),
  }),
}));

// Mock auth
jest.mock('@/auth', () => ({
  auth: jest.fn().mockImplementation(() => ({
    user: {
      id: '1',
      email: 'test@example.com',
      isSuperAdmin: true,
    },
  })),
}));

// Export for use in tests
export { useRouter };

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock next-auth/jwt
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));
