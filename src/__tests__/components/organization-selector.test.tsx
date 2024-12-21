import { getUserOrganizations } from '@/app/actions/user';
import { OrganizationSelector } from '@/components/organization-selector';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

// Mock user actions
jest.mock('@/app/actions/user', () => ({
  getUserOrganizations: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}));

describe('OrganizationSelector', () => {
  const mockOrganizations = [
    { id: '1', name: 'Organization 1' },
    { id: '2', name: 'Organization 2' },
    { id: '3', name: 'Test Organization' },
  ];

  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (getUserOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);
  });

  it('renders combobox with organizations', async () => {
    render(<OrganizationSelector />);

    // Wait for organizations to load
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('filters organizations based on search input', async () => {
    const user = userEvent.setup();
    render(<OrganizationSelector />);

    // Wait for combobox to be available and click it
    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);

    // Wait for popover to be visible
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Type search text
    await user.type(screen.getByPlaceholderText(/search/i), 'Test');

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
      expect(screen.queryByText('Organization 1')).not.toBeInTheDocument();
    });
  });

  it('redirects to organization page when selected', async () => {
    const user = userEvent.setup();
    render(<OrganizationSelector />);

    // Wait for combobox to be available and click it
    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);

    // Wait for popover to be visible
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Click organization
    await user.click(screen.getByText('Organization 1'));

    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  });

  it('shows loading state while fetching organizations', async () => {
    (getUserOrganizations as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<OrganizationSelector />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles empty organizations list', async () => {
    (getUserOrganizations as jest.Mock).mockResolvedValue([]);

    render(<OrganizationSelector />);

    await waitFor(() => {
      expect(screen.getByText(/no organizations found/i)).toBeInTheDocument();
    });
  });

  it('redirects automatically if only one organization', async () => {
    const singleOrg = [{ id: '1', name: 'Single Org' }];
    (getUserOrganizations as jest.Mock).mockResolvedValue(singleOrg);

    render(<OrganizationSelector />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/1');
    });
  });
});
