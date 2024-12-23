'use client';

import { EditableField } from '@/components/ui-custom/editable-field';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { updateProfile } from './profile.actions';

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const user = session?.user;

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleUpdateProfile = async (
    field: 'name' | 'email',
    value: string
  ) => {
    try {
      const result = await updateProfile({ field, value });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update the session to reflect the changes
      await updateSession();
      // Refresh the page to show updated data
      router.refresh();

      toast({
        title: 'Profile updated',
        description: `Your ${field} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
      throw error; // Re-throw to let EditableField handle the error state
    }
  };

  return (
    <div className='grid gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-20 w-20'>
              <AvatarFallback className='text-xl'>
                {user.name ? getInitials(user.name) : '??'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='font-semibold'>{user.name}</h3>
              <p className='text-sm text-muted-foreground'>{user.email}</p>
            </div>
          </div>

          <div className='grid gap-4'>
            <EditableField
              label='Name'
              value={user.name || ''}
              onSave={(value: string) => handleUpdateProfile('name', value)}
            />
            <EditableField
              label='Email'
              value={user.email || ''}
              onSave={(value: string) => handleUpdateProfile('email', value)}
            />
            <div>
              <p className='text-sm text-muted-foreground'>
                {user.isSuperAdmin ? 'Super Admin' : 'User'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
