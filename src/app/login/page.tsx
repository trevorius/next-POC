import LoginForm from '@/components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

export default function LoginPage(): React.ReactElement {
  return (
    <div className='container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold text-center'>
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
