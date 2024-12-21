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
    const [organization] = result.current;
    expect(organization).toBeNull();
  });

  it('should update organization when setOrganization is called', () => {
    const { result } = renderHook(() => useOrganization(), { wrapper });
    const mockOrg = { id: '1', name: 'Test Org' };

    act(() => {
      const [, setOrganization] = result.current;
      setOrganization(mockOrg);
    });

    const [organization] = result.current;
    expect(organization).toEqual(mockOrg);
  });
});

it('should throw error when useOrganization is used outside provider', () => {
  expect(() => {
    renderHook(() => useOrganization());
  }).toThrow('useOrganization must be used within an OrganizationProvider');
});
