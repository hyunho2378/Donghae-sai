import { Router } from 'express'
import { searchKnowledge, buildSystemPrompt } from './rag.mjs'
import { createByteFallbackAssembler } from './byteFallback.mjs'

const router = Router()
const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'gemma4:e4b'

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body
    if (!message) return res.status(400).json({ error: 'message가 없다' })

    // 최근 대화만 컨텍스트로 넘긴다. role/content 만 허용하고 최근 8개로 제한한다(토큰 방어)
    const safeHistory = Array.isArray(history)
      ? history
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
          .slice(-8)
          .map((m) => ({ role: m.role, content: m.content }))
      : []

    // 자료집 검색은 이번 질문만 기준으로 한다. 대화 맥락은 히스토리로만 보완한다
    const hits = searchKnowledge(message)
    const systemPrompt = buildSystemPrompt(hits, safeHistory.length > 0)

    const ollamaRes = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...safeHistory,
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

    const assembler = createByteFallbackAssembler()
    const writeToken = (t) => { if (t) res.write(JSON.stringify({ type: 'token', token: t }) + '\n') }
    let sentDone = false

    const finishAnswer = () => {
      writeToken(assembler.finish())
      if (!sentDone) {
        res.write(JSON.stringify({ type: 'done' }) + '\n')
        sentDone = true
      }
    }

    const processLine = (line) => {
      const trimmed = line.trim()
      if (!trimmed) return
      try {
        const parsed = JSON.parse(trimmed)
        const chunk = parsed.message?.content
        if (chunk) writeToken(assembler.push(chunk))
        if (parsed.done) finishAnswer()
      } catch {
        // 완결됐지만 잘못된 NDJSON 한 줄은 다음 응답을 막지 않고 건너뛴다
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // Ollama는 줄 단위 JSON을 흘린다. 완결된 줄만 처리한다
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) processLine(line)
    }

    // TextDecoder 내부에 남은 UTF-8과 개행 없는 마지막 NDJSON 줄까지 EOF에서 처리한다.
    buffer += decoder.decode()
    if (buffer.trim()) processLine(buffer)
    finishAnswer()
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
