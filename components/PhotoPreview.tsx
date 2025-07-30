'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { PhotoType, ValidationResult } from '@/lib/types';

interface PhotoPreviewProps {
  photoType: PhotoType;
  preview: string;
  validation?: ValidationResult;
  onRetake?: () => void;
  className?: string;
}

export default function PhotoPreview({
  photoType,
  preview,
  validation,
  onRetake,
  className = ""
}: PhotoPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPhotoTypeLabel = (type: PhotoType): string => {
    const labels: Record<PhotoType, string> = {
      meter_closeup: 'Meter Close-up',
      meter_area_wide: 'Meter Area Wide',
      meter_area_right: 'Meter Area Right',
      meter_area_left: 'Meter Area Left',
      adjacent_wall: 'Adjacent Wall',
      area_behind_fence: 'Behind Fence',
      ac_unit_label: 'A/C Unit Label',
      second_ac_unit_label: 'Second A/C Label',
      breaker_box_interior: 'Breaker Box Interior',
      main_disconnect_switch: 'Main Disconnect',
      breaker_box_area: 'Breaker Box Area',
    };
    return labels[type];
  };

  const getValidationIcon = () => {
    if (!validation) return null;
    
    if (validation.isValid) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getValidationColor = () => {
    if (!validation) return '';
    return validation.isValid ? 'border-green-500' : 'border-red-500';
  };

  return (
    <>
      <Card className={`${className} ${getValidationColor()}`}>
        <CardContent className="p-2">
          <div className="space-y-2">
            {/* Photo Thumbnail */}
            <div 
              className="aspect-video bg-gray-100 rounded cursor-pointer overflow-hidden"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={preview}
                alt={getPhotoTypeLabel(photoType)}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo Info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">
                  {getPhotoTypeLabel(photoType)}
                </p>
                {getValidationIcon()}
              </div>

              {/* Validation Status */}
              {validation && (
                <p className={`text-xs ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.feedback}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => setIsModalOpen(true)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              {onRetake && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={onRetake}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Retake
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Size Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getPhotoTypeLabel(photoType)}
              {getValidationIcon()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Full Size Image */}
            <div className="w-full max-h-[60vh] overflow-hidden rounded-lg">
              <img
                src={preview}
                alt={getPhotoTypeLabel(photoType)}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Validation Details */}
            {validation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getValidationIcon()}
                  <span className={`font-medium ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.isValid ? 'Validation Passed' : 'Validation Failed'}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({Math.round(validation.confidence * 100)}% confidence)
                  </span>
                </div>
                <p className="text-sm text-gray-700">{validation.feedback}</p>
                
                {validation.extractedData && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <p className="font-medium">Extracted Data:</p>
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(validation.extractedData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              {onRetake && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsModalOpen(false);
                    onRetake();
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Photo
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
