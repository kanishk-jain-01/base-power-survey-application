import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SurveyState, PhotoType, ValidationResult } from '@/lib/types';

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
  currentStep: 0,
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
      return { photos, completedSteps };
    }),

  updatePhotoValidation: (photoType: PhotoType, validation: ValidationResult) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.photoType === photoType ? { ...photo, validation } : photo
      ),
    })),

  skipStep: (stepId: string) =>
    set((state) => ({
      skippedSteps: [...state.skippedSteps, stepId],
      completedSteps: [...state.completedSteps.filter(id => id !== stepId), stepId],
    })),

  markStepCompleted: (stepId: string) =>
    set((state) => ({
      completedSteps: [...state.completedSteps.filter(id => id !== stepId), stepId],
    })),

  setEditingStepId: (stepId: string | null) =>
    set({ editingStepId: stepId }),

  setMainDisconnectAmperage: (amperage: number) =>
    set({ mainDisconnectAmperage: amperage }),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
    })),

  resetSurvey: () =>
    set({
      currentStep: 0,
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
