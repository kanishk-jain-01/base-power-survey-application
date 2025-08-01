// Test setup file
import { beforeAll } from 'vitest'

beforeAll(() => {
  // Ensure required environment variables are set for testing
  if (!process.env.OPENAI_API_KEY && !process.env.XAI_API_KEY) {
    console.warn('Warning: No LLM API key configured. Some tests may fail.')
  }
})
