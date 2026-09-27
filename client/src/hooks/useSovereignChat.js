import { useState } from 'react'
import { stripEmoji } from '../lib/stripEmoji'
import { sourceLabel, resolveSources, fixJosa } from '../lib/knowledgeLabels'
import { buildLocalAnswer } from '../lib/localAnswer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
// 원격 서버(Ollama)가 이 시간 안에 응답하지 않으면 로컬 폴백으로 넘어간다.
// 배포된 사이트는 서버가 아예 없어 즉시 실패하고, 로컬에서 Ollama를 켜 두면 이 시간 안에 첫 응답이 온다
const REMOTE_TIMEOUT_MS = 4000

// 라벨과 조사 교정 로직은 knowledgeLabels.js 에 있다. 로컬 폴백(localAnswer.js)도 같은 모듈을 쓰므로
// 순환 참조를 피하려고 이 파일에서 재노출만 한다. 다른 파일의 import 경로는 그대로 둔다
export { sourceLabel, resolveSources, fixJosa }

// 모델이 남긴 마크다운 기호를 지운다. 스트리밍 중 잘린 기호도 같이 처리된다
export function stripMarkdown(text) {
  let out = stripEmoji(text)
    .replace(/^#{1,6}\s*/gm, '')
    // 별표 불릿(* 항목)을 하이픈 불릿(- 항목)으로 통일한다. 렌더러가 목록으로 그린다
    .replace(/^([ \t]*)\*[ \t]+/gm, '$1- ')
    .replace(/[#`]/g, '')
    .replace(/\*{3,}/g, '**')
    // 일반 문장의 항목 콜론만 지운다. 볼드 이름 뒤(불릿 라벨) 콜론과 시각 10:00은 남긴다
    .replace(/([^\d\s*])\s*:[ \t]+/g, '$1 ')
  // 모델이 홑별표로 강조하는 경우가 잦다. 짝이 맞는 홑별표는 볼드로 승격한다
  out = out.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1**$2**')
  // 짝이 없이 남은 홑별표는 지운다
  out = out.replace(/(^|[^*])\*(?!\*)/g, '$1')
  // 스트리밍 도중 짝이 안 맞는 마지막 별표는 감춘다
  const marks = out.match(/\*\*/g)
  if (marks && marks.length % 2 === 1) out = out.replace(/\*\*(?=[^*]*$)/, '')
  // 볼드 장소명 뒤 조사를 받침에 맞게 교정한다
  return fixJosa(out)
}

export default function useSovereignChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)

  async function send(raw) {
    const text = raw.trim()
    if (!text || streaming) return

    // 최근 대화 맥락을 서버로 함께 보낸다. role/content 만, 최근 8개(질문 4 + 답변 4)로 제한한다.
    // seed 안내 말풍선과 빈 메시지는 제외. 후속 지시어면 서버가 이 히스토리로 RAG 검색도 보강한다
    const history = messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content && !m.seed)
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    setStreaming(true)

    // 빈 어시스턴트 말풍선을 먼저 추가한다. 여기에 토큰을 이어붙인다
    setMessages((prev) => [...prev, { role: 'assistant', content: '', sources: [], links: {} }])

    try {
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS)
      let res
      try {
        res = await fetch(`${API_URL}/api/sovereign/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history }),
          signal: controller.signal
        })
      } finally {
        window.clearTimeout(timeoutId)
      }

      if (!res.ok || !res.body) {
        throw new Error('원격 서버 응답 없음')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let gotFirstToken = false

      const processLine = (line) => {
        const trimmed = line.trim()
        if (!trimmed) return
        let parsed
        try {
          parsed = JSON.parse(trimmed)
        } catch {
          return
        }

        if (parsed.type === 'sources') {
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === 'assistant') {
              next[next.length - 1] = { ...last, sources: parsed.sources || [], links: parsed.links || {} }
            }
            return next
          })
        }

        if (parsed.type === 'token' && parsed.token) {
          if (!gotFirstToken) {
            gotFirstToken = true
            setLoading(false)
          }
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === 'assistant') {
              next[next.length - 1] = { ...last, content: last.content + parsed.token }
            }
            return next
          })
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) processLine(line)
      }

      // TextDecoder 내부와 개행 없는 마지막 NDJSON 줄을 EOF에서 빠뜨리지 않는다.
      buffer += decoder.decode()
      if (buffer.trim()) processLine(buffer)
    } catch (e) {
      // 원격 서버(Ollama)가 없거나 응답이 느리면 여기로 온다. 배포된 사이트에는 서버가 아예 없어 거의 매번 이 경로를 탄다.
      // 같은 자료집(donghae-knowledge.json)을 브라우저 안에서 직접 검색해 답하고, 토큰이 흐르는 모양은 그대로 유지한다
      const { text: answer, sources, links } = buildLocalAnswer(text)
      setLoading(false)
      const CHUNK = 3
      for (let i = 0; i < answer.length; i += CHUNK) {
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last && last.role === 'assistant') {
            next[next.length - 1] = { ...last, content: last.content + answer.slice(i, i + CHUNK) }
          }
          return next
        })
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => window.setTimeout(resolve, 14))
      }
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last && last.role === 'assistant') next[next.length - 1] = { ...last, sources, links }
        return next
      })
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  // 초기 상태 복귀용. 스트리밍 로직은 건드리지 않는다
  function reset() {
    setMessages(initialMessages)
  }

  return { messages, loading, streaming, send, reset }
}
