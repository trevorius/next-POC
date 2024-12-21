const { expect, describe, it } = require('@jest/globals');
import { createOrganization } from '@/app/actions/organization';
import { CreateOrganizationDialog } from '@/app/superadmin/organization/create-organization-dialog';
import { mockRouter } from '@/test/setup';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the organization actions
jest.mock('@/app/actions/organization', () => ({
  createOrganization: jest.fn(),
}));

describe('CreateOrganizationDialog', () => {
  const mockResponse = {
    organization: {
      id: '1',
      name: 'Test Org',
    },
    ownerEmail: 'john@example.com',
    temporaryPassword: 'word1-word2-word3',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create organization button', () => {
    render(<CreateOrganizationDialog />);
    expect(
      screen.getByRole('button', { name: /create organization/i })
    ).toBeInTheDocument();
  });

  it('opens dialog when button is clicked', () => {
    render(<CreateOrganizationDialog />);
    fireEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows form fields in dialog', () => {
    render(<CreateOrganizationDialog />);
    fireEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner email/i)).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const mockData = {
      name: 'Test Org',
      ownerName: 'John Doe',
      ownerEmail: 'john@example.com',
    };

    (createOrganization as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<CreateOrganizationDialog />);
    fireEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    fireEvent.change(screen.getByLabelText(/organization name/i), {
      target: { value: mockData.name },
    });
    fireEvent.change(screen.getByLabelText(/owner name/i), {
      target: { value: mockData.ownerName },
    });
    fireEvent.change(screen.getByLabelText(/owner email/i), {
      target: { value: mockData.ownerEmail },
    });

    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(createOrganization).toHaveBeenCalledWith(mockData);
      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    // Verify success state
    expect(screen.getByText('Organization Created')).toBeInTheDocument();
    expect(
      screen.getByText(mockResponse.organization.name)
    ).toBeInTheDocument();
    expect(screen.getByText(mockResponse.ownerEmail)).toBeInTheDocument();
    expect(
      screen.getByText(mockResponse.temporaryPassword)
    ).toBeInTheDocument();
  });

  it('handles submission errors', async () => {
    const mockError = new Error('Failed to create');
    (createOrganization as jest.Mock).mockRejectedValueOnce(mockError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<CreateOrganizationDialog />);
    fireEvent.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    // Fill in required fields to enable submit button
    fireEvent.change(screen.getByLabelText(/organization name/i), {
      target: { value: 'Test Org' },
    });
    fireEvent.change(screen.getByLabelText(/owner name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/owner email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to create organization:',
        mockError
      );
    });

    consoleSpy.mockRestore();
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    (createOrganization as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<CreateOrganizationDialog />);
    await user.click(
      screen.getByRole('button', { name: /create organization/i })
    );

    // Fill in required fields to enable submit button
    await user.type(screen.getByLabelText(/organization name/i), 'Test Org');
    await user.type(screen.getByLabelText(/owner name/i), 'John Doe');
    await user.type(screen.getByLabelText(/owner email/i), 'john@example.com');

    const submitButton = screen.getByRole('button', { name: /^create$/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Creating...');
  });

  it('resets form when dialog is closed', async () => {
    const user = userEvent.setup();
    render(<CreateOrganizationDialog />);

    // Open dialog and fill form
    await user.click(
      screen.getByRole('button', { name: /create organization/i })
    );
    await user.type(screen.getByLabelText(/organization name/i), 'Test Org');
    await user.type(screen.getByLabelText(/owner name/i), 'John Doe');
    await user.type(screen.getByLabelText(/owner email/i), 'john@example.com');

    // Close dialog
    await user.click(screen.getByRole('button', { name: /close/i }));

    // Reopen dialog and check fields are empty
    await user.click(
      screen.getByRole('button', { name: /create organization/i })
    );
    expect(screen.getByLabelText(/organization name/i)).toHaveValue('');
    expect(screen.getByLabelText(/owner name/i)).toHaveValue('');
    expect(screen.getByLabelText(/owner email/i)).toHaveValue('');
  });
});
