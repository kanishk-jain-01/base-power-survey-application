'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CameraView from '@/components/CameraView';
import StepProgress from '@/components/StepProgress';
import InstructionModal from '@/components/InstructionModal';
import {
  getStepById,
  getNextStepId,
  getPreviousStepId,
  getStepProgress,
  SURVEY_STEPS,
} from '@/lib/surveySteps';
import { useSurveyStore } from '@/stores/surveyStore';

export default function SurveyStepPage() {
  const params = useParams();
  const router = useRouter();
  const stepId = params.stepId as string;
  const stepConfig = getStepById(stepId);
  const { addPhoto } = useSurveyStore();
  const [showInstructionModal, setShowInstructionModal] = useState(true);

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
  const stepTitles = SURVEY_STEPS.map((step) => step.title);

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
    <div className="flex flex-col h-dvh portrait:overflow-hidden landscape:min-h-dvh landscape:overflow-auto">
      {/* Header with Progress */}
      <div className="flex-shrink-0 p-4 max-w-md mx-auto w-full">
        <StepProgress
          currentStep={progress.current}
          totalSteps={progress.total}
          stepTitles={stepTitles}
          onInfoClick={() => setShowInstructionModal(true)}
        />
      </div>

      {/* Camera Component - Takes remaining space */}
      <div className="portrait:flex-1 landscape:flex-none px-4 pb-4 portrait:overflow-hidden">
        <CameraView
          photoType={stepConfig.photoType}
          onPhotoCapture={handlePhotoCapture}
          onRetry={handleBack}
        />
      </div>

      {/* Instruction Modal */}
      <InstructionModal
        isOpen={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
        title={stepConfig.title}
        instruction={stepConfig.instruction}
      />
    </div>
  );
}
