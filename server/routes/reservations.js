import { Router } from 'express'
import { db, schema } from '../db/index.js'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const { stayExternalId, packageExternalId, checkIn, checkOut, guests, totalPrice } = req.body
  if (!stayExternalId && !packageExternalId) {
    return res.status(400).json({ error: 'stay or package required' })
  }
  try {
    const passCode = `DHS-${req.user.id.slice(0, 8)}-${Date.now().toString(36)}`
    const inserted = await db.insert(schema.reservations).values({
      userId: req.user.id,
      stayExternalId: stayExternalId || null,
      packageExternalId: packageExternalId || null,
      checkIn, checkOut,
      guests: guests || 1,
      totalPrice: totalPrice || 0,
      status: 'pending',
      passCode
    }).returning()
    res.status(201).json(inserted[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'forbidden' })
  }
  try {
    const rows = await db.select().from(schema.reservations)
      .where(eq(schema.reservations.userId, userId))
      .orderBy(desc(schema.reservations.createdAt))
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
