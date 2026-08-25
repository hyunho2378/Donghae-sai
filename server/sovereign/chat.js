import { Router } from 'express'
import { searchKnowledge, buildSystemPrompt } from './rag.mjs'

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

    // gemma 같은 모델은 한글을 바이트 폴백 토큰(<0xEC> 형태)으로 흘리기도 한다.
    // 이 바이트를 모아 완전한 UTF-8 글자로 조립해야 화면에 <0xEC>가 날것으로 안 뜬다.
    // 예. <0xEC><0x90><0xAC> → 쐬. 일반 텍스트 토큰은 이 로직을 거치지 않고 그대로 나간다.
    let pending = [] // 아직 글자를 못 이룬 바이트들

    const flushBytes = (final) => {
      if (!pending.length) return ''
      const buf = Buffer.from(pending)
      if (final) { pending = []; return buf.toString('utf8') }
      // 뒤에서부터 연속 바이트(10xxxxxx)를 건너뛰어 마지막 글자의 시작을 찾는다
      let i = buf.length
      while (i > 0 && (buf[i - 1] & 0xc0) === 0x80) i--
      let cut = buf.length
      if (i > 0) {
        const lead = buf[i - 1]
        const need = lead >= 0xf0 ? 4 : lead >= 0xe0 ? 3 : lead >= 0xc0 ? 2 : 1
        cut = (buf.length - (i - 1) >= need) ? buf.length : i - 1 // 마지막 글자가 미완성이면 남긴다
      }
      const out = buf.subarray(0, cut).toString('utf8')
      pending = Array.from(buf.subarray(cut))
      return out
    }
    const writeToken = (t) => { if (t) res.write(JSON.stringify({ type: 'token', token: t }) + '\n') }

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
            if (/^(?:<0x[0-9a-fA-F]{2}>)+$/.test(chunk)) {
              // 순수 바이트 폴백 토큰(하나 이상). 바이트만 모으고 완성된 글자만 내보낸다
              for (const b of chunk.matchAll(/<0x([0-9a-fA-F]{2})>/g)) pending.push(parseInt(b[1], 16))
              writeToken(flushBytes(false))
            } else {
              // 일반 토큰. 남은 바이트를 먼저 비우고 이어 붙인다
              writeToken(flushBytes(true) + chunk)
            }
          }
          if (parsed.done) {
            writeToken(flushBytes(true))
            res.write(JSON.stringify({ type: 'done' }) + '\n')
          }
        } catch {
          // 불완전한 줄은 건너뛴다
        }
      }
    }

    writeToken(flushBytes(true)) // 남은 바이트가 있으면 마지막에 비운다
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
