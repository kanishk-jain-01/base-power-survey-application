'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedAmperage?: number;
  onConfirm: (amperage: number) => void;
  onRetake: () => void;
}

export default function DataConfirmModal({
  isOpen,
  onClose,
  extractedAmperage,
  onConfirm,
  onRetake,
}: DataConfirmModalProps) {
  const [manualValue, setManualValue] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleConfirm = () => {
    if (extractedAmperage) {
      onConfirm(extractedAmperage);
    }
  };

  const handleManualConfirm = () => {
    const value = parseInt(manualValue);
    if (!isNaN(value) && value > 0) {
      onConfirm(value);
    }
  };

  const handleOverride = () => {
    setShowManualEntry(true);
  };

  const resetModal = () => {
    setShowManualEntry(false);
    setManualValue('');
    onClose();
  };

  if (!extractedAmperage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Main Disconnect Amperage</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!showManualEntry ? (
            <>
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-2">AI detected:</p>
                <p className="text-2xl font-bold text-blue-600">
                  {extractedAmperage} A
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Is this correct?
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={handleConfirm} className="w-full">
                  Yes, that&apos;s correct
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onRetake}
                  className="w-full"
                >
                  No, retake photo
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleOverride}
                  className="w-full text-sm"
                >
                  Enter manually
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <label htmlFor="manual-amperage" className="block text-sm font-medium">
                  Enter the amperage value you see:
                </label>
                <Input
                  id="manual-amperage"
                  type="number"
                  placeholder="e.g., 100, 150, 200"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  className="text-center text-lg"
                />
                <p className="text-xs text-gray-500 text-center">
                  Common values: 100A, 125A, 150A, 200A
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleManualConfirm}
                  disabled={!manualValue || isNaN(parseInt(manualValue))}
                  className="flex-1"
                >
                  Confirm
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowManualEntry(false)}
                  className="flex-1"
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
