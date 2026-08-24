import { useState } from 'react'
import staysData from '../data/stays.json'
import packagesData from '../data/packages.json'
import storiesData from '../data/stories.json'

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

// 자료집이 156건으로 늘면서 라벨을 손으로 유지할 수 없다. 화면 데이터에서 직접 뽑는다
const DATA_LABELS = { 'night-guide': '밤에 갈 만한 곳' }
for (const s of staysData) DATA_LABELS[s.id] = s.name
for (const p of packagesData) DATA_LABELS[p.id] = p.name
for (const t of storiesData) DATA_LABELS[`story-${t.slug}`] = t.title

export function sourceLabel(id) {
  return SOURCE_LABELS[id] || DATA_LABELS[id] || id
}

// 출처 id를 우측 카드용 데이터로 푼다. link 라우트로 원본 데이터를 찾아 사진과 설명을 붙인다
// 라우트가 없는 개념 항목(positioning 등)은 카드로 만들 수 없어 건너뛴다
export function resolveSources(sources = [], links = {}) {
  const seen = new Set()
  return sources.map((id) => {
    const route = links[id]
    const name = sourceLabel(id)
    if (route?.startsWith('/stays/')) {
      const s = staysData.find((x) => x.id === route.split('/')[2])
      if (s) return { id, name: s.name, image: s.main_image || s.gallery?.[0] || null, desc: s.short_description || s.tagline || '', route, kind: '장소' }
    }
    if (route?.startsWith('/packages/')) {
      const p = packagesData.find((x) => x.id === route.split('/')[2])
      if (p) return { id, name: p.name, image: p.main_image || null, desc: p.short_description || p.tagline || '', route, kind: p.category === 'program' ? '프로그램' : '코스' }
    }
    if (route?.startsWith('/story/')) {
      const t = storiesData.find((x) => x.slug === route.split('/')[2])
      if (t) return { id, name: t.title, image: t.cover_image || null, desc: (t.subtitle || '').toString().replace(/\n/g, ' '), route, kind: '스토리' }
    }
    if (route?.startsWith('/membership') || route?.startsWith('/pass')) {
      return { id, name, image: null, desc: '동해사이 패스로 제휴처 할인과 스탬프를 이용해요', route: '/membership', kind: '패스' }
    }
    return null // 라우트 없는 항목은 카드로 못 만든다
  }).filter(Boolean).filter((c) => {
    // 같은 목적지가 여러 출처로 중복되면 카드 하나로 합친다
    if (seen.has(c.route)) return false
    seen.add(c.route)
    return true
  })
}

// 한글 마지막 글자의 받침 유무. 0xAC00 기준 (코드-0xAC00)%28 이 0이면 받침 없음
// 반환: null(한글 아님), 0(받침 없음), 8(ㄹ받침), 그 외 양수(받침 있음)
function lastBatchim(word) {
  const ch = (word || '').trimEnd().slice(-1)
  if (!ch) return null
  const code = ch.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return null // 한글 음절 아님
  return (code - 0xac00) % 28
}

// 받침 유무로 조사를 고른다. 한글이 아니면 원래 조사를 그대로 둔다
function correctJosa(word, josa) {
  const jong = lastBatchim(word)
  if (jong === null) return josa
  const hasBatchim = jong !== 0
  switch (josa) {
    case '은': case '는': return hasBatchim ? '은' : '는'
    case '이': case '가': return hasBatchim ? '이' : '가'
    case '을': case '를': return hasBatchim ? '을' : '를'
    case '과': case '와': return hasBatchim ? '과' : '와'
    // 받침 없거나 ㄹ받침(종성 8)이면 로, 그 외 받침이면 으로
    case '으로': case '로': return (!hasBatchim || jong === 8) ? '로' : '으로'
    default: return josa
  }
}

// LLM 조사 오류 안전망. 볼드로 감싼 장소명 뒤에 붙은 조사만 받침에 맞게 고친다
// 볼드 뒤로 한정해 멀쩡한 문장을 깨뜨릴 위험을 줄인다. 스트리밍 미완성 볼드는 매칭 안 됨
export function fixJosa(text) {
  return text.replace(/(\*\*[^*\n]+\*\*)(으로|로|은|는|이|가|을|를|과|와)/g,
    (_, bold, josa) => bold + correctJosa(bold.slice(2, -2), josa))
}

// 모델이 남긴 마크다운 기호를 지운다. 스트리밍 중 잘린 기호도 같이 처리된다
export function stripMarkdown(text) {
  let out = text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*[*-]\s+/gm, '')
    .replace(/[#`]/g, '')
    .replace(/\*{3,}/g, '**')
    // DESIGN.md는 AI 응답에 콜론을 금지한다. 시각 표기 10:00은 그대로 두고 항목 뒤 콜론만 지운다
    .replace(/([^\d\s])\s*:[ \t]+/g, '$1 ')
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

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    setStreaming(true)

    // 빈 어시스턴트 말풍선을 먼저 추가한다. 여기에 토큰을 이어붙인다
    setMessages((prev) => [...prev, { role: 'assistant', content: '', sources: [], links: {} }])

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
