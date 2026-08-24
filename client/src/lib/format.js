import { format as dateFormat, parseISO, differenceInCalendarDays } from 'date-fns'

export const formatPrice = (won) => `${Number(won).toLocaleString()}원`

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
