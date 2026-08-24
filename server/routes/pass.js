import { Router } from 'express'
import { db, schema } from '../db/index.js'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/me', requireAuth, async (req, res) => {
  try {
    const reservations = await db.select().from(schema.reservations)
      .where(eq(schema.reservations.userId, req.user.id))
      .orderBy(desc(schema.reservations.createdAt))
    const transactions = await db.select().from(schema.transactions)
      .where(eq(schema.transactions.userId, req.user.id))
      .orderBy(desc(schema.transactions.createdAt))
    res.json({
      profile: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        stamps: (req.user.stamps || '').split(',').filter(Boolean),
        totalVisits: req.user.totalVisits
      },
      reservations,
      transactions
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
