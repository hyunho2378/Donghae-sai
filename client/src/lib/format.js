import { format as dateFormat, parseISO, differenceInCalendarDays } from 'date-fns'

export const formatPrice = (won) => `${Number(won).toLocaleString()}원`

// 카드용 대표 요금 한 줄. 여러 항목이면 첫 요금 + 부터. 전체는 상세 표에만 노출
// 천 단위 콤마(3,000)는 유지하고 항목 구분자(콤마+공백, 마침표+공백, 별도)로만 자른다
export const shortPrice = (label) => {
  if (!label || label === '확인 안 됨') return null
  const t = label.trim()
  const parts = t.split(/,\s|\.\s|\s*별도/).map((s) => s.trim()).filter(Boolean)
  if (parts.length <= 1) return t.replace(/\.$/, '')
  return `${parts[0]} 부터`
}

// 원문 설명 끝에 남은 말줄임과 매달린 반점을 걷어낸다
export const cleanCopy = (t) => (t || '').replace(/[,\s·]*(\.{2,}|…)\s*$/, '').replace(/\s*,\s*$/, '').trim()

// 반점으로만 이어 붙인 명사 나열이면 읽는 문장이 아니라 항목으로 끊어 준다.
// 천 단위 구분 반점(1,400)은 자르지 않는다. 문장이 섞여 있으면 그대로 읽게 둔다
export const asList = (t) => {
  const s = cleanCopy(t)
  if (!s) return null
  const parts = s.split(/,(?!\d)/).map((x) => x.trim()).filter(Boolean)
  if (parts.length < 3) return null
  if (parts.some((p) => p.length > 20 || /[.!?]$/.test(p))) return null
  return parts
}

// 데이터 원문이 마침표 없이 잘린 경우 문장을 자연스럽게 맺는다
export const endSentence = (t) => {
  const s = cleanCopy(t)
  if (!s) return s
  return /[.。!?…”"’)]$/.test(s) ? s : `${s}.`
}

export const formatPricePerNight = (won) => {
  const n = Number(won)
  if (!n || n <= 0) return '패키지 포함'
  return `1박 ${n.toLocaleString()}원`
}

export const formatPricePerPerson = (won) => `1인 ${Number(won).toLocaleString()}원`

export const formatDate = (iso) => {
  if (!iso) return ''
  const d = typeof iso === 'string' ? parseISO(iso) : iso
  return dateFormat(d, 'yyyy.MM.dd')
}

export const formatDateLong = (iso) => {
  if (!iso) return ''
  const d = typeof iso === 'string' ? parseISO(iso) : iso
  return dateFormat(d, 'yyyy년 MM월 dd일')
}

export const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const ci = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
  const co = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut
  return Math.max(0, differenceInCalendarDays(co, ci))
}

// 동해사이 패스 스탬프 7종. 5권역 + 별빛 + 완주. 패스가격설계_0824.md의 스탬프 적립과 완주 보상 구조
export const STAMPS = [
  { id: 'chuam', label: '추암', kind: 'region', note: '추암 권역에서 NFC 태그' },
  { id: 'muleung', label: '무릉', kind: 'region', note: '무릉 권역에서 NFC 태그' },
  { id: 'cheongok', label: '천곡', kind: 'region', note: '천곡 권역에서 NFC 태그' },
  { id: 'mukho', label: '묵호', kind: 'region', note: '묵호 권역에서 NFC 태그' },
  { id: 'mangsang', label: '망상', kind: 'region', note: '망상 권역에서 NFC 태그' },
  { id: 'starlight', label: '별빛', kind: 'starlight', note: '별빛 콘텐츠 이용 시 적립' },
  { id: 'complete', label: '완주', kind: 'complete', note: '앞의 여섯 개를 모두 모으면 적립' }
]

export const ROLE_LABEL = {
  walk2030: '2030 뚜벅이',
  car2030: '2030 자차',
  walk4050: '4050 뚜벅이',
  car4050: '4050 자차'
}

export const STAY_TYPE_LABEL = {
  eat: '먹거리',
  stay: '숙박',
  play: '체험',
  see: '볼거리'
}

export const PERSONA_LABEL = {
  '2030': '2030',
  '4050': '4050'
}

export const JOURNAL_CATEGORY_LABEL = {
  travel: 'TRAVEL',
  magazine: 'MAGAZINE',
  pick: 'PICK'
}

export const GOODS_CATEGORY_LABEL = {
  nfc_album: 'NFC 앨범',
  curation_box: '계절 큐레이션 박스',
  produce: '농산물',
  processed: '가공식품'
}
