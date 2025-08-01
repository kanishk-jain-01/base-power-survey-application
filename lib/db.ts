import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
  // SSL configuration: always use SSL, but skip cert validation in development
  ssl: process.env.NODE_ENV === 'development'
    ? { rejectUnauthorized: false }
    : { rejectUnauthorized: true }
})

// Test connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
