import { getUserOrganizations } from '@/app/actions/user';
import OrganizationPage from '@/app/organizations/[organizationId]/page';
import { auth } from '@/auth';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock auth and user actions
jest.mock('@/auth');
jest.mock('@/app/actions/user');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
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
    render(await OrganizationPage({ params: { organizationId: '1' } }));
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    await OrganizationPage({ params: { organizationId: '1' } });
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to home if organization is not found', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([
      { id: '2', name: 'Other Org' },
    ]);
    await OrganizationPage({ params: { organizationId: '1' } });
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('redirects to home if user has no organizations', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([]);
    await OrganizationPage({ params: { organizationId: '1' } });
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('displays organization dashboard cards', async () => {
    render(await OrganizationPage({ params: { organizationId: '1' } }));
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Active Members')).toBeInTheDocument();
    expect(screen.getByText('Compliance Score')).toBeInTheDocument();
  });
});
