'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, RotateCcw } from 'lucide-react';
import { PhotoType, ValidationResult } from '@/lib/types';
import FeedbackModal from '@/components/FeedbackModal';
import CameraControls from '@/components/CameraControls';
import { validatePhotoClient } from '@/lib/llm';
import { getOverlayConfig, getOverlayStyles } from '@/lib/photoOverlays';

interface CameraViewProps {
  photoType: PhotoType;
  onPhotoCapture: (file: File, preview: string) => void;
  onRetry?: () => void;
}

export default function CameraView({
  photoType,
  onPhotoCapture,
  onRetry,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Handle play() promise to avoid interruption errors
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsStreaming(true);
            })
            .catch((error) => {
              // Handle play interruption gracefully
              if (error.name !== 'AbortError') {
                console.error('Video play error:', error);
                setError('Unable to start camera preview');
              }
            });
        } else {
          setIsStreaming(true);
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        'Unable to access camera. Please ensure camera permissions are granted.'
      );
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `${photoType}-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });

          const preview = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedPhoto(preview);
          setCapturedFile(file);
          setIsCapturing(false);
        }
      },
      'image/jpeg',
      0.8
    );
  }, [photoType, isStreaming]);

  // Validate and confirm captured photo
  const confirmPhoto = useCallback(async () => {
    if (!capturedPhoto || !capturedFile) return;

    try {
      setIsValidating(true);
      setShowFeedback(true);

      // Validate photo with LLM
      const validation = await validatePhotoClient(capturedFile, photoType);
      setValidationResult(validation);
      setIsValidating(false);
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidating(false);

      // Fallback: accept photo without validation
      setValidationResult({
        isValid: true,
        confidence: 0.5,
        feedback: 'Validation unavailable. Photo accepted for manual review.',
        extractedData: null,
      });
    }
  }, [capturedPhoto, capturedFile, photoType]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    setCapturedFile(null);
    setIsCapturing(false);
    setValidationResult(null);
    setShowFeedback(false);
  }, []);

  // Handle validation feedback actions
  const handleContinue = useCallback(() => {
    if (capturedFile && capturedPhoto) {
      onPhotoCapture(capturedFile, capturedPhoto);
      setShowFeedback(false);
    }
  }, [capturedFile, capturedPhoto, onPhotoCapture]);

  const handleOverride = useCallback(() => {
    if (capturedFile && capturedPhoto) {
      onPhotoCapture(capturedFile, capturedPhoto);
      setShowFeedback(false);
    }
  }, [capturedFile, capturedPhoto, onPhotoCapture]);

  const handleRetakeFromModal = useCallback(() => {
    retakePhoto();
  }, [retakePhoto]);

  // Initialize camera on mount
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // AR guidance overlay based on photo type
  const renderGuidanceOverlay = () => {
    const config = getOverlayConfig(photoType);
    const styles = getOverlayStyles(config);

    // Handle special variants
    if (config.variant === 'horizontal-third') {
      return (
        <div className={styles.containerClass}>
          {/* Rule of thirds horizontal lines */}
          <div className="absolute top-1/3 left-4 right-4 h-0.5 bg-grounded opacity-30" />
          <div className="absolute top-2/3 left-4 right-4 h-0.5 bg-grounded opacity-30" />
          {config.label && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-grounded text-white px-3 py-2 rounded-base text-body-small font-primary text-center whitespace-nowrap">
              {config.label}
            </div>
          )}
        </div>
      );
    }

    if (config.variant === 'corners-only') {
      return (
        <div className={styles.containerClass}>
          {/* Corner guides - top left */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-grounded" />
          {/* Corner guides - top right */}
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-grounded" />
          {/* Corner guides - bottom left */}
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-grounded" />
          {/* Corner guides - bottom right */}
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-grounded" />
          {config.label && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-grounded text-white px-3 py-2 rounded-base text-body-small font-primary text-center whitespace-nowrap">
              {config.label}
            </div>
          )}
        </div>
      );
    }

    // Standard overlay with bounding box
    if (!config.show) {
      return config.label ? (
        <div className={styles.containerClass}>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-grounded text-white px-3 py-2 rounded-base text-body-small font-primary text-center whitespace-nowrap">
            {config.label}
          </div>
        </div>
      ) : null;
    }

    // Calculate inline styles as fallback for dynamic values
    const getInlineStyles = () => {
      if (typeof config.inset === 'number') {
        return {
          top: `${config.inset}px`,
          bottom: `${config.inset}px`,
          left: `${config.inset}px`,
          right: `${config.inset}px`
        };
      } else {
        const [vertical, horizontal] = config.inset;
        return {
          top: `${vertical}px`,
          bottom: `${vertical}px`,
          left: `${horizontal}px`,
          right: `${horizontal}px`
        };
      }
    };

    return (
      <div className={styles.containerClass}>
        <div 
          className={`absolute border-2 border-grounded rounded-base ${config.style === 'dashed' ? 'border-dashed' : 'border-solid'}`}
          style={getInlineStyles()}
        >
          {config.label && (
            <div className={styles.labelClass}>
              {config.label}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="text-red-40">
            <Camera className="w-12 h-12 mx-auto mb-2" />
            <p className="font-medium text-heading-6 font-primary">
              Camera Error
            </p>
            <p className="text-body-medium text-gray-60 font-primary">
              {error}
            </p>
          </div>
          <Button onClick={startCamera} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry Camera Access
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative portrait:h-full portrait:max-h-dvh landscape:h-auto landscape:min-h-[60vh]">
      {/* Camera View */}
      <div className="relative portrait:h-full landscape:h-auto landscape:aspect-video landscape:min-h-[60vh] md:aspect-video md:max-h-[70vh] md:mx-auto bg-black rounded-lg overflow-hidden">
        {/* Video Stream */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Captured Photo Overlay */}
        {capturedPhoto && (
          <div className="absolute inset-0 bg-black">
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* AR Guidance Overlay */}
        {isStreaming && !capturedPhoto && renderGuidanceOverlay()}

        {/* Loading Overlay */}
        {isCapturing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2" />
              <p>Capturing...</p>
            </div>
          </div>
        )}

        {/* Mobile Controls - Overlaid at bottom */}
        <CameraControls
          capturedPhoto={capturedPhoto}
          isStreaming={isStreaming}
          isCapturing={isCapturing}
          onRetry={onRetry}
          onCapturePhoto={capturePhoto}
          onRetakePhoto={retakePhoto}
          onConfirmPhoto={confirmPhoto}
          className="absolute bottom-4 left-4 right-4 md:hidden"
        />
      </div>

      {/* Canvas for photo capture (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Desktop Controls - Fixed at bottom */}
      <CameraControls
        capturedPhoto={capturedPhoto}
        isStreaming={isStreaming}
        isCapturing={isCapturing}
        onRetry={onRetry}
        onCapturePhoto={capturePhoto}
        onRetakePhoto={retakePhoto}
        onConfirmPhoto={confirmPhoto}
        className="hidden md:fixed md:bottom-6 md:left-4 md:right-4 md:flex md:max-w-md md:mx-auto"
      />

      {/* Validation Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        validation={validationResult}
        isValidating={isValidating}
        onRetake={handleRetakeFromModal}
        onContinue={handleContinue}
        onOverride={handleOverride}
      />
    </div>
  );
}
