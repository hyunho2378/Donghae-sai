import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema.js'

const rawSql = neon(process.env.DATABASE_URL)
const db = drizzle(rawSql, { schema })

async function clearAll() {
  await rawSql(`TRUNCATE TABLE transactions, reservations, profiles RESTART IDENTITY CASCADE`)
}

async function seedProfiles() {
  const profiles = [
    { email: 'demo@donghaesai.kr', name: '데모 여행자', role: 'walk2030', stamps: 'mukho,cheongok,mangsang,starlight', totalVisits: 4 },
    { email: 'family@donghaesai.kr', name: '가족 여행자', role: 'car4050', stamps: 'chuam,muleung', totalVisits: 2 }
  ]
  for (const p of profiles) {
    await db.insert(schema.profiles).values(p)
  }
  return profiles.length
}

async function run() {
  console.log('Clearing existing data...')
  await clearAll()

  console.log('Seeding profiles...')
  const npr = await seedProfiles()
  console.log(`  profiles: ${npr}`)

  const counts = await rawSql(
    `SELECT 'profiles' AS t, COUNT(*)::int AS c FROM profiles
     UNION ALL SELECT 'reservations', COUNT(*)::int FROM reservations
     UNION ALL SELECT 'transactions', COUNT(*)::int FROM transactions
     ORDER BY t`
  )
  console.log('\nFinal counts:')
  for (const r of counts) console.log(`  ${r.t}: ${r.c}`)
}

run().then(() => process.exit(0)).catch((e) => {
  console.error('Seed failed:', e)
  process.exit(1)
})
