import { create } from 'zustand';
import { SurveyState, PhotoType, ValidationResult } from '@/lib/types';

export const useSurveyStore = create<SurveyState>((set, get) => ({
  currentStep: 0,
  customerEmail: '',
  photos: [],
  surveyData: {},

  setCustomerEmail: (email: string) => 
    set({ customerEmail: email }),

  addPhoto: (photoType: PhotoType, file: File, preview: string) =>
    set((state) => ({
      photos: [
        ...state.photos.filter(p => p.photoType !== photoType),
        { photoType, file, preview }
      ]
    })),

  updatePhotoValidation: (photoType: PhotoType, validation: ValidationResult) =>
    set((state) => ({
      photos: state.photos.map(photo =>
        photo.photoType === photoType
          ? { ...photo, validation }
          : photo
      )
    })),

  nextStep: () =>
    set((state) => ({ currentStep: state.currentStep + 1 })),

  previousStep: () =>
    set((state) => ({ 
      currentStep: Math.max(0, state.currentStep - 1) 
    })),

  resetSurvey: () =>
    set({
      currentStep: 0,
      customerEmail: '',
      photos: [],
      surveyData: {}
    })
}));
