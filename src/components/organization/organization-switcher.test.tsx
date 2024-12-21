import { getUserOrganizations } from '@/app/actions/user';
import { OrganizationProvider } from '@/providers/organization.provider';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { OrganizationSwitcher } from './organization-switcher';

const { expect, describe, it } = require('@jest/globals');

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock getUserOrganizations
jest.mock('@/app/actions/user', () => ({
  getUserOrganizations: jest.fn(),
}));

const mockOrganizations = [
  { id: '1', name: 'Org 1' },
  { id: '2', name: 'Org 2' },
];

describe('OrganizationSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: '1', name: 'Test User' } },
      status: 'authenticated',
    });
  });

  const renderComponent = () =>
    render(
      <OrganizationProvider>
        <OrganizationSwitcher />
      </OrganizationProvider>
    );

  it('should show loading state initially', async () => {
    (getUserOrganizations as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    await act(async () => {
      renderComponent();
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show "No organizations" when no organizations are available', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByText('No organizations')).toBeInTheDocument();
    });
  });

  it('should load and display organizations', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Org 1')).toBeInTheDocument();
  });

  it('should handle error when loading organizations', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getUserOrganizations as jest.Mock).mockRejectedValue(
      new Error('Failed to load')
    );

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
