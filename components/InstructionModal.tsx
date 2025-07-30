'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  instruction: string;
}

export default function InstructionModal({
  isOpen,
  onClose,
  title,
  instruction,
}: InstructionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-heading-6 font-primary text-grounded">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          <p className="text-body-medium font-primary text-gray-60">
            {instruction}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}