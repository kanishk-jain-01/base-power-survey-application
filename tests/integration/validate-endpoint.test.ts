import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/validate/route'
import { getValidationPrompt } from '@/lib/llm'

describe('Validate Endpoint Integration Test', () => {
  let testImageBase64: string

  beforeAll(() => {
    // Load the test image and convert to base64
    const imagePath = join(process.cwd(), 'tests/fixtures/main_disconnect_switch.png')
    const imageBuffer = readFileSync(imagePath)
    testImageBase64 = imageBuffer.toString('base64')
  })

  it('should validate main disconnect switch image and extract 200A amperage', async () => {
    // Prepare request payload using actual prompt generation
    const payload = {
      image: testImageBase64,
      photoType: 'main_disconnect_switch',
      prompt: getValidationPrompt('main_disconnect_switch')
    }

    // Create NextRequest and call POST handler directly
    const request = new NextRequest('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const response = await POST(request)
    const result = await response.json()

    // Verify response structure
    expect(result).toHaveProperty('isValid')
    expect(result).toHaveProperty('confidence')
    expect(result).toHaveProperty('feedback')
    expect(result).toHaveProperty('extractedData')

    // Verify validation results
    expect(result.isValid).toBe(true)
    expect(result.confidence).toBeGreaterThan(0.5)
    expect(typeof result.feedback).toBe('string')

    // Verify amperage extraction
    expect(result.extractedData).toBeTruthy()
    expect(result.extractedData).toHaveProperty('amperage')
    expect(result.extractedData!.amperage).toBe(200)

    console.log('Validation Result:', result)
  }, 30000) // 30 second timeout for LLM API call
})
