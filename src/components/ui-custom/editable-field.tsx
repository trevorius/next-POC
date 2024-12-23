'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
}

export function EditableField({
  label,
  value: initialValue,
  onSave,
  className,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setValue(initialValue); // Reset on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label>{label}</Label>
      <div onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <div className='flex items-center gap-2'>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoFocus
              className='flex-1'
            />
            <div className='flex gap-1'>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className='p-2 hover:bg-secondary rounded-md'
                title='Save'
              >
                <Check className='h-4 w-4 text-green-600' />
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className='p-2 hover:bg-secondary rounded-md'
                title='Cancel'
              >
                <X className='h-4 w-4 text-destructive' />
              </button>
            </div>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground min-h-[2.5rem] flex items-center px-3 rounded-md hover:bg-secondary/50 cursor-pointer'>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
