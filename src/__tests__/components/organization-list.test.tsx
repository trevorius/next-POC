import { OrganizationList } from '@/app/superadmin/organization/organization-list';
import { render, screen } from '@testing-library/react';

describe('OrganizationList', () => {
  const mockOrganizations = [
    {
      id: '1',
      name: 'Test Org 1',
      description: null,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      members: [
        {
          id: '1',
          organizationId: '1',
          userId: '1',
          role: 'OWNER',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        {
          id: '2',
          organizationId: '1',
          userId: '2',
          role: 'USER',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          user: {
            id: '2',
            name: 'Jane Doe',
            email: 'jane@example.com',
          },
        },
      ],
    },
    {
      id: '2',
      name: 'Test Org 2',
      description: null,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
      members: [
        {
          id: '3',
          organizationId: '2',
          userId: '3',
          role: 'OWNER',
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
          user: {
            id: '3',
            name: 'Bob Smith',
            email: 'bob@example.com',
          },
        },
      ],
    },
  ];

  it('renders table headers correctly', () => {
    render(<OrganizationList organizations={mockOrganizations} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
  });

  it('renders organization data correctly', () => {
    render(<OrganizationList organizations={mockOrganizations} />);

    // Check organization names
    expect(screen.getByText('Test Org 1')).toBeInTheDocument();
    expect(screen.getByText('Test Org 2')).toBeInTheDocument();

    // Check owner emails
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();

    // Check member counts
    expect(screen.getByText('2')).toBeInTheDocument(); // First org has 2 members
    expect(screen.getByText('1')).toBeInTheDocument(); // Second org has 1 member
  });

  it('formats dates correctly', () => {
    render(<OrganizationList organizations={mockOrganizations} />);

    const date1 = new Date('2023-01-01').toLocaleDateString();
    const date2 = new Date('2023-01-02').toLocaleDateString();

    expect(screen.getByText(date1)).toBeInTheDocument();
    expect(screen.getByText(date2)).toBeInTheDocument();
  });

  it('handles empty organizations array', () => {
    render(<OrganizationList organizations={[]} />);

    // Headers should still be present
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();

    // Check that there are no data rows (excluding header row)
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(1); // Only header row should be present
  });
});
