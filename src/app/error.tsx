'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4'>
      <h1 className='text-4xl font-bold tracking-tight'>
        {error.digest ? `Error ${error.digest}` : 'Something went wrong!'}
      </h1>
      <div className='space-y-2'>
        <p className='text-xl text-muted-foreground'>
          {error.message ||
            'An unexpected error occurred. Please try again later.'}
        </p>
      </div>
      <div className='flex gap-4'>
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant='outline' onClick={() => (window.location.href = '/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
