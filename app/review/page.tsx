'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhotoPreview from '@/components/PhotoPreview';
import { useSurveyStore } from '@/stores/surveyStore';
import { SURVEY_STEPS } from '@/lib/surveySteps';
import { fileToBase64 } from '@/lib/fileUtils';
import { useHydration } from '@/lib/useHydration';
import { Edit2, Check, X } from 'lucide-react';

export default function ReviewPage() {
  const isHydrated = useHydration();
  const { photos, customerEmail, resetSurvey, skippedSteps, mainDisconnectAmperage, setMainDisconnectAmperage } = useSurveyStore();
  const router = useRouter();
  const [isEditingAmperage, setIsEditingAmperage] = useState(false);
  const [editAmperageValue, setEditAmperageValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show loading state during hydration to prevent mismatches
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-livewire mx-auto mb-4"></div>
          <p>Loading survey data...</p>
        </div>
      </div>
    );
  }

  const handleEditSurvey = () => {
    // Navigate back to first step to edit
    router.push('/step/meter-closeup');
  };

  const handleClearSurvey = () => {
    if (confirm('Are you sure you want to clear all survey data? This cannot be undone.')) {
      resetSurvey();
      router.push('/');
    }
  };

  const handleSubmitSurvey = async () => {
    if (!customerEmail) {
      alert('Customer email is required');
      return;
    }

    console.log('Starting survey submission...');
    setIsSubmitting(true);
    
    try {
      console.log(`Converting ${validPhotos.length} photos to base64...`);
      
      // Convert photos to base64 format for API
      const photoData = await Promise.all(
        validPhotos.map(async (photo, index) => {
          console.log(`Converting photo ${index + 1}/${validPhotos.length}: ${photo.photoType}`);
          try {
            const base64Data = await fileToBase64(photo.file);
            console.log(`Successfully converted photo ${photo.photoType}, base64 length: ${base64Data.length}`);
            return {
              photoType: photo.photoType,
              base64Data,
              validation: photo.validation
            };
          } catch (error) {
            console.error(`Failed to convert photo ${photo.photoType}:`, error);
            throw new Error(`Failed to process photo ${photo.photoType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        })
      );

      console.log('All photos converted successfully, sending to API...');

      // Submit to API
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail,
          photos: photoData,
          skippedSteps,
          mainDisconnectAmperage,
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('API error response:', error);
        throw new Error(error.error || 'Failed to submit survey');
      }

      const result = await response.json();
      console.log('Survey submission successful:', result);
      
      alert(`Survey submitted successfully! Survey ID: ${result.surveyId}`);
      resetSurvey();
      router.push('/');
      
    } catch (error) {
      console.error('Survey submission error:', error);
      alert(`Failed to submit survey: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakePhoto = (photoType: string) => {
    // Find the step for this photo type and navigate there with editing context
    const step = SURVEY_STEPS.find((s) => s.photoType === photoType);
    if (step) {
      router.push(`/step/${step.id}?editingFrom=review`);
    }
  };

  const handleEditAmperage = () => {
    setEditAmperageValue(mainDisconnectAmperage?.toString() || '');
    setIsEditingAmperage(true);
  };

  const handleSaveAmperage = () => {
    const value = parseInt(editAmperageValue);
    if (!isNaN(value) && value > 0) {
      setMainDisconnectAmperage(value);
      setIsEditingAmperage(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAmperage(false);
    setEditAmperageValue('');
  };

  const validPhotos = photos.filter((p) => p.file && p.preview);
  
  // Calculate required photos: total steps minus conditional steps that were skipped
  const totalSteps = SURVEY_STEPS.length;
  const conditionalSteps = SURVEY_STEPS.filter(s => s.isConditional);
  const skippedConditionalSteps = skippedSteps.filter(stepId => 
    conditionalSteps.some(s => s.id === stepId)
  );
  const requiredPhotos = totalSteps - skippedConditionalSteps.length;
  const isComplete = validPhotos.length >= requiredPhotos;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-base-lg">
          <CardHeader>
            <CardTitle className="text-heading-2 text-grounded">
              Review Survey Data
            </CardTitle>
            <CardDescription className="text-body-large text-gray-60">
              Review your captured photos and data before submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Survey Info */}
              <div>
                <p className="font-medium text-grounded text-body-large">
                  Customer Email:
                </p>
                <p className="text-gray-60 text-body-large">{customerEmail}</p>
              </div>

              {/* Main Disconnect Amperage */}
              {mainDisconnectAmperage && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-grounded text-body-large">
                      Main Disconnect Amperage:
                    </p>
                    {!isEditingAmperage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditAmperage}
                        className="h-8 px-2 text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditingAmperage ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="number"
                        value={editAmperageValue}
                        onChange={(e) => setEditAmperageValue(e.target.value)}
                        placeholder="e.g., 100, 150, 200"
                        className="w-32 text-center"
                      />
                      <span className="text-gray-60 text-body-large">A</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveAmperage}
                        disabled={!editAmperageValue || isNaN(parseInt(editAmperageValue)) || parseInt(editAmperageValue) <= 0}
                        className="h-8 px-2 text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-8 px-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-60 text-body-large">{mainDisconnectAmperage} A</p>
                  )}
                </div>
              )}

              {/* Skipped Steps */}
              {skippedSteps.length > 0 && (
                <div>
                  <p className="font-medium text-grounded text-body-large">
                    Skipped Steps:
                  </p>
                  <div className="text-gray-60 text-body-large">
                    {skippedSteps.map((stepId) => {
                      const step = SURVEY_STEPS.find(s => s.id === stepId);
                      return (
                        <div key={stepId} className="text-sm">
                          • {step?.title || stepId} - No photo required
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Photos Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-grounded text-body-large">
                    Photos Captured: {validPhotos.length} / {requiredPhotos}
                  </p>
                  {!isComplete && (
                    <p className="text-body-medium text-orange-40">
                      {requiredPhotos - validPhotos.length} more required
                    </p>
                  )}
                </div>

                {validPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {validPhotos.map((photo, index) => (
                      <PhotoPreview
                        key={`${photo.photoType}-${index}`}
                        photoType={photo.photoType}
                        preview={photo.preview}
                        validation={photo.validation}
                        onRetake={() => handleRetakePhoto(photo.photoType)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-60">
                    <p className="text-body-large">No photos captured yet</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={handleEditSurvey}
                    >
                      Start Survey
                    </Button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t">
                {/* Primary Action */}
                <Button
                  className="w-full"
                  onClick={handleSubmitSurvey}
                  disabled={!isComplete || isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                </Button>
                
                {/* Secondary Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="w-full sm:flex-1"
                    onClick={handleEditSurvey}
                  >
                    Edit Survey
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:flex-1 border-orange-40 text-orange-40 hover:bg-orange-5 hover:text-orange-90"
                    onClick={handleClearSurvey}
                  >
                    Clear Survey
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
