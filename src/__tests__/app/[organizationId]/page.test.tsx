const { expect, describe, it } = require('@jest/globals');
import { getUserOrganizations } from '@/app/actions/user';
import { getOrganizationData } from '@/app/organizations/[organizationId]/actions/organization.actions';
import OrganizationPage from '@/app/organizations/[organizationId]/page';
import { auth } from '@/auth';
import { render, screen, waitFor } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    organization: {
      findFirst: jest.fn().mockResolvedValue({
        id: '1',
        name: 'Test Organization',
        _count: {
          members: 1,
          documents: 0,
        },
      }),
    },
    organizationMember: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          role: 'OWNER',
        },
      ]),
    },
  },
}));

// Mock auth and user actions
jest.mock('@/auth');
jest.mock('@/app/actions/user');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock(
  '@/app/organizations/[organizationId]/actions/organization.actions',
  () => ({
    getOrganizationData: jest.fn(),
  })
);

// Mock RequireOrgMembership component
jest.mock('@/components/auth/RequireOrgMembership', () => ({
  RequireOrgMembership: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('OrganizationPage', () => {
  const mockOrg = {
    id: '1',
    name: 'Test Organization',
    members: [{ id: '1', role: 'OWNER', userId: '1' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: '1',
        email: 'test@example.com',
      },
    });
    (getUserOrganizations as jest.Mock).mockResolvedValue([mockOrg]);
    (getOrganizationData as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test Organization',
      _count: {
        members: 1,
        documents: 0,
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays organization name', async () => {
    const params: Promise<{ organizationId: string }> = Promise.resolve({
      organizationId: '1',
    });
    const Component = await OrganizationPage({ params });
    render(Component);

    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
    });
  });

  it('redirects to login if user is not authenticated', async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const params: Promise<{ organizationId: string }> = Promise.resolve({
      organizationId: '1',
    });
    await OrganizationPage({ params });
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to home if organization is not found or user has no access', async () => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock auth to return a valid user
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: '1',
        email: 'test@example.com',
      },
    });

    // Mock both organization-related functions to return null/empty
    (getUserOrganizations as jest.Mock).mockResolvedValue([]);
    (getOrganizationData as jest.Mock).mockResolvedValue(null);

    const params: Promise<{ organizationId: string }> = Promise.resolve({
      organizationId: '10',
    });
    await OrganizationPage({ params });

    // Verify redirect was called
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('displays organization dashboard cards', async () => {
    const params: Promise<{ organizationId: string }> = Promise.resolve({
      organizationId: '1',
    });
    const Component = await OrganizationPage({ params });
    render(Component);

    await waitFor(() => {
      expect(screen.getByText('Members')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Active Members')).toBeInTheDocument();
      expect(screen.getByText('Compliance Score')).toBeInTheDocument();
    });
  });
});
