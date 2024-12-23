'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: 'text' | 'password';
  placeholder?: string;
  helperText?: string;
}

export function EditableField({
  label,
  value: initialValue,
  onSave,
  onChange,
  className,
  type = 'text',
  placeholder,
  helperText,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
      if (type === 'password') {
        setValue(''); // Clear password field when editing starts
      }
    }
  };

  const handleSave = async () => {
    if (type === 'password' && value === '') {
      setIsEditing(false);
      return;
    }

    if (type !== 'password' && value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(value);
      setIsEditing(false);
      if (type === 'password') {
        setValue('••••••••••••');
        setShowPassword(false);
      }
    } catch (error) {
      console.error('Failed to save:', error);
      if (type === 'password') {
        setValue('');
      } else {
        setValue(initialValue); // Reset on error
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (type === 'password') {
      setValue('••••••••••••');
    } else {
      setValue(initialValue);
    }
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label>{label}</Label>
      <div onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <div className='flex items-center gap-2'>
            <div className='relative flex-1'>
              <Input
                value={value}
                onChange={(e) => handleChange(e)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
                type={
                  type === 'password' && !showPassword ? 'password' : 'text'
                }
                placeholder={placeholder}
                className='pr-10'
              />
              {type === 'password' && (
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              )}
            </div>
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
          <>
            <p className='text-sm text-muted-foreground min-h-[2.5rem] flex items-center px-3 rounded-md hover:bg-secondary/50 cursor-pointer'>
              {value}
            </p>
            {helperText && (
              <p className='text-xs text-muted-foreground mt-1'>{helperText}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
