'use client';

import { cn } from '@/lib/utils';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export default function StepProgress({
  currentStep,
  totalSteps,
  stepTitles = [],
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
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-body-medium font-primary font-medium transition-colors shadow-base',
              index <= currentStep
                ? 'bg-grounded text-white'
                : 'bg-aluminum text-gray-60'
            )}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Step Title */}
      {stepTitles[currentStep] && (
        <div className="text-center">
          <p className="text-body-medium text-gray-60 font-primary">
            {stepTitles[currentStep]}
          </p>
        </div>
      )}
    </div>
  );
}
