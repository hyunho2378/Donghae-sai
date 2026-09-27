import staysData from '../data/stays.json'
import packagesData from '../data/packages.json'
import storiesData from '../data/stories.json'

// 자료집 항목 id를 화면에 보일 이름으로 옮긴다. donghae-knowledge.json 내용 기준
// useSovereignChat.js(서버 스트리밍 경로)와 localAnswer.js(로컬 폴백 경로)가 함께 쓴다.
// 순환 참조를 피하려고 이 파일에 라벨과 조사 교정 로직을 모아 둔다
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

// 자료집이 늘어날 때마다 라벨을 손으로 유지할 수 없다. 화면 데이터에서 직접 뽑는다
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

// LLM/로컬 폴백 공통 조사 오류 안전망. 볼드로 감싼 장소명 뒤에 붙은 조사만 받침에 맞게 고친다
// 볼드 뒤로 한정해 멀쩡한 문장을 깨뜨릴 위험을 줄인다. 스트리밍 미완성 볼드는 매칭 안 됨
export function fixJosa(text) {
  return text.replace(/(\*\*[^*\n]+\*\*)(으로|로|은|는|이|가|을|를|과|와)/g,
    (_, bold, josa) => bold + correctJosa(bold.slice(2, -2), josa))
}
