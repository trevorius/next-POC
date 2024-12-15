import { getOrganizations } from '@/app/actions/organization';
import OrganizationManagement from '@/app/superadmin/organization/page';
import { auth } from '@/auth';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock auth
jest.mock('@/auth');
jest.mock('next/navigation');
jest.mock('@/app/actions/organization');

describe('Organization Management Feature', () => {
  describe('Access Control', () => {
    it('should redirect non-superadmin users', async () => {
      // Mock session with non-superadmin user
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: '1',
          email: 'user@example.com',
          isSuperAdmin: false,
        },
      });

      await OrganizationManagement();
      expect(redirect).toHaveBeenCalledWith('/unauthorized');
    });

    it('should allow access to superadmin users', async () => {
      // Mock session with superadmin user
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: '1',
          email: 'admin@example.com',
          isSuperAdmin: true,
        },
      });
      (getOrganizations as jest.Mock).mockResolvedValue([]);

      const { container } = render(await OrganizationManagement());
      expect(container).toBeInTheDocument();
    });
  });

  describe('UI Elements', () => {
    beforeEach(async () => {
      // Mock session with superadmin user for all UI tests
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: '1',
          email: 'admin@example.com',
          isSuperAdmin: true,
        },
      });
      (getOrganizations as jest.Mock).mockResolvedValue([]);
    });

    it('should render the create organization button', async () => {
      render(await OrganizationManagement());
      expect(
        screen.getByRole('button', { name: /create organization/i })
      ).toBeInTheDocument();
    });

    it('should render the organizations list', async () => {
      render(await OrganizationManagement());
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});
