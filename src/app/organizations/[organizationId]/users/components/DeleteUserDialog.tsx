'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteUser } from '../actions';

type UserWithDetails = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  role: string;
};

export default function DeleteUserDialog({
  isOpen,
  onClose,
  user,
  orgId,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithDetails | null;
  orgId: string;
}) {
  const handleDelete = async () => {
    if (!user) return;

    await deleteUser(user.user.id, orgId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {user?.user.name} from the
            organization?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
