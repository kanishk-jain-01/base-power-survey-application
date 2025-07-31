'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CameraView from '@/components/CameraView';
import StepProgress from '@/components/StepProgress';
import InstructionModal from '@/components/InstructionModal';
import {
  getStepById,
  getNextStepId,
  getStepProgress,
  SURVEY_STEPS,
} from '@/lib/surveySteps';
import { useSurveyStore } from '@/stores/surveyStore';
import { useHydration } from '@/lib/useHydration';

export default function SurveyStepPage() {
  const isHydrated = useHydration();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepId = params.stepId as string;
  const stepConfig = getStepById(stepId);
  const { addPhoto, skipStep, setMainDisconnectAmperage, completedSteps, setEditingStepId, setFurthestStepIndex } = useSurveyStore();
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  
  // Check if we're in editing mode
  const isEditing = searchParams.get('editingFrom') === 'review';

  // Set editing state when component mounts
  useEffect(() => {
    if (isEditing) {
      setEditingStepId(stepId);
    }
  }, [isEditing, stepId, setEditingStepId]);

  // Calculate progress data early
  const progress = stepConfig ? getStepProgress(stepId) : null;
  const stepTitles = SURVEY_STEPS.map((step) => step.title);
  const stepIds = SURVEY_STEPS.map((step) => step.id);

  // Update furthest step reached when visiting this step
  useEffect(() => {
    if (!isEditing && progress) {
      setFurthestStepIndex(progress.current);
    }
  }, [progress?.current, setFurthestStepIndex, isEditing]);

  // Show instruction modal after page transition completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructionModal(true);
    }, 350); // Slightly longer than transition duration (300ms)

    return () => clearTimeout(timer);
  }, [stepId]);

  // Show loading during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-livewire mx-auto mb-4"></div>
          <p>Loading step...</p>
        </div>
      </div>
    );
  }

  if (!stepConfig || !progress) {
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

  const handlePhotoCapture = (file: File, preview: string) => {
    // Add photo to survey state
    addPhoto(stepConfig.photoType, file, preview, stepId);

    // If we're editing, go back to review
    if (isEditing) {
      setEditingStepId(null);
      router.push('/review');
      return;
    }

    // Otherwise, navigate to next step or review
    const nextStepId = getNextStepId(stepId);
    if (nextStepId) {
      router.push(`/step/${nextStepId}`);
    } else {
      router.push('/review');
    }
  };

  const handleSkip = () => {
    // Add step to skipped list
    skipStep(stepId);
    
    // If we're editing, go back to review
    if (isEditing) {
      setEditingStepId(null);
      router.push('/review');
      return;
    }
    
    // Otherwise, navigate to next step or review
    const nextStepId = getNextStepId(stepId);
    if (nextStepId) {
      router.push(`/step/${nextStepId}`);
    } else {
      router.push('/review');
    }
  };

  const handleAmperageConfirm = (amperage: number) => {
    setMainDisconnectAmperage(amperage);
  };

  const handleStepClick = (index: number) => {
    const targetStepId = stepIds[index];
    router.push(`/step/${targetStepId}`);
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
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
          stepIds={stepIds}
        />
      </div>

      {/* Camera Component - Takes remaining space */}
      <div className="portrait:flex-1 landscape:flex-none px-4 pb-4 portrait:overflow-hidden">
        <CameraView
          photoType={stepConfig.photoType}
          onPhotoCapture={handlePhotoCapture}
          onSkip={handleSkip}
          showSkip={stepConfig.isConditional}
          onAmperageConfirm={handleAmperageConfirm}
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
