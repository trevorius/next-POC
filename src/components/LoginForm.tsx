'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';

export default function LoginForm(): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCsrf = async () => {
      const token = await getCsrfToken();
      if (token) {
        setCsrfToken(token);
      }
    };
    getCsrf();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await signIn('credentials', {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        csrfToken: csrfToken,
        redirect: false,
        callbackUrl: '/',
      });

      if (response?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className='space-y-2'>
        <Label htmlFor='username'>Username</Label>
        <Input
          id='username'
          name='username'
          type='text'
          required
          autoComplete='username'
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          name='password'
          type='password'
          required
          autoComplete='current-password'
        />
      </div>
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
