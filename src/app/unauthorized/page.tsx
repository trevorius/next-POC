import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4'>
      <h1 className='text-4xl font-bold tracking-tight'>401</h1>
      <div className='space-y-2'>
        <h2 className='text-2xl font-semibold'>Unauthorized Access</h2>
        <p className='text-xl text-muted-foreground'>
          Sorry, you don't have permission to access this page.
        </p>
      </div>
      <Button asChild>
        <Link href='/'>Back to Home</Link>
      </Button>
    </div>
  );
}
