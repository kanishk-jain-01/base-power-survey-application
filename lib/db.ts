// Set NODE_EXTRA_CA_CERTS before any other imports (for Vercel serverless)
import fs from 'fs'
import path from 'path'

if (!process.env.NODE_EXTRA_CA_CERTS) {
  const caPath = path.join(process.cwd(), 'rds-ca-bundle.pem')
  if (fs.existsSync(caPath)) {
    process.env.NODE_EXTRA_CA_CERTS = caPath
    console.log('✅ Set NODE_EXTRA_CA_CERTS for serverless:', caPath)
  }
}

import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
  // SSL configuration: simple validation, trust store handles CAs
  ssl: { rejectUnauthorized: true }
})

// Test connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
