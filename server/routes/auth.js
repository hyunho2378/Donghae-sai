import { Router } from 'express'
import { db, schema } from '../db/index.js'
import { eq } from 'drizzle-orm'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'email required' })

    const rows = await db.select().from(schema.profiles).where(eq(schema.profiles.email, email)).limit(1)
    if (rows.length === 0) {
      return res.status(404).json({ error: 'account not found' })
    }
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/signup', async (req, res) => {
  try {
    const { email, name, role } = req.body
    if (!email) return res.status(400).json({ error: 'email required' })

    const existing = await db.select().from(schema.profiles).where(eq(schema.profiles.email, email)).limit(1)
    if (existing.length > 0) {
      return res.status(409).json({ error: 'email already registered' })
    }

    const inserted = await db.insert(schema.profiles).values({
      email,
      name: name || email.split('@')[0],
      role: role || 'walk2030'
    }).returning()
    res.status(201).json(inserted[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
