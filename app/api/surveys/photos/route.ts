import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, S3_BUCKET } from '@/lib/aws'
import { v4 as uuid } from 'uuid'
import { PhotoType } from '@/lib/types'
import { rateLimit } from '@/lib/rateLimit'

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
  'breaker_box_area',
]

interface PresignRequest {
  photos: { photoType: string }[]
}

export async function POST(req: NextRequest) {
  // Auth: require API key for external calls, allow same-origin for frontend
  const apiKey = req.headers.get('x-internal-api-key')
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  
  // If API key is provided, validate it (external access)
  if (apiKey) {
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else {
    // No API key: only allow same-origin requests (frontend)
    if (!origin || !host || !origin.includes(host)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Rate limit presign requests to protect S3 from abuse (60 requests / min)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = rateLimit(ip, 60, 60_000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const payload: PresignRequest = await req.json()
    
    // Validate required fields
    if (!Array.isArray(payload.photos)) {
      return NextResponse.json({ error: 'Photos array is required' }, { status: 400 })
    }

    const urls = await Promise.all(
      payload.photos.map(async ({ photoType }) => {
        if (!photoType || typeof photoType !== 'string' || !VALID_PHOTO_TYPES.includes(photoType as PhotoType)) {
          throw new Error('Invalid photoType')
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
