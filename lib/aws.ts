import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const s3 = new S3Client({ 
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const S3_BUCKET = process.env.AWS_S3_BUCKET!

export async function uploadBuffer(key: string, buffer: Buffer, mime = 'image/jpeg') {
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mime,
    ACL: 'private'
  }))
  
  return `s3://${S3_BUCKET}/${key}`
}

export function getS3Url(key: string): string {
  return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
