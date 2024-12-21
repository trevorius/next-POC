'use client';
import { useOrganization } from './organization.provider';

export default function TestOrganizationContext() {
  const [selectedOrg] = useOrganization();
  return (
    <div className='bg-red-500'>
      <p>name: {selectedOrg?.name}</p>
      <p>id: {selectedOrg?.id}</p>
    </div>
  );
}