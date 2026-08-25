import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Bookmark, Share2, MapPin, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import staysData from '../data/stays.json'
import StayCard from '../components/card/StayCard'
import Counter from '../components/Counter'
import DateRangePicker from '../components/DateRangePicker'
import Carousel from '../components/kareum/Carousel'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import Eyebrow from '../components/Eyebrow'
import Description from '../components/Description'
import { formatPrice, STAY_TYPE_LABEL, calcNights, cleanCopy, asList } from '../lib/format'
import { useAuthStore } from '../store/useAuthStore'
import { useBookmark } from '../hooks/useBookmark'

const DISCOUNT_RATE = 0.10

// 미상 값 sentinel 은 화면에 내보내지 않는다
const clean = (v) => (v && v !== '확인 안 됨' ? v : null)

// hours 자유 문자열을 영업시간과 휴무 행으로 나눈다. 에서 표기는 물결로 바꾼다
function buildInfoRows(stay) {
  const rows = []
  if (stay.address) rows.push({ label: '주소', value: stay.address, map: true })

  const hours = clean(stay.hours)
  if (hours) {
    // 확인 안 됨과 미기재 같은 미상 조각은 표에 내보내지 않는다
    const parts = hours.split(',').map((p) => p.trim())
      .filter(Boolean)
      .filter((p) => !/확인 안 됨|미기재|미상/.test(p))
    const closed = parts.filter((p) => p.includes('휴무'))
    const open = parts.filter((p) => !p.includes('휴무'))
    if (open.length) rows.push({ label: '영업시간', value: open.join(', ').replace(/에서/g, ' ~ ') })
    if (closed.length) rows.push({ label: '휴무', value: closed.join(', ').replace(/에서/g, ' ~ ') })
  }

  // 상세 표는 price_detail(전체)을 우선한다. 카드는 price_label(대표)만 쓴다
  const price = stay.price_detail || clean(stay.price_label)
  rows.push({ label: '요금', value: price ? price.replace(/에서/g, ' ~ ') : '요금 미정' })
  return rows
}

const mapSearchUrl = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`
const mapEmbedUrl = (addr) => `https://maps.google.com/maps?q=${encodeURIComponent(addr)}&z=15&output=embed`

