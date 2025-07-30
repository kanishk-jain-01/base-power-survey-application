'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PhotoPreview from '@/components/PhotoPreview';
import { useSurveyStore } from '@/stores/surveyStore';
import { SURVEY_STEPS } from '@/lib/surveySteps';

export default function ReviewPage() {
  const { photos, customerEmail, resetSurvey } = useSurveyStore();
  const router = useRouter();

  const handleEditSurvey = () => {
    // Navigate back to first step to edit
    router.push('/step/meter-closeup');
  };

  const handleSubmitSurvey = async () => {
    // TODO: Implement survey submission to API
    console.log('Submitting survey:', { customerEmail, photos });
    
    // For now, just show success and reset
    alert('Survey submitted successfully!');
    resetSurvey();
    router.push('/');
  };

  const handleRetakePhoto = (photoType: string) => {
    // Find the step for this photo type and navigate there
    const step = SURVEY_STEPS.find(s => s.photoType === photoType);
    if (step) {
      router.push(`/step/${step.id}`);
    }
  };

  const validPhotos = photos.filter(p => p.file && p.preview);
  const isComplete = validPhotos.length >= 5; // Minimum required photos

  return (
    <div className="min-h-screen bg-blue-5 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-4 text-blue-90">
              Review Survey Data
            </CardTitle>
            <CardDescription className="text-body-large">
              Review your captured photos and data before submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Survey Info */}
              <div>
                <p className="font-medium text-gray-900">Customer Email:</p>
                <p className="text-gray-600">{customerEmail}</p>
              </div>
              
              {/* Photos Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gray-900">
                    Photos Captured: {validPhotos.length}
                  </p>
                  {!isComplete && (
                    <p className="text-sm text-orange-600">
                      Minimum 5 photos required
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
                  <div className="text-center py-8 text-gray-500">
                    <p>No photos captured yet</p>
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
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleEditSurvey}
                >
                  Edit Survey
                </Button>
                <Button 
                  className="flex-1 bg-blue-40 hover:bg-blue-90"
                  onClick={handleSubmitSurvey}
                  disabled={!isComplete}
                >
                  Submit Survey
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
