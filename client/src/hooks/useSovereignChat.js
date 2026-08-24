import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// 자료집 항목 id를 화면에 보일 이름으로 옮긴다. donghae-knowledge.json 내용 기준
const SOURCE_LABELS = {
  muleung: '무릉별유천지',
  byeolnuri: '별누리천문대',
  haeparang: '해파랑길 33코스',
  mukho: '묵호 권역',
  positioning: '동해 포지셔닝',
  'pass-1day': '동해사이 1일권',
  'pass-2day': '동해사이 2일권',
  'pass-3day': '동해사이 3일권',
  'pass-family': '가족 패스 발급',
  'pass-how': '패스 구매와 사용',
  'course-2030-walk-mukho': '2030 뚜벅이 묵호 코스',
  'course-2030-walk-cheonok': '2030 뚜벅이 도심 코스',
  'course-2030-car-active': '2030 자차 액티비티 코스',
  'course-2030-car-muleung': '2030 자차 무릉 코스',
  'course-4050-walk-slow': '4050 뚜벅이 천천히 코스',
  'course-4050-walk-beach': '4050 뚜벅이 바다 코스',
  'course-4050-car-heal': '4050 자차 무릉 휴식 코스',
  'course-4050-car-round': '4050 자차 절경 코스',
  'food-mukho': '묵호 맛집 후보',
  'food-cheonok-hanseom': '천곡과 한섬 맛집 후보',
  'food-mangsang': '망상 맛집 후보',
  'food-chuam': '추암 맛집 후보',
  'food-muleung': '무릉 맛집 후보'
}

export function sourceLabel(id) {
  return SOURCE_LABELS[id] || id
}

// 모델이 남긴 마크다운 기호를 지운다. 스트리밍 중 잘린 기호도 같이 처리된다
export function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*[*-]\s+/gm, '')
    .replace(/[*#`]/g, '')
}

export default function useSovereignChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)

  async function send(raw) {
    const text = raw.trim()
    if (!text || streaming) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    setStreaming(true)

    // 빈 어시스턴트 말풍선을 먼저 추가한다. 여기에 토큰을 이어붙인다
    setMessages((prev) => [...prev, { role: 'assistant', content: '', sources: [] }])

    try {
      const res = await fetch(`${API_URL}/api/sovereign/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })

      if (!res.body) {
        throw new Error('스트림 없음')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let gotFirstToken = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          let parsed
          try {
            parsed = JSON.parse(trimmed)
          } catch {
            continue
          }

          if (parsed.type === 'sources') {
            setMessages((prev) => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last && last.role === 'assistant') {
                next[next.length - 1] = { ...last, sources: parsed.sources || [] }
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
      }
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last && last.role === 'assistant' && last.content === '') {
          next[next.length - 1] = { ...last, content: '서버 연결에 실패했습니다.' }
        }
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
