import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { OrganizationProvider, useOrganization } from './organization.provider';
const { expect, describe, it } = require('@jest/globals');

describe('OrganizationProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <OrganizationProvider>{children}</OrganizationProvider>
  );

  it('should provide null organization by default', () => {
    const { result } = renderHook(() => useOrganization(), { wrapper });
    const [organization] = result.current.organizationState;
    expect(organization).toBeNull();
  });

  it('should update organization when setOrganization is called', () => {
    const { result } = renderHook(() => useOrganization(), { wrapper });
    const mockOrg = { id: '1', name: 'Test Org' };

    act(() => {
      const [, setOrganization] = result.current.organizationState;
      setOrganization(mockOrg);
    });

    const [organization] = result.current.organizationState;
    expect(organization).toEqual(mockOrg);
  });

  it('should provide null organization role by default', () => {
    const { result } = renderHook(() => useOrganization(), { wrapper });
    const [organizationRole] = result.current.organizationRoleState;
    expect(organizationRole).toBeNull();
  });

  it('should update organization role when setOrganizationRole is called', () => {
    const { result } = renderHook(() => useOrganization(), { wrapper });

    act(() => {
      const [, setOrganizationRole] = result.current.organizationRoleState;
      setOrganizationRole('ADMIN');
    });

    const [organizationRole] = result.current.organizationRoleState;
    expect(organizationRole).toBe('ADMIN');
  });
});

it('should throw error when useOrganization is used outside provider', () => {
  expect(() => {
    renderHook(() => useOrganization());
  }).toThrow('useOrganization must be used within an OrganizationProvider');
});
