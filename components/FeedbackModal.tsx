'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { ValidationResult } from '@/lib/types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: ValidationResult | null;
  isValidating: boolean;
  onRetake: () => void;
  onContinue: () => void;
  onOverride?: () => void;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  validation,
  isValidating,
  onRetake,
  onContinue,
  onOverride
}: FeedbackModalProps) {
  if (isValidating) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-blue-40 border-t-transparent rounded-full" />
              Validating Photo...
            </DialogTitle>
            <DialogDescription>
              Our AI is analyzing your photo to ensure it meets the survey requirements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-6">
            <div className="w-12 h-12 border-4 border-blue-10 border-t-blue-40 rounded-full animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!validation) return null;

  const isValid = validation.isValid;
  const Icon = isValid ? CheckCircle : AlertCircle;
  const iconColor = isValid ? 'text-green-600' : 'text-red-600';
  const bgColor = isValid ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isValid ? 'border-green-200' : 'border-red-200';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            {isValid ? 'Photo Validated' : 'Photo Issues Detected'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Validation Status */}
          <div className={`p-4 rounded-lg border ${bgColor} ${borderColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">
                {isValid ? 'Validation Passed' : 'Validation Failed'}
              </span>
              <span className="text-body-small text-gray-60 font-primary">
                {Math.round(validation.confidence * 100)}% confidence
              </span>
            </div>
            <p className="text-body-medium text-grounded font-primary">{validation.feedback}</p>
          </div>

          {/* Extracted Data */}
          {validation.extractedData && (
            <div className="p-3 bg-green-5 border border-green-10 rounded-base">
              <p className="font-medium text-body-medium font-primary mb-1">Extracted Information:</p>
              <div className="text-body-medium text-grounded font-primary space-y-1">
                {Object.entries(validation.extractedData).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {isValid ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onRetake}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={onContinue}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="flex-1"
                  onClick={onRetake}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Photo
                </Button>
                {onOverride && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onOverride}
                  >
                    Use Anyway
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Helper Text */}
          {!isValid && (
            <p className="text-xs text-gray-500 text-center">
              For best results, please retake the photo following the guidance provided.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
