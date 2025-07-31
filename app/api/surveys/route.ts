import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer, getS3Url } from '@/lib/aws'
import { pool } from '@/lib/db'

interface PhotoData {
  photoType: string
  base64Data: string
  validation?: {
    isValid: boolean
    confidence: number
    feedback: string
    extractedData?: Record<string, unknown>
  }
}

interface SurveySubmission {
  customerEmail: string
  photos: PhotoData[]
  skippedSteps: string[]
  mainDisconnectAmperage?: number
  geolocation?: string
  notes?: string
}

export async function POST(req: NextRequest) {
  // For internal requests from our frontend, check if it's coming from same origin
  // For external API access, require API key
  const apiKey = req.headers.get('x-internal-api-key')
  const isExternalRequest = apiKey !== null
  
  if (isExternalRequest && apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload: SurveySubmission = await req.json()
    
    // Validate required fields
    if (!payload.customerEmail || !Array.isArray(payload.photos)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.customerEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Insert or get customer
      const { rows: [customer] } = await client.query(
        `INSERT INTO customers(email) 
         VALUES($1) 
         ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email 
         RETURNING customer_id`,
        [payload.customerEmail]
      )

      // Insert survey
      const { rows: [survey] } = await client.query(
        `INSERT INTO surveys(customer_id, main_disconnect_amperage, status, geolocation, notes, completion_timestamp)
         VALUES($1, $2, 'completed', $3, $4, now()) 
         RETURNING survey_id`,
        [
          customer.customer_id,
          payload.mainDisconnectAmperage,
          payload.geolocation,
          payload.notes
        ]
      )

      // Process and upload photos
      for (const photo of payload.photos) {
        try {
          // Generate S3 key
          const timestamp = Date.now()
          const key = `survey/${survey.survey_id}/${photo.photoType}_${timestamp}.jpg`
          
          // Convert base64 to buffer and upload
          const buffer = Buffer.from(photo.base64Data, 'base64')
          await uploadBuffer(key, buffer, 'image/jpeg')
          
          // Get S3 URL
          const s3Url = getS3Url(key)
          
          // Insert photo record
          await client.query(
            `INSERT INTO photos(survey_id, s3_key, s3_url, photo_type, validation_json)
             VALUES($1, $2, $3, $4, $5)`,
            [
              survey.survey_id,
              key,
              s3Url,
              photo.photoType,
              photo.validation ? JSON.stringify(photo.validation) : null
            ]
          )
        } catch (photoError) {
          console.error(`Error processing photo ${photo.photoType}:`, photoError)
          throw photoError
        }
      }

      // Insert skipped steps
      for (const stepId of payload.skippedSteps) {
        await client.query(
          `INSERT INTO skipped_steps(survey_id, step_id) VALUES($1, $2)`,
          [survey.survey_id, stepId]
        )
      }

      await client.query('COMMIT')
      
      return NextResponse.json({ 
        surveyId: survey.survey_id,
        message: 'Survey submitted successfully' 
      }, { status: 201 })

    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Database transaction error:', error)
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // For external API access, require API key
  const apiKey = req.headers.get('x-internal-api-key')
  
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
    }

    const client = await pool.connect()
    
    try {
      // Get surveys for customer with photos
      const { rows: surveys } = await client.query(
        `SELECT 
           s.survey_id,
           s.start_timestamp,
           s.completion_timestamp,
           s.geolocation,
           s.main_disconnect_amperage,
           s.status,
           s.notes,
           s.validation_results,
           c.email,
           c.name,
           c.phone_number
         FROM surveys s
         JOIN customers c ON s.customer_id = c.customer_id
         WHERE c.email = $1
         ORDER BY s.start_timestamp DESC`,
        [email]
      )

      // Get photos for each survey
      for (const survey of surveys) {
        const { rows: photos } = await client.query(
          `SELECT 
             photo_id,
             s3_url,
             photo_type,
             capture_timestamp,
             geolocation,
             validation_json,
             metadata
           FROM photos
           WHERE survey_id = $1
           ORDER BY capture_timestamp`,
          [survey.survey_id]
        )
        
        survey.photos = photos
      }

      return NextResponse.json({ surveys }, { status: 200 })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Survey retrieval error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
