import { getUserOrganizations } from '@/app/actions/user';
import { OrganizationProvider } from '@/providers/organization.provider';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { OrganizationSwitcher } from './organization-switcher';

const { expect, describe, it } = require('@jest/globals');

// Mock the getUserOrganizations function
jest.mock('@/app/actions/user', () => ({
  getUserOrganizations: jest.fn(),
}));

const mockOrganizations = [
  { id: '1', name: 'Org 1' },
  { id: '2', name: 'Org 2' },
];

describe('OrganizationSwitcher', () => {
  const renderComponent = () =>
    render(
      <OrganizationProvider>
        <OrganizationSwitcher />
      </OrganizationProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (getUserOrganizations as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show "No organizations" when no organizations are available', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([]);
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No organizations')).toBeInTheDocument();
    });
  });

  it('should load and display organizations', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);
    renderComponent();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check if first organization is selected by default
    expect(screen.getByText('Org 1')).toBeInTheDocument();
  });

  it('should handle error when loading organizations', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getUserOrganizations as jest.Mock).mockRejectedValue(
      new Error('Failed to load')
    );

    renderComponent();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
