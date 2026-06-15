// src/actions/upload.js
'use server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { auth } from '@/auth'

export async function uploadToR2(file, folder = 'uploads') {
  const session = await auth()
  if (session?.user?.role !== 'admin') throw new Error('Unauthorized')

  if (!file || typeof file === 'string' || !file.size || file.size === 0) {
    throw new Error('No valid file provided')
  }

  const accountId = process.env.R2_ACCOUNT_ID?.trim()
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim()
  const bucketName = process.env.R2_BUCKET_NAME?.trim()
  const publicUrl = process.env.R2_PUBLIC_URL?.trim()

  console.log('📦 R2 Upload:')
  console.log('  Account ID:', accountId?.slice(0, 8))
  console.log('  Bucket    :', bucketName)
  console.log('  File name :', file.name)
  console.log('  File size :', file.size)

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error('R2 credentials not configured in .env')
  }

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`

  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  console.log('  Uploading to:', key)

  try {
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'image/jpeg',
    }))

    const url = `${publicUrl}/${key}`
    console.log('✅ Uploaded:', url)
    return url
  } catch (error) {
    console.error('❌ R2 Upload error:', error.message)
    throw new Error(`Upload failed: ${error.message}`)
  }
}