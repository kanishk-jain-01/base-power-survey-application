// Core survey data types
export interface Customer {
  customer_id: string;
  email: string;
  name?: string;
  phone_number?: string;
}

export interface Survey {
  survey_id: string;
  customer_id: string;
  start_timestamp: Date;
  completion_timestamp?: Date;
  geolocation?: string;
  status: 'pending' | 'completed' | 'validated' | 'rejected';
  user_signature_data?: string;
  notes?: string;
  validation_results?: Record<string, unknown> | null;
}

export interface Photo {
  photo_id: string;
  survey_id: string;
  s3_url: string;
  photo_type: PhotoType;
  capture_timestamp: Date;
  geolocation?: string;
  metadata?: Record<string, unknown> | null;
}

export type PhotoType =
  | 'meter_closeup'
  | 'meter_area_wide'
  | 'meter_area_right'
  | 'meter_area_left'
  | 'adjacent_wall'
  | 'area_behind_fence'
  | 'ac_unit_label'
  | 'second_ac_unit_label'
  | 'breaker_box_interior'
  | 'main_disconnect_switch'
  | 'breaker_box_area';

export interface SurveyStep {
  id: string;
  title: string;
  instruction: string;
  photoType: PhotoType;
  validationChecks: string[];
  isConditional?: boolean;
}

// AI validation response
export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  feedback: string;
  extractedData?: Record<string, unknown> | null;
}

// Survey state for Zustand store
export interface SurveyState {
  currentStep: number;
  customerEmail: string;
  photos: Array<{
    photoType: PhotoType;
    file: File;
    preview: string;
    validation?: ValidationResult;
  }>;
  surveyData: Partial<Survey>;
  skippedSteps: string[];
  mainDisconnectAmperage?: number;

  // Actions
  setCustomerEmail: (email: string) => void;
  addPhoto: (photoType: PhotoType, file: File, preview: string) => void;
  updatePhotoValidation: (
    photoType: PhotoType,
    validation: ValidationResult
  ) => void;
  skipStep: (stepId: string) => void;
  setMainDisconnectAmperage: (amperage: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetSurvey: () => void;
}
