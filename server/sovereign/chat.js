import { Router } from 'express'
import { searchKnowledge, buildSystemPrompt } from './rag.mjs'

const router = Router()
const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'gemma4:e4b'

router.post('/', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'message가 없다' })

    const hits = searchKnowledge(message)
    const systemPrompt = buildSystemPrompt(hits)

    const ollamaRes = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: true,
        think: false,
        keep_alive: "30m"
      })
    })

    if (!ollamaRes.ok || !ollamaRes.body) {
      const text = await ollamaRes.text().catch(() => '')
      return res.status(502).json({ error: 'Ollama 호출 실패', detail: text })
    }

    // 줄 단위 JSON 스트림으로 응답한다
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')

    // 먼저 sources를 한 줄 보낸다
    res.write(JSON.stringify({
      type: 'sources',
      sources: hits.map(h => h.id),
      links: Object.fromEntries(hits.filter(h => h.link).map(h => [h.id, h.link]))
    }) + '\n')

    const reader = ollamaRes.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // Ollama는 줄 단위 JSON을 흘린다. 완결된 줄만 처리한다
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const parsed = JSON.parse(trimmed)
          const chunk = parsed.message?.content
          if (chunk) {
            res.write(JSON.stringify({ type: 'token', token: chunk }) + '\n')
          }
          if (parsed.done) {
            res.write(JSON.stringify({ type: 'done' }) + '\n')
          }
        } catch {
          // 불완전한 줄은 건너뛴다
        }
      }
    }

    res.end()
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({ error: e.message })
    } else {
      res.end()
    }
  }
})

export default router
