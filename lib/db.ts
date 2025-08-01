import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

// Load AWS RDS CA bundle for SSL certificate validation
const rdsCA = fs.readFileSync(path.join(process.cwd(), 'rds-ca-bundle.pem'), 'utf8')

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
  // SSL configuration: always use SSL with proper certificate validation
  ssl: {
    rejectUnauthorized: true,
    ca: rdsCA  // AWS RDS certificate bundle
  }
})

// Test connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
