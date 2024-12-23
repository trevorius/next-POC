'use client';

import { updateProfile } from '@/app/profile/profile.actions';
import { EditableField } from '@/components/ui-custom/editable-field';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProfileCard({ user }: { user: User | null }) {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [pendingChanges, setPendingChanges] = useState<
    Partial<Pick<User, 'name' | 'email'>>
  >({});

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleFieldChange = (field: 'name' | 'email', value: string) => {
    setPendingChanges((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async (changes = pendingChanges) => {
    try {
      // Update each changed field
      for (const [field, value] of Object.entries(changes)) {
        const result = await updateProfile({
          field: field as 'name' | 'email',
          value: value as string,
        });

        if (!result.success) {
          throw new Error(result.error);
        }
      }

      // Update the session to reflect all changes
      await updateSession({
        ...session,
        user: { ...session?.user, ...pendingChanges },
      });

      // Clear pending changes
      setPendingChanges({});
      // Refresh the page to show updated data
      router.refresh();
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
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
            <h3 className='font-semibold'>
              {pendingChanges.name || user.name}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {pendingChanges.email || user.email}
            </p>
          </div>
        </div>

        <div className='grid gap-4'>
          <EditableField
            label='Name'
            value={user.name || ''}
            onChange={async (e) =>
              await handleFieldChange('name', e.target.value)
            }
            onSave={async (value) => await handleSaveChanges({ name: value })}
          />
          <EditableField
            label='Email'
            value={user.email || ''}
            onChange={async (e) =>
              await handleFieldChange('email', e.target.value)
            }
            onSave={async (value) => await handleSaveChanges({ email: value })}
          />
        </div>

        {hasPendingChanges && (
          <div className='flex justify-end'>
            <Button onClick={() => handleSaveChanges(pendingChanges)}>
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
