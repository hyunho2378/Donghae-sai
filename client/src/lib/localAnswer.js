// 로컬(브라우저 안) 검색 폴백. 서버의 server/sovereign/rag.mjs 와 같은 채점 로직을
// 클라이언트에 그대로 옮겨서, Ollama가 없어도 같은 자료집(donghae-knowledge.json)에서
// 검색어와 겹치는 항목을 찾아 답한다. 문장을 새로 지어내지 않고 자료집 원문을 그대로 요약해 보여준다
import knowledge from '../data/donghae-knowledge.json'
import { sourceLabel, fixJosa } from './knowledgeLabels'

// server/sovereign/rag.mjs 의 SYNONYMS 와 동일하다. 서버 쪽을 고치면 여기도 같이 고친다
const SYNONYMS = [
  { hit: /아이|애들|애기|아기|자녀|키즈|어린이|가족/, add: ' 가족 아이' },
  { hit: /잘 ?데|잘 ?곳|묵을|자는 곳|숙소|숙박|호텔|펜션|게스트/, add: ' 숙소 숙박' },
  { hit: /먹을|맛집|밥|식당|먹거리|저녁|점심|아침 ?먹/, add: ' 맛집 먹거리' },
  { hit: /뚜벅이|차 ?없|대중교통|버스|걸어|도보/, add: ' 뚜벅이 대중교통' },
  { hit: /밤|야간|저녁 ?이후|별|야경/, add: ' 밤 야간' },
  { hit: /체험|놀거리|액티비티|즐길|볼거리/, add: ' 체험 액티비티' }
]

const MIN_SCORE = 2

function expandQuery(query) {
  let q = query
  for (const { hit, add } of SYNONYMS) if (hit.test(query)) q += add
  return q
}

