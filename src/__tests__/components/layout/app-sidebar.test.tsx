import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { OrganizationProvider } from '@/providers/organization.provider';
import { render, screen } from '@testing-library/react';
const { expect, describe, it } = require('@jest/globals');

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        isSuperAdmin: true,
      },
    },
    status: 'authenticated',
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const renderWithSession = (component: React.ReactNode) => {
  return render(
    <SidebarProvider>
      <OrganizationProvider>{component}</OrganizationProvider>
    </SidebarProvider>
  );
};

describe('AppSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile section with name', () => {
    renderWithSession(<AppSidebar />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders user email in profile section', () => {
    renderWithSession(<AppSidebar />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders profile section in footer', () => {
    renderWithSession(<AppSidebar />);
    const footer = screen.getByTestId('sidebar-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toContainElement(screen.getByText('John Doe'));
  });

  it('renders user avatar with initials', () => {
    renderWithSession(<AppSidebar />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders navigation links based on user role', () => {
    renderWithSession(<AppSidebar />);
    // Super admin should see Organizations link
    expect(
      screen.getByRole('link', { name: /organizations/i })
    ).toBeInTheDocument();
  });
});
