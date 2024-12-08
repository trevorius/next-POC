'use client';

import { getCsrfToken, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';

export default function LoginForm(): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [csrfToken, setCsrfToken] = useState<string>('');

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
      setError('An error occurred');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
      {error && (
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      )}
      <div className='mb-3'>
        <label htmlFor='username' className='form-label'>
          Username
        </label>
        <input
          type='text'
          className='form-control'
          id='username'
          name='username'
          required
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          type='password'
          className='form-control'
          id='password'
          name='password'
          required
        />
      </div>
      <button type='submit' className='btn btn-primary w-100'>
        Sign In
      </button>
    </form>
  );
}
