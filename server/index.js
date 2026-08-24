import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import authRouter from './routes/auth.js'
import reservationsRouter from './routes/reservations.js'
import passRouter from './routes/pass.js'
import adminRouter from './routes/admin.js'
import sovereignChatRouter from './sovereign/chat.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'g-local-station-server', phase: 3 })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() })
})

app.use('/api/auth', authRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/pass', passRouter)
app.use('/api/admin', adminRouter)
app.use('/api/sovereign/chat', sovereignChatRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`g-local-station server listening on http://localhost:${PORT}`)
})
