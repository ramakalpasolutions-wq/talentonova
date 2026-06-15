// test-r2.mjs
import { config } from 'dotenv'
config()

import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'

const accountId = process.env.R2_ACCOUNT_ID
const endpoint = `https://${accountId}.r2.cloudflarestorage.com`

console.log('Testing R2...')
console.log('Account ID:', accountId)
console.log('Endpoint:', endpoint)
console.log('Access Key:', process.env.R2_ACCESS_KEY_ID?.slice(0, 10) + '...')

const s3 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

try {
  const result = await s3.send(new ListBucketsCommand({}))
  console.log('✅ Connected! Buckets:', result.Buckets?.map(b => b.Name))
} catch(e) {
  console.error('❌ Failed:', e.message)
}