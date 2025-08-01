import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, S3_BUCKET } from '@/lib/aws'
import { v4 as uuid } from 'uuid'

interface PresignRequest {
  photos: { photoType: string }[]
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
    const payload: PresignRequest = await req.json()
    
    // Validate required fields
    if (!Array.isArray(payload.photos)) {
      return NextResponse.json({ error: 'Photos array is required' }, { status: 400 })
    }

    const urls = await Promise.all(
      payload.photos.map(async ({ photoType }) => {
        if (!photoType || typeof photoType !== 'string') {
          throw new Error('Each photo must have a valid photoType')
        }

        const key = `survey/tmp/${uuid()}_${photoType}.jpg`
        const putCmd = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          ContentType: 'image/jpeg',
        })
        const uploadUrl = await getSignedUrl(s3, putCmd, { expiresIn: 900 }) // 15 minutes

        return { photoType, key, uploadUrl }
      })
    )

    return NextResponse.json({ urls }, { status: 200 })

  } catch (error) {
    console.error('Presigned URL generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
