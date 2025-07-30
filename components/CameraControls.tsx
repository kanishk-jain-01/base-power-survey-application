'use client';

import { Button } from '@/components/ui/button';
import { Camera, Check, X } from 'lucide-react';

interface CameraControlsProps {
  capturedPhoto: string | null;
  isStreaming: boolean;
  isCapturing: boolean;
  onRetry?: () => void;
  onCapturePhoto: () => void;
  onRetakePhoto: () => void;
  onConfirmPhoto: () => void;
  className?: string;
}

export default function CameraControls({
  capturedPhoto,
  isStreaming,
  isCapturing,
  onRetry,
  onCapturePhoto,
  onRetakePhoto,
  onConfirmPhoto,
  className = '',
}: CameraControlsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {!capturedPhoto ? (
        <>
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex-1"
            disabled={!isStreaming}
          >
            Back
          </Button>
          <Button
            onClick={onCapturePhoto}
            className="flex-1"
            disabled={!isStreaming || isCapturing}
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture Photo
          </Button>
        </>
      ) : (
        <>
          <Button onClick={onRetakePhoto} variant="outline" className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Retake
          </Button>
          <Button
            onClick={onConfirmPhoto}
            variant="secondary"
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            Use Photo
          </Button>
        </>
      )}
    </div>
  );
}