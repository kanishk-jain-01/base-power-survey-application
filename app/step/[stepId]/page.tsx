'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import CameraView from '@/components/CameraView';
import StepProgress from '@/components/StepProgress';
import { getStepById, getNextStepId, getPreviousStepId, getStepProgress, SURVEY_STEPS } from '@/lib/surveySteps';
import { useSurveyStore } from '@/stores/surveyStore';

export default function SurveyStepPage() {
  const params = useParams();
  const router = useRouter();
  const stepId = params.stepId as string;
  const stepConfig = getStepById(stepId);
  const { addPhoto } = useSurveyStore();

  if (!stepConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Step not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = getStepProgress(stepId);
  const stepTitles = SURVEY_STEPS.map(step => step.title);

  const handlePhotoCapture = (file: File, preview: string) => {
    // Add photo to survey state
    addPhoto(stepConfig.photoType, file, preview);
    
    // Navigate to next step or review
    const nextStepId = getNextStepId(stepId);
    if (nextStepId) {
      router.push(`/step/${nextStepId}`);
    } else {
      router.push('/review');
    }
  };

  const handleBack = () => {
    const previousStepId = getPreviousStepId(stepId);
    if (previousStepId) {
      router.push(`/step/${previousStepId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-blue-5 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Progress Indicator */}
        <StepProgress
          currentStep={progress.current}
          totalSteps={progress.total}
          stepTitles={stepTitles}
        />

        {/* Camera Component */}
        <CameraView
          photoType={stepConfig.photoType}
          instruction={stepConfig.instruction}
          onPhotoCapture={handlePhotoCapture}
          onRetry={handleBack}
        />
      </div>
    </div>
  );
}
