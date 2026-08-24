import { Router } from 'express'
import { db, schema } from '../db/index.js'
import { sql } from 'drizzle-orm'
import { requireOperator } from '../middleware/auth.js'

const router = Router()

router.get('/reservations', requireOperator, async (req, res) => {
  try {
    const rows = await db.select().from(schema.reservations)
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/summary', requireOperator, async (req, res) => {
  try {
    const totalQ = await db.execute(
      sql`SELECT COALESCE(SUM(total_price),0)::int AS total FROM reservations WHERE status IN ('confirmed','completed')`
    )
    const todayQ = await db.execute(
      sql`SELECT COALESCE(SUM(total_price),0)::int AS total FROM reservations
          WHERE status IN ('confirmed','completed') AND created_at >= CURRENT_DATE`
    )
    const weekQ = await db.execute(
      sql`SELECT COALESCE(SUM(total_price),0)::int AS total FROM reservations
          WHERE status IN ('confirmed','completed') AND created_at >= CURRENT_DATE - INTERVAL '7 days'`
    )
    const reservationCount = await db.execute(
      sql`SELECT COUNT(*)::int AS cnt FROM reservations`
    )
    res.json({
      total: totalQ.rows?.[0]?.total ?? totalQ[0]?.total ?? 0,
      today: todayQ.rows?.[0]?.total ?? todayQ[0]?.total ?? 0,
      week: weekQ.rows?.[0]?.total ?? weekQ[0]?.total ?? 0,
      reservationCount: reservationCount.rows?.[0]?.cnt ?? reservationCount[0]?.cnt ?? 0
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
