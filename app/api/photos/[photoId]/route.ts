import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, S3_BUCKET } from '@/lib/aws'
import { pool } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  // Verify API key for external access
  const apiKey = req.headers.get('x-internal-api-key')
  
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { photoId } = await params

    // Get photo metadata from database
    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        'SELECT s3_key, photo_type FROM photos WHERE photo_id = $1',
        [photoId]
      )

      if (rows.length === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }

      const { s3_key } = rows[0]

      // Generate presigned URL (valid for 1 hour)
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3_key,
      })

      const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })

      return NextResponse.json({ 
        photoId,
        presignedUrl,
        expiresIn: 3600
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Photo access error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}