export default function StayDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { isBookmarked, toggle: toggleBookmark } = useBookmark('stays', id)
  const [guests, setGuests] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [modal, setModal] = useState(false)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState(null)

  const stay = staysData.find((s) => s.id === id)
  // 예약 개념은 숙박에만 있다. 먹거리 체험 볼거리는 정보 소개일 뿐이라 예약 UI가 필요 없다
  const isBookable = stay?.type === 'stay'
  if (!stay) return <Navigate to="/stays" replace />

  const similar = staysData.filter((s) => s.id !== stay.id && s.region === stay.region).slice(0, 8)
  const nights = calcNights(checkIn, checkOut)
  const basePrice = Number(stay.price_per_night) || 0
  const baseTotal = basePrice * Math.max(1, nights)
  const discountedPerNight = Math.round(basePrice * (1 - DISCOUNT_RATE))
  const discountedTotal = discountedPerNight * Math.max(1, nights)
  const isFree = basePrice === 0

  const gallery = stay.gallery || []
  const main = stay.main_image || gallery[0]
  const lightboxImages = gallery.length ? gallery : (main ? [main] : [])
  const infoRows = buildInfoRows(stay)
  const taglineItems = asList(stay.tagline)

  const onReserveClick = () => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/stays/${id}`)
      return
    }
    if (!checkIn || !checkOut || nights <= 0) {
      setError('체크인과 체크아웃 날짜를 선택하세요')
      return
    }
    setError('')
    setModal(true)
  }

  const onShare = () => {
    navigator.clipboard?.writeText(window.location.href)
  }

  const openLightbox = (idx) => setLightbox(idx)
  const closeLightbox = () => setLightbox(null)
  const goLightbox = (dir) => setLightbox((i) => (i + dir + lightboxImages.length) % lightboxImages.length)

  return (
    <div className="page-enter">
      <Helmet>
        <title>{stay.name} | 동해사이</title>
        <meta name="description" content={stay.short_description || stay.tagline} />
        <meta property="og:title" content={`${stay.name} | 동해사이`} />
        <meta property="og:description" content={stay.short_description || stay.tagline} />
        <meta property="og:image" content={stay.main_image} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      {/* Hero 풀블리드. 한 장. 화면을 다 먹지 않게 높이를 낮춘다 */}
      <div className={`relative w-full h-[38vw] min-h-[220px] max-h-[400px] overflow-hidden ${main ? 'bg-bg-card' : 'bg-primary'}`}>
        {main ? (
          <>
            <button onClick={() => openLightbox(0)} className="block w-full h-full">
              <img src={main} alt={stay.name} className="w-full h-full object-cover" />
            </button>
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src="/images/logo/logo-wordmark.svg" alt=""
              className="w-40 md:w-56 opacity-30 brightness-0 invert" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none pb-8 lg:pb-12">
          {/* 캡션 컨테이너를 본문과 동일한 container-page 로 맞춰 좌측 기준선을 완전히 일치시킨다 */}
          <div className="container-page">
            <Eyebrow tone="light">{stay.region} {STAY_TYPE_LABEL[stay.type]}</Eyebrow>
            <h1 className="mt-2 font-pretendard font-bold
                           text-[24px] md:text-[36px] lg:text-[44px] 4xl:text-[52px]
                           text-white tracking-[-0.02em] leading-tight">
              {stay.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Body grid. 히어로 바로 아래에서 2단으로 나눈다.
          요금 예약 카드가 첫 화면 안에 들어오게 하려고 사이 여백을 두지 않는다 */}
      <section className={`container-page
                          pt-5 lg:pt-6 pb-16 lg:pb-24
                          ${isBookable ? 'lg:grid lg:grid-cols-[1fr_380px] lg:gap-12' : ''}`}>
        <div className="space-y-10 lg:space-y-14">

          {/* 공유와 저장. 이름은 히어로 안에만 둔다. 중복 제거 */}
          <div className="flex items-center gap-2">
            <button onClick={onShare}
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full
                               bg-bg-mute hover:bg-border-sub
                               font-pretendard font-medium text-[14px] text-text-pri
                               transition-[background-color,scale] duration-150 ease-out
                               motion-reduce:transition-none active:scale-[0.96]">
              <Share2 size={16} className="text-text-meta" />
              공유
            </button>
            <button onClick={toggleBookmark}
              aria-label={isBookmarked ? '북마크 해제' : '저장'}
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full
                               bg-bg-mute hover:bg-border-sub
                               font-pretendard font-medium text-[14px] text-text-pri
                               transition-[background-color,scale] duration-150 ease-out
                               motion-reduce:transition-none active:scale-[0.96]">
              <Bookmark size={16} className={isBookmarked ? 'text-primary fill-primary' : 'text-text-meta'}
                fill={isBookmarked ? 'currentColor' : 'none'} />
              저장
            </button>
          </div>

          {/* 소개 */}
          <RevealOnScroll>
            {/* 태그라인이 반점 나열이면 제목으로 세우지 않고 항목으로 편다 */}
            <h3 className="font-pretendard font-bold text-[22px] md:text-[26px] lg:text-[30px] text-text-pri leading-tight">
              {taglineItems ? '한눈에 보기' : cleanCopy(stay.tagline)}
            </h3>
            {taglineItems && <Description text={stay.tagline} className="mt-4" />}
            <Description text={stay.long_description} size="lg" className="mt-4" />

            {gallery.length > 1 && (
              <div className="mt-8 grid gap-3 md:gap-4 grid-cols-2">
                {gallery.slice(1, 5).map((src, i) => (
                  <button key={i} onClick={() => openLightbox(i + 1)}
                    className="aspect-[4/3] overflow-hidden rounded-xl shadow-card bg-bg-card block">
                    <img src={src} alt={`${stay.name} 갤러리 ${i + 2}`}
                      className="w-full h-full object-cover
                                    transition-transform duration-[600ms] ease-out
                                    motion-reduce:transition-none hover:scale-[1.04]" />
                  </button>
                ))}
              </div>
            )}
          </RevealOnScroll>

          {/* 주요 특징 */}
          {stay.highlights?.length > 0 && (
            <RevealOnScroll>
              <h3 className="font-pretendard font-bold text-[18px] md:text-[20px] text-text-pri tracking-[-0.02em] mb-4">
                주요 특징
              </h3>
              <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
                {stay.highlights.map((h, i) => (
                  <div key={i} className="bg-white shadow-depth rounded-2xl p-5">
                    <p className="font-pretendard font-bold text-[15px] text-text-pri">
                      {h.title}
                    </p>
                    {h.description && <Description text={h.description} className="mt-2" />}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* 위치 및 정보 */}
          <RevealOnScroll>
            <h3 className="font-pretendard font-bold text-[18px] md:text-[20px] text-text-pri tracking-[-0.02em] mb-4">
              위치 및 정보
            </h3>

            {/* 정보 표. 회색 테두리 없이 배경 톤과 행 구분선 */}
            <dl className="rounded-2xl bg-bg-card overflow-hidden">
              {infoRows.map((r, i) => (
                <div key={r.label}
                  className={`flex gap-4 px-5 py-4 ${i > 0 ? 'border-t border-border-sub' : ''}`}>
                  <dt className="w-16 md:w-20 shrink-0 font-pretendard font-medium text-[13px] md:text-[14px] text-text-meta">
                    {r.label}
                  </dt>
                  <dd className="flex-1 font-pretendard font-normal text-[13px] md:text-[14px] text-text-pri leading-relaxed">
                    {r.map ? (
                      <a href={mapSearchUrl(r.value)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-primary transition-colors duration-150">
                        <MapPin size={14} className="shrink-0 text-text-meta" />
                        {r.value}
                      </a>
                    ) : r.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* 구글맵. 주소 없으면 지도 블록 자체를 숨긴다 */}
            {stay.address && (
              <>
                <div className="mt-4 aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-card bg-bg-card">
                  <iframe
                    title={`${stay.name} 지도`}
                    src={mapEmbedUrl(stay.address)}
                    loading="lazy"
                    className="w-full h-full border-0"
                    referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <a href={mapSearchUrl(stay.address)} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-pretendard font-medium text-[13px] text-primary hover:text-primary-hover transition-colors duration-150">
                  <MapPin size={14} />
                  구글맵에서 열기
                </a>
              </>
            )}

            {stay.nearby?.length > 0 && (
              <div className="mt-8">
                <h4 className="font-pretendard font-bold text-[16px] text-text-pri mb-3">주변 명소</h4>
                <Carousel label="주변 명소"
                  className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 pb-2"
                  itemClassName="w-[60%] sm:w-[42%] md:w-[30%]">
                  {stay.nearby.map((n, i) => (
                    <div key={i} className="shadow-card rounded-xl p-4 h-full">
                      <p className="font-pretendard font-bold text-[14px] text-text-pri line-clamp-1">{n.name}</p>
                      <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">{n.distance}</p>
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </RevealOnScroll>

          {/* 추천 장소 */}
          {similar.length > 0 && (
            <RevealOnScroll>
              <h3 className="font-pretendard font-bold text-[20px] md:text-[22px] lg:text-[24px] text-text-pri tracking-[-0.02em] mb-4">
                추천 장소
              </h3>
              <Carousel label="추천 장소"
                className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 pb-2"
                itemClassName="w-[80%] sm:w-[60%] md:w-[46%] lg:w-[38%]">
                {similar.map((s) => <StayCard key={s.id} {...s} />)}
              </Carousel>
            </RevealOnScroll>
          )}
        </div>

        {/* 요금 예약 카드. 헤더(80px) 아래에 붙어 첫 화면부터 따라다닌다 */}
        {/* 요금 예약 카드. 숙박에만 있다. 먹거리 체험 볼거리는 정보 표만으로 충분하다 */}
        {isBookable && (
          <aside className="mt-10 lg:mt-0 lg:sticky lg:top-[92px] h-fit
                          shadow-depth rounded-[32px] p-5 bg-white">
            {!isFree ? (
              <>
                <Eyebrow>쿠폰 적용 할인가</Eyebrow>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-pretendard font-bold text-[15px] text-primary tabular-nums">
                    {Math.round(DISCOUNT_RATE * 100)}%
                  </span>
                  <span className="font-pretendard font-medium text-[14px] text-text-meta line-through tabular-nums">
                    {basePrice.toLocaleString()}원
                  </span>
                </div>
                <p className="mt-1 font-pretendard font-bold text-[28px] text-text-pri tabular-nums">
                  {discountedPerNight.toLocaleString()}<span className="ml-1 text-[15px] font-semibold text-text-sec">원/박</span>
                </p>
              </>
            ) : (
              <>
                <Eyebrow>이용 요금</Eyebrow>
                <p className="mt-2 font-pretendard font-bold text-[24px] text-text-pri">
                  {clean(stay.price_label) || '요금 미정'}
                </p>
              </>
            )}

            <div className="mt-5">
              <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                maxNights={14}
                onChange={({ checkIn: a, checkOut: b }) => { setCheckIn(a); setCheckOut(b) }} />
            </div>
            <div className="mt-4">
              <span className="block font-pretendard font-medium text-[14px] text-text-pri mb-2">
                인원
              </span>
              <Counter count={guests} onChange={setGuests} min={1} max={stay.max_guests || 6} />
            </div>

            {!isFree && nights > 0 && (
              <div className="mt-5 pt-5 border-t border-border-sub space-y-2 font-pretendard text-[14px]">
                <div className="flex justify-between gap-3">
                  <span className="font-normal text-text-meta">객실 요금 ({nights}박 × {discountedPerNight.toLocaleString()}원)</span>
                  <span className="font-medium text-text-pri tabular-nums">{discountedTotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between gap-3 text-text-meta line-through">
                  <span className="font-normal">정가</span>
                  <span className="font-medium tabular-nums">{baseTotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between gap-3 pt-2 border-t border-border-sub font-bold text-text-pri text-[16px]">
                  <span>총액</span>
                  <span className="tabular-nums">{formatPrice(discountedTotal)}</span>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-3 font-pretendard font-medium text-[13px] text-accent">
                {error}
              </p>
            )}

            <button
              onClick={onReserveClick}
              disabled={nights <= 0}
              className="mt-6 w-full h-12 lg:h-14 px-6
                       bg-text-pri text-white
                       font-pretendard font-bold text-[16px]
                       rounded-lg
                       hover:bg-black
                       transition-[background-color,scale] duration-150 ease-out
                       motion-reduce:transition-none
                       enabled:active:scale-[0.96]
                       disabled:opacity-40 disabled:cursor-not-allowed">
              {nights > 0 ? '예약하기' : '날짜를 선택하세요'}
            </button>
          </aside>
        )}
      </section>

      {/* Lightbox */}
      {lightbox !== null && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
          <button aria-label="닫기" onClick={closeLightbox}
            className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                             inline-flex items-center justify-center transition-colors duration-150">
            <X size={22} className="text-white" />
          </button>
          {lightboxImages.length > 1 && (
            <>
              <button aria-label="이전" onClick={() => goLightbox(-1)}
                className="absolute left-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                                 inline-flex items-center justify-center transition-colors duration-150">
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button aria-label="다음" onClick={() => goLightbox(1)}
                className="absolute right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                                 inline-flex items-center justify-center transition-colors duration-150">
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}
          <img src={lightboxImages[lightbox]} alt={stay.name} className="max-w-[90vw] max-h-[85vh] object-contain" />
          <div className="absolute bottom-5 font-pretendard font-medium text-[14px] text-white">
            {lightbox + 1} / {lightboxImages.length}
          </div>
        </div>
      )}

      {/* Reservation modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
          onClick={() => setModal(false)}>
          <div className="w-full max-w-[460px] bg-white rounded-2xl p-6 lg:p-8"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-pretendard font-bold text-[20px] lg:text-[22px] text-text-pri tracking-[-0.02em]">
                예약 확인
              </h3>
              <button aria-label="닫기" onClick={() => setModal(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-bg-card">
                <X size={18} />
              </button>
            </div>

            <dl className="mt-6 space-y-3 font-pretendard text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-text-meta">장소</dt>
                <dd className="font-bold text-text-pri text-right">{stay.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-text-meta">체크인</dt>
                <dd className="font-medium text-text-pri">{checkIn}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-text-meta">체크아웃</dt>
                <dd className="font-medium text-text-pri">{checkOut}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-text-meta">인원</dt>
                <dd className="font-medium text-text-pri">{guests}명</dd>
              </div>
              <div className="flex justify-between gap-4 pt-3 border-t border-border-sub">
                <dt className="font-medium text-text-pri">총 금액 ({nights}박)</dt>
                <dd className="font-bold text-[18px] text-primary">{formatPrice(discountedTotal)}</dd>
              </div>
            </dl>

            {error && (
              <p className="mt-4 font-pretendard font-medium text-[13px] text-accent">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button onClick={() => setModal(false)}
                className="flex-1 h-12 px-5
                                 bg-white text-text-pri border border-border-def
                                 font-pretendard font-medium text-[15px]
                                 rounded-lg hover:border-text-pri transition-colors duration-150">
                취소
              </button>
              <button
                onClick={() => {
                  setModal(false)
                  navigate(`/checkout?type=stay&id=${stay.id}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}&price=${discountedTotal}`)
                }}
                className="flex-1 h-12 px-5
                           bg-text-pri text-white
                           font-pretendard font-medium text-[15px]
                           rounded-lg hover:bg-black transition-colors duration-150">
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
