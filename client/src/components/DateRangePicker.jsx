import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const WEEK = ['일', '월', '화', '수', '목', '금', '토']
const YEARS_PER_PAGE = 9   // iOS 연도 선택과 같은 3x3 격자. 가로 스크롤을 쓰지 않는다

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const parse = (s) => {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 86400000)

function monthCells(year, month) {
  const first = new Date(year, month, 1)
  const cells = Array(first.getDay()).fill(null)
  const last = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= last; d++) cells.push(new Date(year, month, d))
  return cells
}

const CELL = 'w-11 h-11 inline-flex items-center justify-center rounded-full font-pretendard text-[14px] transition-colors duration-150 motion-reduce:transition-none'

/**
 * 날짜 범위 선택. 네이티브 input type=date를 쓰지 않는다.
 * minDate 이전과 maxNights 초과는 선택 자체가 막힌다.
 */
export default function DateRangePicker({
  checkIn, checkOut, onChange, minDate, maxNights = 30, label = true
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('day')      // day | month | year
  const today = startOfDay(new Date())
  const min = minDate ? startOfDay(parse(minDate)) : today
  const anchor = parse(checkIn) || min
  const [cursor, setCursor] = useState(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
  const [yearPage, setYearPage] = useState(Math.floor(anchor.getFullYear() / YEARS_PER_PAGE))
  const boxRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const ci = parse(checkIn)
  const co = parse(checkOut)

  const disabled = (d) => {
    if (d < min) return true
    if (ci && !co && d > ci && daysBetween(ci, d) > maxNights) return true
    return false
  }

  const pick = (d) => {
    if (disabled(d)) return
    if (!ci || (ci && co)) { onChange?.({ checkIn: iso(d), checkOut: '' }); return }
    if (d <= ci) { onChange?.({ checkIn: iso(d), checkOut: '' }); return }
    onChange?.({ checkIn, checkOut: iso(d) })
    setOpen(false)
  }

  const inRange = (d) => ci && co && d > ci && d < co
  const isEdge = (d) => (ci && +d === +ci) || (co && +d === +co)
  const nights = ci && co ? daysBetween(ci, co) : 0

  return (
    <div className="relative" ref={boxRef}>
      {label && (
        <span className="block font-pretendard font-medium text-[14px] text-text-pri mb-2">
          날짜 선택
        </span>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="날짜 선택 열기"
        className="w-full h-12 px-4 flex items-center justify-between gap-2
                   bg-white border border-border-def rounded-lg
                   font-pretendard font-normal text-[15px] text-text-pri
                   hover:border-primary focus-visible:border-primary
                   transition-colors duration-150 motion-reduce:transition-none">
        <span className={checkIn ? 'text-text-pri' : 'text-text-ter'}>
          {checkIn ? `${checkIn}${checkOut ? ` ~ ${checkOut}` : ''}` : '날짜를 선택하세요'}
        </span>
        <Calendar size={20} className="shrink-0 text-text-meta" />
      </button>
      {nights > 0 && (
        <p className="mt-1 font-pretendard font-light text-[12px] text-text-meta">
          {nights}박 {nights + 1}일. 최대 {maxNights}박까지 선택할 수 있다
        </p>
      )}

      {open && (
        <div className="absolute z-40 mt-2 w-[320px] max-w-[calc(100vw-40px)]
                        bg-white border border-border-def rounded-2xl p-4">
          <div className="h-11 flex items-center justify-between">
            <button type="button" aria-label="이전"
                    onClick={() => view === 'year'
                      ? setYearPage((p) => p - 1)
                      : setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full
                               hover:bg-bg-card transition-colors duration-150 motion-reduce:transition-none">
              <ChevronLeft size={20} className="text-text-pri" />
            </button>
            <button type="button"
                    onClick={() => setView(view === 'day' ? 'month' : 'day')}
                    className="px-3 h-11 inline-flex items-center rounded-lg
                               font-pretendard font-bold text-[15px] text-text-pri tracking-[-0.02em]
                               hover:bg-bg-card transition-colors duration-150 motion-reduce:transition-none">
              {view === 'year'
                ? `${yearPage * YEARS_PER_PAGE} 년대`
                : `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`}
            </button>
            <button type="button" aria-label="다음"
                    onClick={() => view === 'year'
                      ? setYearPage((p) => p + 1)
                      : setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full
                               hover:bg-bg-card transition-colors duration-150 motion-reduce:transition-none">
              <ChevronRight size={20} className="text-text-pri" />
            </button>
          </div>

          {view === 'day' && (
            <>
              <div className="mt-2 grid grid-cols-7">
                {WEEK.map((w) => (
                  <span key={w} className="h-8 inline-flex items-center justify-center
                                           font-pretendard font-medium text-[12px] text-text-meta">
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthCells(cursor.getFullYear(), cursor.getMonth()).map((d, i) => {
                  if (!d) return <span key={i} className="w-11 h-11" />
                  const off = disabled(d)
                  return (
                    <button key={i} type="button" disabled={off} onClick={() => pick(d)}
                            aria-label={iso(d)}
                            className={`${CELL} ${
                              isEdge(d) ? 'bg-primary-hover text-white font-bold'
                              : inRange(d) ? 'bg-primary-soft text-primary-hover font-medium'
                              : off ? 'text-text-ter cursor-not-allowed'
                              : 'text-text-pri font-normal hover:bg-bg-card'}`}>
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {view === 'month' && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, m) => (
                <button key={m} type="button"
                        onClick={() => { setCursor(new Date(cursor.getFullYear(), m, 1)); setView('day') }}
                        className={`h-11 rounded-lg font-pretendard text-[14px]
                                    transition-colors duration-150 motion-reduce:transition-none
                                    ${m === cursor.getMonth()
                                      ? 'bg-primary-hover text-white font-bold'
                                      : 'text-text-pri font-medium hover:bg-bg-card'}`}>
                  {m + 1}월
                </button>
              ))}
              <button type="button" onClick={() => setView('year')}
                      className="col-span-3 h-11 rounded-lg border border-border-def
                                 font-pretendard font-medium text-[14px] text-text-sec
                                 hover:border-primary transition-colors duration-150 motion-reduce:transition-none">
                연도 선택
              </button>
            </div>
          )}

          {view === 'year' && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPage * YEARS_PER_PAGE + i).map((y) => (
                <button key={y} type="button"
                        onClick={() => { setCursor(new Date(y, cursor.getMonth(), 1)); setView('month') }}
                        className={`h-11 rounded-lg font-pretendard text-[14px]
                                    transition-colors duration-150 motion-reduce:transition-none
                                    ${y === cursor.getFullYear()
                                      ? 'bg-primary-hover text-white font-bold'
                                      : 'text-text-pri font-medium hover:bg-bg-card'}`}>
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
