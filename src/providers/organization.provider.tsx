import { OrganizationRole } from '@prisma/client';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type Organization = {
  id: string;
  name: string;
};

type OrganizationContextType = {
  organizationState: [
    Organization | null,
    Dispatch<SetStateAction<Organization | null>>
  ];
  organizationRoleState: [
    OrganizationRole | null,
    Dispatch<SetStateAction<OrganizationRole | null>>
  ];
};

export const OrganizationContext =
  createContext<OrganizationContextType | null>(null);

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    );
  }
  return context;
}

export const OrganizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationRole, setOrganizationRole] =
    useState<OrganizationRole | null>(null);
  return (
    <OrganizationContext.Provider
      value={{
        organizationState: [organization, setOrganization],
        organizationRoleState: [organizationRole, setOrganizationRole],
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
