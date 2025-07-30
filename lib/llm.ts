import { ValidationResult, PhotoType } from '@/lib/types';

// Photo validation prompts based on survey criteria
const getValidationPrompt = (photoType: PhotoType): string => {
  const basePrompt = `You are an expert at validating home energy survey photos. Analyze this image and determine if it meets the criteria for a "${photoType}" photo.

Return a JSON response with:
- isValid: boolean (true if photo meets all criteria)
- confidence: number (0-1, confidence in your assessment)
- feedback: string (specific feedback for the user)
- extractedData: object (any data you can extract from the image)

Criteria for ${photoType}:`;

  const criteria: Record<PhotoType, string> = {
    meter_closeup: `
- Image contains an identifiable electricity meter (circular or rectangular with glass/plastic cover)
- Meter numbers/text are visible and legible
- Image is sharp and not blurry
- Meter fills significant portion of the frame`,

    meter_area_wide: `
- Previously identified meter is visible within wider shot
- Shows building's exterior wall
- Includes ground and surrounding area
- Shows potential obstructions like windows, doors, utility boxes`,

    meter_area_right: `
- Shows exterior wall and adjacent ground space
- Captures area to the right of the meter location
- Different perspective from previous wide shot`,

    meter_area_left: `
- Shows exterior wall and adjacent ground space  
- Captures area to the left of the meter location
- Different perspective from previous shots`,

    adjacent_wall: `
- Shows long expanse of exterior wall
- Captures corner-to-corner view if possible
- Includes corner of house if visible`,



    ac_unit_label: `
- Contains a metallic or paper label with technical specifications
- Text is readable, especially LRA or RLA numbers
- Label is the primary subject of the photo
- Extract any visible specification numbers`,

    second_ac_unit_label: `
- Contains a metallic or paper label with technical specifications
- Text is readable, especially LRA or RLA numbers  
- Label is the primary subject of the photo
- This is for a second A/C unit (different from first)`,

    breaker_box_interior: `
- Shows inside of an electrical panel
- Multiple rows of breaker switches are visible
- Entire set of breakers is visible in frame
- Panel door is open`,

    main_disconnect_switch: `
- Focuses on single, larger breaker switch
- Number (100, 125, 150, 200) is visible and readable
- Switch may be labeled as "Main"
- Extract the amperage number if visible`,

    breaker_box_area: `
- Breaker box is visible within larger context
- Shows location (garage wall, closet, etc.)
- Includes surrounding area and any obstructions`,
  };

  return `${basePrompt}\n${criteria[photoType]}

If extracting data (like meter readings, LRA numbers, amperage), include specific values in extractedData.`;
};

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

// Main validation function
export async function validatePhoto(
  file: File,
  photoType: PhotoType
): Promise<ValidationResult> {
  try {
    const base64Image = await fileToBase64(file);
    const prompt = getValidationPrompt(photoType);

    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        prompt,
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
