import { getUserOrganizations } from '@/app/actions/user';
import HomePage from '@/app/page';
import { auth } from '@/auth';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock auth and user actions
jest.mock('@/auth');
jest.mock('@/app/actions/user');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: '1',
        email: 'test@example.com',
      },
    });
  });

  it('redirects to organization page if user has only one organization', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Test Org' },
    ]);

    await HomePage();

    expect(redirect).toHaveBeenCalledWith('/organizations/1');
  });

  it('shows organization selector if user has multiple organizations', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Org 1' },
      { id: '2', name: 'Org 2' },
    ]);

    render(await HomePage());

    expect(screen.getByText(/select your organization/i)).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await HomePage();

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('shows message when user has no organizations', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([]);

    render(await HomePage());

    expect(screen.getByText(/no organizations available/i)).toBeInTheDocument();
  });

  it('displays helper text for organization selection', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Org 1' },
      { id: '2', name: 'Org 2' },
    ]);

    render(await HomePage());

    expect(
      screen.getByText(/choose an organization to continue/i)
    ).toBeInTheDocument();
  });
});
