import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SurveyState, PhotoType, ValidationResult } from '@/lib/types';

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
  currentStep: 0,
  furthestStepIndex: 0,
  customerEmail: '',
  photos: [],
  surveyData: {},
  skippedSteps: [],
  completedSteps: [],
  editingStepId: null,
  mainDisconnectAmperage: undefined,

  setCustomerEmail: (email: string) => set({ customerEmail: email }),

  addPhoto: (photoType: PhotoType, file: File, preview: string, stepId: string) =>
    set((state) => {
      const photos = [
        ...state.photos.filter((p) => p.photoType !== photoType),
        { photoType, file, preview },
      ];
      const completedSteps = [...state.completedSteps.filter(id => id !== stepId), stepId];
      // Remove the step from skippedSteps if it was previously skipped
      const skippedSteps = state.skippedSteps.filter(id => id !== stepId);
      return { photos, completedSteps, skippedSteps };
    }),

  updatePhotoValidation: (photoType: PhotoType, validation: ValidationResult) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.photoType === photoType ? { ...photo, validation } : photo
      ),
    })),

  skipStep: (stepId: string) =>
    set((state) => {
      // Don't add duplicates to skippedSteps
      const alreadySkipped = state.skippedSteps.includes(stepId);
      const skippedSteps = alreadySkipped
        ? state.skippedSteps
        : [...state.skippedSteps, stepId];
      // Remove from completedSteps when skipping
      const completedSteps = state.completedSteps.filter(id => id !== stepId);
      return { skippedSteps, completedSteps };
    }),

  markStepCompleted: (stepId: string) =>
    set((state) => ({
      completedSteps: [...state.completedSteps.filter(id => id !== stepId), stepId],
    })),

  setEditingStepId: (stepId: string | null) =>
    set({ editingStepId: stepId }),

  setMainDisconnectAmperage: (amperage: number) =>
    set({ mainDisconnectAmperage: amperage }),

  setFurthestStepIndex: (index: number) =>
    set((state) => ({ furthestStepIndex: Math.max(state.furthestStepIndex, index) })),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
    })),

  resetSurvey: () =>
    set({
      currentStep: 0,
      furthestStepIndex: 0,
      customerEmail: '',
      photos: [],
      surveyData: {},
      skippedSteps: [],
      completedSteps: [],
      editingStepId: null,
      mainDisconnectAmperage: undefined,
    }),
    }),
    {
      name: 'survey-storage',
      // Exclude photos array since File objects can't be serialized
      // User will need to retake photos if they refresh, but other state is preserved
      partialize: (state) => ({
        currentStep: state.currentStep,
        furthestStepIndex: state.furthestStepIndex,
        customerEmail: state.customerEmail,
        surveyData: state.surveyData,
        skippedSteps: state.skippedSteps,
        completedSteps: state.completedSteps,
        editingStepId: state.editingStepId,
        mainDisconnectAmperage: state.mainDisconnectAmperage,
      }),
    }
  )
);
