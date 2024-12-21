'use client';

import { createOrganization } from '@/app/actions/organization';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{
    organization: { name: string };
    ownerEmail: string;
    temporaryPassword: string;
  } | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      ownerEmail: formData.get('ownerEmail') as string,
      ownerName: formData.get('ownerName') as string,
    };

    try {
      const result = await createOrganization(data);
      setSuccess(result);
      router.refresh();
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleClose(open: boolean) {
    if (success) {
      const confirmed = window.confirm(
        'Make sure you have saved the temporary password before closing. Are you sure you want to close?'
      );
      if (!confirmed) {
        return;
      }
    }
    if (!open) {
      setSuccess(null);
    }
    setOpen(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {success ? 'Organization Created' : 'Create New Organization'}
          </DialogTitle>
          <DialogDescription>
            {success
              ? `The organization has been created successfully.${
                  success.temporaryPassword
                    ? ' Please save the temporary password before closing.'
                    : ''
                }`
              : 'Create a new organization and its owner account.'}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className='grid gap-6 py-4'>
            <div className='grid gap-2'>
              <Label className='font-semibold'>Organization Name</Label>
              <div className='rounded-md bg-muted px-3 py-2'>
                {success.organization.name}
              </div>
            </div>
            <div className='grid gap-2'>
              <Label className='font-semibold'>Owner Email</Label>
              <div className='rounded-md bg-muted px-3 py-2'>
                {success.ownerEmail}
              </div>
            </div>
            {success.temporaryPassword && (
              <div className='grid gap-2'>
                <Label className='font-semibold'>Temporary Password</Label>
                <div className='relative'>
                  <div className='rounded-md bg-muted px-3 py-2 font-mono break-all'>
                    {success.temporaryPassword}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='absolute right-2 top-1/2 -translate-y-1/2'
                    onClick={() => {
                      navigator.clipboard.writeText(success.temporaryPassword);
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Please save this password and share it securely with the
                  organization owner.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button
                onClick={() => handleClose(false)}
                className='w-full sm:w-auto'
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={onSubmit} className='grid gap-6 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Organization Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter organization name'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='ownerName'>Owner Name</Label>
              <Input
                id='ownerName'
                name='ownerName'
                placeholder='Enter owner name'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='ownerEmail'>Owner Email</Label>
              <Input
                id='ownerEmail'
                name='ownerEmail'
                type='email'
                placeholder='Enter owner email'
                required
              />
            </div>
            <DialogFooter>
              <Button
                type='submit'
                disabled={loading}
                className='w-full sm:w-auto'
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
