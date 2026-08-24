import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const STATEMENTS = [
  `DROP TABLE IF EXISTS "reservations" CASCADE`,
  `DROP TABLE IF EXISTS "stays" CASCADE`,
  `DROP TABLE IF EXISTS "packages" CASCADE`,
  `DROP TABLE IF EXISTS "journal_posts" CASCADE`,
  `DROP TABLE IF EXISTS "goods" CASCADE`,

  `DROP TYPE IF EXISTS "stay_type"`,
  `DROP TYPE IF EXISTS "package_tier"`,
  `DROP TYPE IF EXISTS "persona"`,
  `DROP TYPE IF EXISTS "stage"`,
  `DROP TYPE IF EXISTS "journal_category"`,
  `DROP TYPE IF EXISTS "goods_category"`,

  `DO $$ BEGIN CREATE TYPE "role" AS ENUM ('walk2030','car2030','walk4050','car4050'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
  `DO $$ BEGIN CREATE TYPE "reservation_status" AS ENUM ('pending','confirmed','completed','cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
  `DO $$ BEGIN CREATE TYPE "transaction_type" AS ENUM ('credit','debit'); EXCEPTION WHEN duplicate_object THEN null; END $$`,

  `CREATE TABLE IF NOT EXISTS "profiles" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "auth_id" varchar(255),
    "email" varchar(255),
    "name" varchar(255),
    "role" "role" DEFAULT 'walk2030' NOT NULL,
    "stamps" varchar(200) DEFAULT '' NOT NULL,
    "total_visits" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "reservations" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid REFERENCES "profiles"("id"),
    "stay_external_id" varchar(100),
    "package_external_id" varchar(100),
    "check_in" date,
    "check_out" date,
    "guests" integer DEFAULT 1 NOT NULL,
    "total_price" integer NOT NULL,
    "status" "reservation_status" DEFAULT 'pending' NOT NULL,
    "pass_code" varchar(100),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "transactions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid REFERENCES "profiles"("id"),
    "amount" integer NOT NULL,
    "type" "transaction_type" NOT NULL,
    "description" varchar(255),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`
]

async function run() {
  console.log('Running migration on NeonDB...')
  for (const stmt of STATEMENTS) {
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 80)
    process.stdout.write(`  ${preview}... `)
    try {
      await sql(stmt)
      console.log('OK')
    } catch (e) {
      console.log(`ERROR: ${e.message}`)
      throw e
    }
  }

  console.log('\nVerifying tables...')
  const tables = await sql(
    `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`
  )
  console.log('Tables:', tables.map((r) => r.tablename).join(', '))
}

run().then(() => process.exit(0)).catch((e) => {
  console.error('Migration failed:', e)
  process.exit(1)
})
