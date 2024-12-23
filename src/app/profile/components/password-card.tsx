'use client';

import { updateProfile } from '@/app/profile/profile.actions';
import { EditableField } from '@/components/ui-custom/editable-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function PasswordCard() {
  const router = useRouter();
  const { toast } = useToast();

  const handleUpdatePassword = async (value: string) => {
    try {
      const result = await updateProfile({
        field: 'password',
        value,
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      // Refresh the page to show updated data
      router.refresh();

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Settings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <EditableField
          label='Password'
          value='••••••••••••'
          onSave={handleUpdatePassword}
          type='password'
          placeholder='Enter new password'
          helperText='Password must be at least 12 characters long and contain both lowercase and uppercase letters. Consider using multiple words for better security.'
        />
      </CardContent>
    </Card>
  );
}
