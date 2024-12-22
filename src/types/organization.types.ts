export type Membership = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  id: string;
  role: 'OWNER' | 'ADMIN' | 'USER';
  organizationId: string;
  userId: string;
};
