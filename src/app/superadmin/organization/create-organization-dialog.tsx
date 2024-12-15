'use client';

import { createOrganization } from '@/app/actions/organization';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      ownerEmail: formData.get('ownerEmail') as string,
      ownerName: formData.get('ownerName') as string,
    };

    try {
      await createOrganization(data);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization and its owner account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Organization Name</Label>
            <Input
              id='name'
              name='name'
              placeholder='Enter organization name'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ownerName'>Owner Name</Label>
            <Input
              id='ownerName'
              name='ownerName'
              placeholder='Enter owner name'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ownerEmail'>Owner Email</Label>
            <Input
              id='ownerEmail'
              name='ownerEmail'
              type='email'
              placeholder='Enter owner email'
              required
            />
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
