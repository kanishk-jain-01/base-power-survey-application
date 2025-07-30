import { NextRequest, NextResponse } from 'next/server';
import { ValidationResult, PhotoType } from '@/lib/types';

// LLM API configuration
const LLM_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || process.env.XAI_API_KEY,
  baseURL: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
  model: process.env.LLM_MODEL || 'gpt-4o-mini',
};

export async function POST(request: NextRequest) {
  try {
    const { image, prompt, photoType } = await request.json();

    if (!image || !prompt || !photoType) {
      return NextResponse.json(
        { error: 'Missing required fields: image, prompt, photoType' },
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

    // Call LLM API for validation
    const validationResult = await callLLMAPI(image, prompt);
    
    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('Validation API error:', error);
    
    // Return fallback validation on error
    return NextResponse.json({
      isValid: true,
      confidence: 0.5,
      feedback: 'Validation service temporarily unavailable. Photo accepted for manual review.',
      extractedData: null,
    });
  }
}

async function callLLMAPI(image: string, prompt: string): Promise<ValidationResult> {
  const response = await fetch(`${LLM_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LLM_CONFIG.apiKey}`,
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
                detail: 'high'
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
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse JSON response from LLM
    const result = JSON.parse(cleanContent);
    
    // Validate the response structure
    if (typeof result.isValid !== 'boolean' || 
        typeof result.confidence !== 'number' || 
        typeof result.feedback !== 'string') {
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
    const isValid = !content.toLowerCase().includes('invalid') && 
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


