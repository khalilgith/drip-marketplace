import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pwd = process.env.DB_PASSWORD

async function tryConnect(host, port) {
  console.log(`Trying ${host}:${port}...`)
  const client = new pg.Client({
    host, port,
    database: 'postgres',
    user: 'postgres',
    password: pwd,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  })
  await client.connect()
  return client
}

async function run() {
  const hosts = [
    ['nyklrrynqyrbtdletkos.supabase.co', 5432],
    ['db.nyklrrynqyrbtdletkos.supabase.co', 5432],
  ]
  
  let client, lastErr
  for (const [host, port] of hosts) {
    try {
      client = await tryConnect(host, port)
      break
    } catch (err) {
      lastErr = err
      console.log(`  Failed: ${err.message}`)
    }
  }

  if (!client) throw lastErr
  console.log('Connected!')

  const migrationPath = path.resolve(__dirname, '../supabase/migrations/001_initial.sql')
  const sql = fs.readFileSync(migrationPath, 'utf-8')
  await client.query(sql)
  console.log('Migration completed')

  const seedPath = path.resolve(__dirname, '../supabase/seed.sql')
  if (fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, 'utf-8')
    await client.query(seedSql)
    console.log('Seed done')
  }

  await client.end()
  console.log('All done!')
}

run().catch((err) => {
  console.error('Final error:', err.message)
  process.exit(1)
})
