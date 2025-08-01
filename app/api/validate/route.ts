import { NextRequest, NextResponse } from 'next/server';
import { ValidationResult, PhotoType } from '@/lib/types';

// LLM API configuration
const LLM_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || process.env.XAI_API_KEY,
  baseURL: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
  model: process.env.LLM_MODEL || 'gpt-4o-mini',
};

// Photos that need data extraction
const NEEDS_DATA_EXTRACTION: PhotoType[] = ['main_disconnect_switch'];

// Valid photo types - server-side validation
const VALID_PHOTO_TYPES: PhotoType[] = [
  'meter_closeup',
  'meter_area_wide', 
  'meter_area_right',
  'meter_area_left',
  'adjacent_wall',
  'area_behind_fence',
  'ac_unit_label',
  'second_ac_unit_label',
  'breaker_box_interior',
  'main_disconnect_switch',
  'breaker_box_area'
];

// Server-side prompt generation (moved from client)
function getValidationPrompt(photoType: PhotoType): string {
  const wantsData = NEEDS_DATA_EXTRACTION.includes(photoType);
  const jsonFields = wantsData
    ? '- isValid: boolean (true if photo meets all criteria)\n- confidence: number (0-1, confidence in your assessment)\n- feedback: string (specific feedback for the user)\n- extractedData: object (any data you can extract from the image)'
    : '- isValid: boolean (true if photo meets all criteria)\n- confidence: number (0-1, confidence in your assessment)\n- feedback: string (specific feedback for the user)';

  const basePrompt = `You are an expert at validating home energy survey photos. Analyze this image and determine if it meets the criteria for a "${photoType}" photo.

Return a JSON response with:
${jsonFields}

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

    area_behind_fence: `
- Fence is visible in the image
- Shows space between fence and house wall
- Image is sharp and not blurry`,

    ac_unit_label: `
- Contains a metallic or paper label with technical specifications
- Text is readable, especially LRA or RLA numbers
- Label is the primary subject of the photo`,

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

  const dataExtractionNote = wantsData 
    ? '\n\nIf extracting data (like amperage numbers), include specific values in extractedData.'
    : '';
  
  return `${basePrompt}\n${criteria[photoType]}${dataExtractionNote}`;
}

export async function POST(request: NextRequest) {
  try {
    const { image, photoType } = await request.json();

    if (!image || !photoType) {
      return NextResponse.json(
        { error: 'Missing required fields: image, photoType' },
        { status: 400 }
      );
    }

    // Validate photoType server-side
    if (!VALID_PHOTO_TYPES.includes(photoType)) {
      return NextResponse.json(
        { error: 'Invalid photoType' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!LLM_CONFIG.apiKey) {
      return NextResponse.json(
        { error: 'LLM API key not configured' },
        { status: 500 }
      );
    }

    // Generate prompt server-side based on photoType
    const prompt = getValidationPrompt(photoType);

    // Call LLM API for validation
    const validationResult = await callLLMAPI(image, prompt);

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('Validation API error:', error);

    // Return fallback validation on error
    return NextResponse.json({
      isValid: true,
      confidence: 0.5,
      feedback:
        'Validation service temporarily unavailable. Photo accepted for manual review.',
      extractedData: null,
    });
  }
}

async function callLLMAPI(
  image: string,
  prompt: string
): Promise<ValidationResult> {
  const response = await fetch(`${LLM_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LLM_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: LLM_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.1, // Low temperature for consistent validation
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content in LLM response');
  }

  try {
    // Clean up markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse JSON response from LLM
    const result = JSON.parse(cleanContent);

    // Validate the response structure
    if (
      typeof result.isValid !== 'boolean' ||
      typeof result.confidence !== 'number' ||
      typeof result.feedback !== 'string'
    ) {
      throw new Error('Invalid LLM response structure');
    }

    return {
      isValid: result.isValid,
      confidence: Math.max(0, Math.min(1, result.confidence)), // Clamp 0-1
      feedback: result.feedback,
      extractedData: result.extractedData || null,
    };
  } catch (parseError) {
    console.error('Failed to parse LLM response:', parseError);
    console.error('LLM response content:', content);

    // Fallback: try to determine validity from text response
    const isValid =
      !content.toLowerCase().includes('invalid') &&
      !content.toLowerCase().includes('fail') &&
      !content.toLowerCase().includes('error');

    return {
      isValid,
      confidence: 0.6,
      feedback: content.substring(0, 200), // Truncate long responses
      extractedData: null,
    };
  }
}
