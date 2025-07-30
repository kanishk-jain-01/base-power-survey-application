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
  stepTitles = [] 
}: StepProgressProps) {
  return (
    <div className="w-full space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-40 h-2 rounded-full transition-all duration-300"
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
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              index <= currentStep
                ? "bg-blue-40 text-white"
                : "bg-gray-200 text-gray-600"
            )}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Step Title */}
      {stepTitles[currentStep] && (
        <div className="text-center">
          <p className="text-sm text-gray-600">{stepTitles[currentStep]}</p>
        </div>
      )}
    </div>
  );
}
