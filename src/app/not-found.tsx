import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4'>
      <h1 className='text-4xl font-bold tracking-tight'>404</h1>
      <p className='text-xl text-muted-foreground'>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href='/'>Back to Home</Link>
      </Button>
    </div>
  );
}
