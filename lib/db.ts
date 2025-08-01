import { Pool } from 'pg'

// NODE_EXTRA_CA_CERTS should be set by startup script before Node starts

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