// server/sovereign/rag.mjs 의 searchKnowledge 와 같은 채점 방식이다
export function searchLocalKnowledge(rawQuery, maxHits = 4) {
  const query = expandQuery(rawQuery)
  const scored = knowledge.map((item, idx) => {
    let score = 0
    for (const kw of item.keywords) {
      if (kw.length >= 2 && query.includes(kw)) {
        score += 2
      } else {
        for (const word of kw.split(' ')) {
          if (word.length >= 2 && query.includes(word)) score += 1
        }
      }
    }
    if (/코스|일정|동선/.test(rawQuery) && item.id.startsWith('course-')) score += 4
    return { item, score: score * (item.weight || 1), idx }
  })

  const ranked = scored
    .filter((s) => s.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
  // 1위 점수의 35%에 못 미치는 항목은 우연히 단어 하나만 겹친 것이라 뺀다
  const floor = ranked.length ? ranked[0].score * 0.35 : 0
  return ranked
    .filter((s) => s.score >= floor)
    .slice(0, maxHits)
    .map((s) => s.item)
}

// 한글 음절 분해와 조립. 어미를 해요체로 바꿀 때 쓴다
function split(ch) {
  const c = ch.charCodeAt(0) - 0xac00
  if (c < 0 || c > 11171) return null
  return { cho: Math.floor(c / 588), jung: Math.floor((c % 588) / 28), jong: c % 28 }
}
function join(cho, jung, jong = 0) {
  return String.fromCharCode(0xac00 + cho * 588 + jung * 28 + jong)
}

// 자료집은 내부 문서라 다체다. 챗봇 말투(해요체)에 맞게 문장 끝만 바꾼다. 내용은 고치지 않는다
const ENDINGS = [
  [/아니다\./g, '아니에요.'], [/이다\./g, '이에요.'], [/있다\./g, '있어요.'], [/없다\./g, '없어요.'],
  [/했다\./g, '했어요.'], [/됐다\./g, '됐어요.'], [/였다\./g, '였어요.'],
  [/었다\./g, '었어요.'], [/았다\./g, '았어요.'], [/한다\./g, '해요.'], [/하다\./g, '해요.'],
  [/된다\./g, '돼요.'], [/않는다\./g, '않아요.'], [/좋다\./g, '좋아요.'],
  [/많다\./g, '많아요.'], [/간다\./g, '가요.'], [/다른다\./g, '달라요.'],
  [/만든다\./g, '만들어요.'], [/연다\./g, '열어요.'], [/고른다\./g, '골라요.'], [/걷는다\./g, '걸어요.']
]
function conjugate(ch, isNeunda) {
  const d = split(ch)
  if (!d) return null
  if (isNeunda) {
    // 담는다 → 담아요, 먹는다 → 먹어요. 끝 모음이 ㅏ ㅗ 면 아요
    return ch + (d.jung === 0 || d.jung === 8 ? '아요' : '어요')
  }
  // ㄴ다 활용. 받침 ㄴ을 떼고 모음에 요를 붙인다. 준다 → 줘요, 기다린다 → 기다려요
  const map = { 8: 9, 13: 14, 20: 6 }
  if ([0, 1, 4, 5, 6].includes(d.jung)) return join(d.cho, d.jung) + '요'
  if (map[d.jung] !== undefined) return join(d.cho, map[d.jung]) + '요'
  return null
}
function toHaeyo(sentence) {
  let s = sentence
  for (const [re, to] of ENDINGS) s = s.replace(re, to)
  s = s.replace(/([가-힣])는다\./g, (m, ch) => conjugate(ch, true) + '.')
  s = s.replace(/([가-힣])다\./g, (m, ch) => {
    const d = split(ch)
    if (!d) return m
    if (d.jong === 0) return ch + '예요.' // 코스다 → 코스예요
    if (d.jong === 4) {
      const v = conjugate(ch, false)
      return v ? v + '.' : m
    }
    return ch + '이에요.' // 받침 명사 + 다 (자료집 표기 '맛집다') → 맛집이에요
  })
  return s
}

// 질문과 가장 많이 겹치는 문장을 고른다. 앞 문장만 자르면 묻는 내용(개화 시기, 가격 등)이 빠진다
const INTENTS = [
  { q: /언제|시기|몇 ?월|개화|시즌|계절/, s: /\d+월|중순|초순|하순|개화|시즌|계절/, w: 3 },
  { q: /몇 ?시|시간|영업|열어|닫|운영/, s: /\d+시|\d{2}:\d{2}|영업|마감|운영/, w: 3 },
  { q: /얼마|가격|요금|비용|돈/, s: /[\d,]+원|무료|할인/, w: 3 },
  { q: /어떻게|방법|사용|구매|사요|결제/, s: /결제|발급|태그|구매|사용/, w: 2 }
]

function bestSnippet(content, query, label = '') {
  const sentences = String(content || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean)
  if (!sentences.length) return ''
  const tokens = expandQuery(query).split(/\s+/).map((t) => t.replace(/[^\w가-힣]/g, '')).filter((t) => t.length >= 2)
  const scored = sentences.map((s, i) => {
    let score = 0
    for (const t of tokens) if (s.includes(t)) score += 1
    // 묻는 의도에 맞는 정보가 든 문장을 앞세운다. 언제면 날짜, 몇 시면 시간, 얼마면 요금
    for (const { q, s: re, w } of INTENTS) if (q.test(query) && re.test(s)) score += w
    // 항목 이름만 들어 있는 첫 소개 문장이 늘 이기지 않도록 이름 토큰은 가볍게 센다
    for (const t of tokens) if (s.includes(t) && label.includes(t)) score -= 0.7
    // '아래와 같다' 같은 안내문은 내용이 없어 뒤로 미룬다
    if (/아래와 같|다음과 같/.test(s)) score -= 2
    return { s, i, score }
  })
  const top = [...scored].sort((a, b) => b.score - a.score || a.i - b.i)
  const picked = top[0].score > 0 ? [top[0]] : [scored.find((x) => !/아래와 같|다음과 같/.test(x.s)) || scored[0]]
  // 첨 문장이 너무 짧으면 다음으로 점수가 높은 문장을 하나 더 붙인다
  if (picked[0].s.length < 30 && top[1] && top[1].i !== picked[0].i) picked.push(top[1])
  let out = picked.sort((a, b) => a.i - b.i).map((x) => toHaeyo(x.s)).join(' ')
  // 너무 길면 90자 안쪽의 마지막 쉼표에서 끊는다. 단어 중간에서 잘리지 않게 한다
  if (out.length > 90) {
    const cut = out.lastIndexOf(',', 90)
    out = (cut > 40 ? out.slice(0, cut) : out.slice(0, 88)).trim() + '…'
  }
  return out
}

// 검색 결과가 없을 때 쓰는 문장. 지어내지 않고 자료가 없다고 정직하게 말한다
const EMPTY_ANSWER = {
  text: '아직 그 내용은 자료집에 없어요. 다른 말로 다시 물어봐 주세요.',
  sources: [],
  links: {}
}

// 서버 RAG(Ollama)가 없을 때 쓰는 로컬 폴백 답변을 만든다.
// 문장을 새로 짓지 않고 자료집 항목을 하이픈 불릿으로 나열한다. 이름은 sourceLabel 로 통일한다
export function buildLocalAnswer(query) {
  // 같은 장소가 권역 요약과 개별 스팟으로 두 번 잡히면 하나로 합친다
  const seen = new Set()
  const hits = searchLocalKnowledge(query, 6).filter((h) => {
    const label = sourceLabel(h.id)
    if (seen.has(label)) return false
    seen.add(label)
    return true
  }).slice(0, 3)
  if (!hits.length) return EMPTY_ANSWER

  const lines = hits.map((h) => `- **${sourceLabel(h.id)}**: ${bestSnippet(h.content, query, sourceLabel(h.id))}`)
  const text = fixJosa(
    `동해 자료집에서 찾은 내용이에요.\n\n${lines.join('\n')}\n\n더 궁금한 게 있으면 편하게 물어봐 주세요.`
  )
  const sources = hits.map((h) => h.id)
  const links = Object.fromEntries(hits.filter((h) => h.link).map((h) => [h.id, h.link]))
  return { text, sources, links }
}
