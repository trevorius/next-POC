import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { render, screen } from '@testing-library/react';

describe('AppSidebar', () => {
  const renderWithProvider = (userRole: 'SUPER_ADMIN' | 'OWNER' | 'USER') => {
    return render(
      <SidebarProvider>
        <AppSidebar userRole={userRole} />
      </SidebarProvider>
    );
  };

  beforeAll(() => {
    process.env.NEXT_PUBLIC_APP_NAME = 'Action Comics';
  });

  it('renders the sidebar title', () => {
    renderWithProvider('SUPER_ADMIN');
    expect(screen.getByText('Action Comics')).toBeInTheDocument();
  });

  describe('Navigation items for different roles', () => {
    it('shows all super admin items for SUPER_ADMIN role', () => {
      renderWithProvider('SUPER_ADMIN');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Organizations')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.queryByText('My Organization')).not.toBeInTheDocument();
      expect(screen.queryByText('Members')).not.toBeInTheDocument();
    });

    it('shows owner-specific items for OWNER role', () => {
      renderWithProvider('OWNER');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Organization')).toBeInTheDocument();
      expect(screen.getByText('Members')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.queryByText('Organizations')).not.toBeInTheDocument();
      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });

    it('shows user-specific items for USER role', () => {
      renderWithProvider('USER');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Organization')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.queryByText('Members')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      expect(screen.queryByText('Organizations')).not.toBeInTheDocument();
      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });
  });

  it('renders navigation items with correct links', () => {
    renderWithProvider('SUPER_ADMIN');

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByText('Organizations').closest('a')).toHaveAttribute(
      'href',
      '/superadmin/organization'
    );
    expect(screen.getByText('Users').closest('a')).toHaveAttribute(
      'href',
      '/superadmin/users'
    );
    expect(screen.getByText('Settings').closest('a')).toHaveAttribute(
      'href',
      '/settings'
    );
  });

  it('renders icons for each navigation item', () => {
    renderWithProvider('SUPER_ADMIN');
    const menuItems = screen.getAllByRole('link');
    menuItems.forEach((item) => {
      expect(item.querySelector('svg')).toBeInTheDocument();
    });
  });
});
