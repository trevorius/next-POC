'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import React from 'react';

export default function LogoutButton(): React.ReactElement {
  return (
    <Button
      variant='outline'
      onClick={() => signOut({ callbackUrl: '/login' })}
      className='absolute top-4 right-4'
    >
      Sign Out
    </Button>
  );
}
