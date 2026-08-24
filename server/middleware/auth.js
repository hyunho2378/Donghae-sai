import { db, schema } from '../db/index.js'
import { eq } from 'drizzle-orm'

export async function requireAuth(req, res, next) {
  const userId = req.header('x-user-id')
  if (!userId) return res.status(401).json({ error: 'unauthorized' })
  try {
    const rows = await db.select().from(schema.profiles).where(eq(schema.profiles.id, userId)).limit(1)
    if (rows.length === 0) return res.status(401).json({ error: 'unauthorized' })
    req.user = rows[0]
    next()
  } catch (e) {
    res.status(401).json({ error: 'unauthorized' })
  }
}

export async function requireOperator(req, res, next) {
  await requireAuth(req, res, async () => {
    if (req.user?.role !== 'operator') return res.status(403).json({ error: 'forbidden' })
    next()
  })
}
