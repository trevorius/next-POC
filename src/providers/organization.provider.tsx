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

type OrganizationContextType =
  | [Organization | null, Dispatch<SetStateAction<Organization | null>>]
  | null;

export const OrganizationContext = createContext<OrganizationContextType>(null);

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

  return (
    <OrganizationContext.Provider value={[organization, setOrganization]}>
      {children}
    </OrganizationContext.Provider>
  );
};
