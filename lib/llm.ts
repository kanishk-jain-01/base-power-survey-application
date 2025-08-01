import { ValidationResult, PhotoType } from '@/lib/types';

// Convert image file to base64 for API
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Main validation function - now only sends image and photoType
export async function validatePhoto(
  file: File,
  photoType: PhotoType
): Promise<ValidationResult> {
  try {
    const base64Image = await fileToBase64(file);

    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        photoType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Validation API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Photo validation error:', error);

    // Return fallback validation result
    return {
      isValid: true, // Default to valid to not block user
      confidence: 0.5,
      feedback:
        'Unable to validate photo automatically. Please review manually.',
      extractedData: null,
    };
  }
}

// Client-side validation helper
export async function validatePhotoClient(
  file: File,
  photoType: PhotoType
): Promise<ValidationResult> {
  return validatePhoto(file, photoType);
}
