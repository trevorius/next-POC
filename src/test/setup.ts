// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { expect, describe, it } = require('@jest/globals');

import '@testing-library/jest-dom';

// Mock next/navigation
const mockRouter = {
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
};

const useRouter = jest.fn(() => mockRouter);

jest.mock('next/navigation', () => ({
  useRouter,
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  redirect: jest.fn(),
  headers: () => new Headers(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = ResizeObserverMock;

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

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

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock next-auth/jwt
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { id: '1', name: 'Test User' } },
    status: 'authenticated',
  })),
  getSession: jest.fn(() => null),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Export for use in tests
export { mockRouter, useRouter };
