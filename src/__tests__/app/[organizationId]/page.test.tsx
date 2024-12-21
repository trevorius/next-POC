const { expect, describe, it } = require('@jest/globals');
import { getUserOrganizations } from '@/app/actions/user';
import OrganizationPage from '@/app/organizations/[organizationId]/page';
import { auth } from '@/auth';
import { render, screen, waitFor } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock auth and user actions
jest.mock('@/auth');
jest.mock('@/app/actions/user');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock RequireOrgMembership component
jest.mock('@/components/auth/RequireOrgMembership', () => ({
  RequireOrgMembership: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('OrganizationPage', () => {
  const mockOrg = { id: '1', name: 'Test Organization' };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: '1',
        email: 'test@example.com',
      },
    });
    (getUserOrganizations as jest.Mock).mockResolvedValue([mockOrg]);
  });

  it('displays organization name', async () => {
    const params = { organizationId: '1' };
    const Component = await OrganizationPage({ params });
    render(Component);

    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
    });
  });

  it('redirects to login if user is not authenticated', async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    const params = { organizationId: '1' };
    await OrganizationPage({ params });
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to home if organization is not found', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([
      { id: '2', name: 'Other Org' },
    ]);
    const params = { organizationId: '1' };
    await OrganizationPage({ params });
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('redirects to home if user has no organizations', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([]);
    const params = { organizationId: '1' };
    await OrganizationPage({ params });
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('displays organization dashboard cards', async () => {
    const params = { organizationId: '1' };
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
