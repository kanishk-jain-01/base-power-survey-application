'use client';

import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
  onInfoClick?: () => void;
  onStepClick?: (index: number) => void;
  completedSteps?: string[];
  stepIds?: string[];
}

export default function StepProgress({
  currentStep,
  totalSteps,
  stepTitles = [],
  onInfoClick,
  onStepClick,
  completedSteps = [],
  stepIds = [],
}: StepProgressProps) {
  return (
    <div className="w-full space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <span className="text-body-medium text-gray-60 font-primary">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="flex-1 bg-aluminum rounded-full h-3">
          <div
            className="bg-livewire h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepId = stepIds[index];
          const isCompleted = stepId && completedSteps.includes(stepId);
          const canClick = isCompleted && index !== currentStep && onStepClick;
          
          return (
            <div
              key={index}
              onClick={canClick ? () => onStepClick?.(index) : undefined}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-body-medium font-primary font-medium transition-colors shadow-base',
                index <= currentStep
                  ? 'bg-grounded text-white'
                  : 'bg-aluminum text-gray-60',
                canClick && 'cursor-pointer hover:ring-2 hover:ring-grounded hover:ring-opacity-50'
              )}
              aria-label={canClick ? `Go to step ${index + 1}` : `Step ${index + 1}`}
            >
              {index + 1}
            </div>
          );
        })}
      </div>

      {/* Step Title */}
      {stepTitles[currentStep] && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-body-medium text-gray-60 font-primary">
              {stepTitles[currentStep]}
            </p>
            {onInfoClick && (
              <button
                onClick={onInfoClick}
                className="p-1 text-gray-60 hover:text-grounded transition-colors"
                aria-label="Show instructions"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
