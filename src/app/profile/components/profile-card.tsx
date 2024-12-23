'use client';

import { updateProfile } from '@/app/profile/profile.actions';
import { EditableField } from '@/components/ui-custom/editable-field';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function ProfileCard({ user }: { user: User | null }) {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const { toast } = useToast();

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
      await updateSession({
        ...session,
        user: { ...session?.user, [field]: value },
      });
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
      throw error;
    }
  };

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
            <h3 className='font-semibold'>{user.name}</h3>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        </div>

        <div className='grid gap-4'>
          <EditableField
            label='Name'
            value={user.name || ''}
            onSave={(value) => handleUpdateProfile('name', value)}
          />
          <EditableField
            label='Email'
            value={user.email || ''}
            onSave={(value) => handleUpdateProfile('email', value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
