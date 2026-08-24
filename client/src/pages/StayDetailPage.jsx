import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Clock, Bookmark, Share2, MapPin, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import staysData from '../data/stays.json'
import StayCard from '../components/card/StayCard'
import Counter from '../components/Counter'
import DateRangePicker from '../components/DateRangePicker'
import Carousel from '../components/kareum/Carousel'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import ScatterIllust from '../components/kareum/ScatterIllust'
import { formatPrice, STAY_TYPE_LABEL, calcNights } from '../lib/format'
import { useAuthStore } from '../store/useAuthStore'
import { useBookmark } from '../hooks/useBookmark'

const TABS = [
  { key: 'about', label: '소개' },
  { key: 'location', label: '위치 및 정보' }
]

const DISCOUNT_RATE = 0.10

export default function StayDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { isBookmarked, toggle: toggleBookmark } = useBookmark('stays', id)
  const [tab, setTab] = useState('about')
  const [guests, setGuests] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [modal, setModal] = useState(false)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState(null)

  const stay = staysData.find((s) => s.id === id)
  if (!stay) return <Navigate to="/stays" replace />

  const similar = staysData.filter((s) => s.id !== stay.id && s.region === stay.region).slice(0, 4)
  const nights = calcNights(checkIn, checkOut)
  const basePrice = Number(stay.price_per_night) || 0
  const baseTotal = basePrice * Math.max(1, nights)
  const discountedPerNight = Math.round(basePrice * (1 - DISCOUNT_RATE))
  const discountedTotal = discountedPerNight * Math.max(1, nights)
  const isFree = basePrice === 0

  const gallery = stay.gallery || []
  const main = stay.main_image || gallery[0]
  const lightboxImages = gallery.length ? gallery : (main ? [main] : [])

  const onReserveClick = () => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/stays/${id}`)
      return
    }
    if (!checkIn || !checkOut || nights <= 0) {
      setError('체크인과 체크아웃 날짜를 선택해라')
      return
    }
    setError('')
    setModal(true)
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
      </Helmet>
      {/* Hero 풀블리드. 한 장. 슬라이더 아님. 하단에 카피와 이름 */}
      <div className="relative w-full h-[50vw] min-h-[280px] max-h-[560px] overflow-hidden bg-bg-card">
        {main && (
          <button onClick={() => openLightbox(0)} className="block w-full h-full">
            <img src={main} alt={stay.name} className="w-full h-full object-cover" />
          </button>
        )}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none
                        px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24 pb-8 lg:pb-12">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <p className="font-pretendard font-medium text-[13px] md:text-[15px] text-white/80 tracking-[0.04em]">
              {stay.region} {STAY_TYPE_LABEL[stay.type]}
            </p>
            <h1 className="mt-2 font-pretendard font-bold
                           text-[24px] md:text-[36px] lg:text-[44px] 4xl:text-[52px]
                           text-white tracking-[-0.02em] leading-tight">
              {stay.name}
            </h1>
          </div>
        </div>
      </div>

      {/* 이름 타이포 포인트. 카름 마을 상세 손글씨 로고 자리. 문어 슬롯은 애셋 도착 전까지 빈다 */}
      <section className="relative mx-auto w-full
                          px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                          max-w-[1400px] 2xl:max-w-[1600px]
                          pt-10 lg:pt-14">
        <ScatterIllust items={[]} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-pretendard font-bold
                           text-[32px] md:text-[44px] lg:text-[56px]
                           text-text-pri tracking-[-0.03em] leading-[1.05]">
              {stay.name}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-pretendard text-[13px] md:text-[14px] text-text-sec">
              {stay.hours && stay.hours !== '확인 안 됨' && (
                <span className="inline-flex items-center gap-1 font-medium">
                  <Clock size={14} className="text-text-meta" />
                  {stay.hours}
                </span>
              )}
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin size={14} className="text-text-meta" />
                {stay.address}
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button aria-label="공유"
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-bg-card border border-border-sub">
              <Share2 size={18} className="text-text-pri" />
            </button>
            <button aria-label={isBookmarked ? '북마크 해제' : '저장'}
                    onClick={toggleBookmark}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-bg-card border border-border-sub">
              <Bookmark size={18} className={isBookmarked ? 'text-primary fill-primary' : 'text-text-pri'} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </section>

      {/* Body grid */}
      <section className="mx-auto w-full
                          px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                          max-w-[1400px] 2xl:max-w-[1600px]
                          mt-10 lg:mt-12 pb-16 lg:pb-24
                          lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
        <div>
          {/* 근거 표기. 확정 제휴처가 아니라 연계 후보임을 명시한다 */}
          <div className="pb-6 border-b border-border-sub">
            <p className="font-pretendard font-medium text-[14px] text-text-pri">
              확정 제휴처가 아니라 연계 후보다
            </p>
            <p className="mt-1 font-pretendard font-light text-[13px] text-text-meta">
              방문 전 영업일과 휴무를 확인해라. 자료 출처 {stay.source || '확인 안 됨'}
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-6 sticky top-[80px] bg-white z-10">
            <div className="flex gap-1 border-b border-border-sub overflow-x-auto scrollbar-hide -mx-5 px-5">
              {TABS.map((t) => (
                <button key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-3 font-pretendard font-medium text-[14px] tracking-[0.02em]
                                    border-b-2 transition-colors duration-150 whitespace-nowrap
                                    ${tab === t.key
                                      ? 'text-text-pri border-text-pri'
                                      : 'text-text-meta border-transparent hover:text-text-pri'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* About */}
          {tab === 'about' && (
            <div className="mt-8 space-y-10">
              <RevealOnScroll>
                <h2 className="font-pretendard font-bold text-[22px] md:text-[26px] lg:text-[30px] text-text-pri tracking-[-0.02em] leading-tight">
                  {stay.tagline}
                </h2>
                <p className="mt-4 font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec leading-relaxed tracking-[-0.01em]">
                  {stay.long_description}
                </p>
              </RevealOnScroll>

              {gallery.length > 1 && (
                <div className="grid gap-3 md:gap-4 grid-cols-2">
                  {gallery.slice(1, 5).map((src, i) => (
                    <button key={i} onClick={() => openLightbox(i + 1)}
                            className="aspect-[4/3] overflow-hidden rounded-xl bg-bg-card block">
                      <img src={src} alt={`${stay.name} 갤러리 ${i + 2}`}
                           className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.04]" />
                    </button>
                  ))}
                </div>
              )}

              {stay.highlights?.length > 0 && (
                <RevealOnScroll>
                  <h3 className="font-pretendard font-bold text-[18px] md:text-[20px] text-text-pri tracking-[-0.02em] mb-4">
                    주요 특징
                  </h3>
                  <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
                    {stay.highlights.map((h, i) => (
                      <div key={i} className="border border-border-sub rounded-2xl p-5">
                        <p className="font-pretendard font-bold text-[15px] text-text-pri tracking-[-0.02em]">
                          {h.title}
                        </p>
                        <p className="mt-2 font-pretendard font-normal text-[13px] text-text-sec leading-relaxed">
                          {h.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>
              )}
            </div>
          )}

          {/* Amenities */}

          {/* Reviews */}

          {/* Location */}
          {tab === 'location' && (
            <RevealOnScroll className="mt-8 space-y-6">
              <div>
                <h3 className="font-pretendard font-bold text-[18px] md:text-[20px] text-text-pri tracking-[-0.02em] mb-3">
                  위치
                </h3>
                <p className="font-pretendard font-medium text-[14px] text-text-sec">{stay.address}</p>
              </div>
              <div className="aspect-[16/9] w-full rounded-2xl bg-bg-mute overflow-hidden
                              flex items-center justify-center border border-border-sub">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto text-text-meta" />
                  <p className="mt-3 font-pretendard font-medium text-[14px] text-text-meta">
                    지도 영역 (네이버 지도 연동 예정)
                  </p>
                  <p className="mt-1 font-pretendard font-light text-[12px] text-text-meta">
                    {stay.address}
                  </p>
                </div>
              </div>
              {stay.nearby?.length > 0 && (
                <div>
                  <h4 className="font-pretendard font-bold text-[16px] text-text-pri mb-3">주변 명소</h4>
                  <Carousel label="주변 명소"
                            className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 pb-2"
                            itemClassName="w-[60%] sm:w-[42%] md:w-[30%]">
                    {stay.nearby.map((n, i) => (
                      <div key={i} className="border border-border-sub rounded-xl p-4 h-full">
                        <p className="font-pretendard font-bold text-[14px] text-text-pri">{n.name}</p>
                        <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">{n.distance}</p>
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
            </RevealOnScroll>
          )}

          {/* Similar */}
          {similar.length > 0 && (
            <RevealOnScroll>
            <section className="mt-16">
              <h2 className="font-pretendard font-bold text-[20px] md:text-[22px] lg:text-[24px] text-text-pri tracking-[-0.02em] mb-4">
                비슷한 곳
              </h2>
              <Carousel label="비슷한 곳"
                        className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 pb-2"
                        itemClassName="w-[80%] sm:w-[60%] md:w-[46%] lg:w-[38%]">
                {similar.map((s) => <StayCard key={s.id} {...s} />)}
              </Carousel>
            </section>
            </RevealOnScroll>
          )}
        </div>

        {/* Reservation card */}
        <aside className="mt-8 lg:mt-0 lg:sticky lg:top-24 h-fit
                          border border-border-sub rounded-2xl p-5 lg:p-6 bg-white">
          {!isFree ? (
            <>
              <p className="font-pretendard font-medium text-[12px] text-primary tracking-[0.04em] uppercase">
                쿠폰 적용 할인가
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-pretendard font-bold text-[14px] text-primary">
                  {Math.round(DISCOUNT_RATE * 100)}%
                </span>
                <span className="font-pretendard font-light text-[14px] text-text-meta line-through">
                  {basePrice.toLocaleString()}원
                </span>
              </div>
              <p className="mt-1 font-pretendard font-bold text-[26px] text-text-pri">
                {discountedPerNight.toLocaleString()}<span className="ml-1 text-[14px] font-medium text-text-meta">원/박</span>
              </p>
            </>
          ) : (
            <>
              <p className="font-pretendard font-medium text-[12px] text-primary tracking-[0.04em] uppercase">
                이용 요금
              </p>
              <p className="mt-1 font-pretendard font-bold text-[24px] text-text-pri">
                {stay.price_label && stay.price_label !== '확인 안 됨' ? stay.price_label : '확인 안 됨'}
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
              <div className="flex justify-between text-text-sec">
                <span>객실 요금 ({nights}박 × {discountedPerNight.toLocaleString()}원)</span>
                <span>{discountedTotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-text-meta line-through">
                <span>정가</span>
                <span>{baseTotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border-sub font-bold text-text-pri text-[15px]">
                <span>총액</span>
                <span>{formatPrice(discountedTotal)}</span>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 font-pretendard font-medium text-[13px] text-[#DC2626]">
              {error}
            </p>
          )}

          <button
            onClick={onReserveClick}
            disabled={nights <= 0}
            className="mt-6 w-full h-12 lg:h-14 px-6
                       bg-text-pri text-white
                       font-pretendard font-medium text-[16px]
                       rounded-lg
                       hover:bg-black
                       transition-colors duration-150 motion-reduce:transition-none
                       disabled:opacity-40 disabled:cursor-not-allowed">
            예약하기
          </button>
        </aside>
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
                <dt className="font-medium text-text-meta">거점</dt>
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
              <p className="mt-4 font-pretendard font-medium text-[13px] text-[#DC2626]">
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
