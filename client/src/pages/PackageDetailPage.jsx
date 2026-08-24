import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { X, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import packagesData from '../data/packages.json'
import PackageCard from '../components/card/PackageCard'
import Carousel from '../components/kareum/Carousel'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import ScatterIllust from '../components/kareum/ScatterIllust'

const TABS = [
  { key: 'itinerary', label: '일정' }
]

export default function PackageDetailPage() {
  const { id } = useParams()

  const [tab, setTab] = useState('itinerary')
  const [lightbox, setLightbox] = useState(null)

  const pkg = packagesData.find((p) => p.id === id)
  if (!pkg) return <Navigate to="/packages" replace />

  const isProgram = pkg.category === 'program'
  const kindLabel = isProgram ? '프로그램' : '코스'
  const similar = packagesData
    .filter((p) => p.id !== pkg.id && p.category === pkg.category
                   && p.target_persona?.[0] === pkg.target_persona?.[0])
    .slice(0, 3)

  const gallery = pkg.gallery?.length ? pkg.gallery : (pkg.main_image ? [pkg.main_image] : [])
  const heroImage = pkg.main_image || gallery[0]
  const galleryGrid = gallery.slice(0, 6)

  return (
    <div className="page-enter">
      <Helmet>
        <title>{pkg.name} | 동해사이</title>
        <meta name="description" content={pkg.short_description || pkg.tagline} />
        <meta property="og:title" content={`${pkg.name} | 동해사이`} />
        <meta property="og:description" content={pkg.short_description || pkg.tagline} />
        <meta property="og:image" content={pkg.main_image} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      {/* Hero 풀와이드 */}
      <div className="relative w-full h-[50vw] min-h-[280px] max-h-[560px] overflow-hidden bg-bg-card">
        {heroImage && (
          <img src={heroImage} alt={pkg.name}
               className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute bottom-0 left-0 right-0
                        px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24 pb-8 lg:pb-12">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            {pkg.badges?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {pkg.badges.slice(0, 2).map((b) => (
                  <span key={b}
                        className="h-[26px] px-2.5 bg-primary-soft text-primary
                                   font-pretendard font-medium text-[12px]
                                   rounded-md inline-flex items-center">
                    {b}
                  </span>
                ))}
              </div>
            )}
            {pkg.tagline && (
              <p className="font-pretendard font-medium text-[13px] md:text-[15px] text-white/80 tracking-[0.04em]">
                {pkg.tagline}
              </p>
            )}
            <h1 className="mt-2 font-pretendard font-bold
                           text-[24px] md:text-[36px] lg:text-[44px] 4xl:text-[52px]
                           text-white tracking-[-0.02em] leading-tight">
              {pkg.name}
            </h1>
          </div>
        </div>
      </div>

      {/* 대상명 타이포 포인트. 카름 마을 상세 손글씨 로고 자리. 문어 슬롯은 애셋 도착 전까지 빈다 */}
      <section className="relative mx-auto w-full
                          px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                          max-w-[1400px] 2xl:max-w-[1600px]
                          pt-10 lg:pt-14">
        <ScatterIllust items={[]} />
        <p className="font-pretendard font-medium text-[13px] tracking-[0.06em] text-primary">
          {kindLabel}
        </p>
        <h2 className="mt-2 font-pretendard font-bold
                       text-[32px] md:text-[44px] lg:text-[56px]
                       text-text-pri tracking-[-0.03em] leading-[1.05]">
          {pkg.name}
        </h2>
      </section>

      {/* Body */}
      <div className="mx-auto w-full
                      px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                      max-w-[1400px] 2xl:max-w-[1600px]
                      mt-8 lg:mt-10 pb-16 lg:pb-24
                      lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">

        {/* Left column */}
        <div>

          {/* 1. Overview grid */}
          <RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: '기간', value: pkg.duration_label },
              { label: '타깃', value: pkg.target_persona?.[0] || '미정' },
              isProgram
                ? { label: '권역', value: pkg.region || '미정' }
                : { label: '이동수단', value: pkg.transport || '미정' },
              { label: '방문지', value: `${pkg.itinerary.reduce((n, d) => n + d.schedule.length, 0)}곳` }
            ].map((item) => (
              <div key={item.label} className="shadow-card rounded-xl p-4 md:p-5">
                <p className="font-pretendard font-medium text-[12px] text-text-meta tracking-[0.04em] uppercase">
                  {item.label}
                </p>
                <p className="mt-2 font-pretendard font-bold text-[16px] md:text-[18px] text-text-pri">
                  {item.value}
                  {item.sub && (
                    <span className="ml-1 font-medium text-[12px] text-text-meta">{item.sub}</span>
                  )}
                </p>
              </div>
            ))}
          </div>
          </RevealOnScroll>

          {/* 2. Host message */}
          {pkg.host_message && (
            <RevealOnScroll>
            <div className="mt-8 bg-bg-card rounded-2xl p-6 lg:p-8">
              <Quote size={24} className="text-primary mb-3" />
              <p className="font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec leading-relaxed tracking-[-0.01em]">
                {pkg.host_message}
              </p>
            </div>
            </RevealOnScroll>
          )}

          {/* 3. Sticky tabs */}
          <div className="mt-10 sticky top-[80px] bg-page z-10">
            <div className="flex gap-1 border-b border-border-sub overflow-x-auto scrollbar-hide -mx-5 px-5">
              {TABS.map((t) => (
                <button key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-3 font-pretendard font-semibold text-[15px] tracking-[0.02em]
                                    border-b-2 transition-colors duration-150 whitespace-nowrap
                                    ${tab === t.key
                                      ? 'text-accent border-accent'
                                      : 'text-text-meta border-transparent hover:text-text-pri'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Itinerary */}
          {tab === 'itinerary' && (
            <div className="mt-8 space-y-12">
              {pkg.itinerary?.map((day) => (
                <RevealOnScroll key={day.day}>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="font-pretendard font-bold
                                     text-[44px] md:text-[56px]
                                     text-text-pri tracking-[-0.03em] leading-none">
                      DAY {day.day}
                    </span>
                    <span className="font-pretendard font-medium text-[14px] md:text-[15px] text-text-meta leading-tight">
                      {day.title}
                    </span>
                  </div>
                  <div>
                    {day.schedule?.map((item, i) => (
                      <div key={i} className="flex gap-4 md:gap-6">
                        <div className="flex flex-col items-center pt-[6px]">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          {i < day.schedule.length - 1 && (
                            <div className="w-px flex-1 bg-border-sub mt-1 min-h-[28px]" />
                          )}
                        </div>
                        <div className="pb-5 min-w-0">
                          <span className="font-pretendard font-medium text-[13px] text-primary">
                            {item.time}
                          </span>
                          <p className="mt-0.5 font-pretendard font-normal text-[15px] text-text-sec leading-relaxed">
                            {item.activity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>
              ))}

              {/* 프로그램 전용. 원본의 후보군을 그대로 노출한다 */}
              {isProgram && (
                <div className="space-y-8">
                  {[
                    { title: '식사 후보', items: pkg.meal_options },
                    { title: '아침과 다음 날 식사 후보', items: pkg.breakfast_options },
                    { title: '숙소 후보', items: pkg.stay_options }
                  ].filter((g) => g.items?.length > 0).map((g) => (
                    <div key={g.title}>
                      <h3 className="font-pretendard font-bold text-[17px] md:text-[18px]
                                     text-text-pri tracking-[-0.02em] mb-4">
                        {g.title}
                      </h3>
                      <ul className="grid gap-3 md:grid-cols-3">
                        {g.items.map((o) => (
                          <li key={o.name} className="shadow-card rounded-xl p-4">
                            <p className="font-pretendard font-bold text-[15px] text-text-strong">
                              {o.name}
                            </p>
                            <p className="mt-1.5 font-pretendard font-normal text-[13px] text-text-sec leading-relaxed">
                              {o.note || '미정'}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {pkg.signature_experience && (
                    <div className="border border-primary rounded-2xl p-6 lg:p-8 bg-primary-soft">
                      <p className="font-pretendard font-medium text-[12px] text-primary-hover tracking-[0.04em]">
                        새로 기획할 핵심 체험
                      </p>
                      <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px]
                                    text-text-sec leading-relaxed tracking-[-0.01em]">
                        {pkg.signature_experience}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Gallery 3×2 */}
              {galleryGrid.length > 0 && (
                <div>
                  <h3 className="font-pretendard font-bold text-[17px] md:text-[18px]
                                 text-text-pri tracking-[-0.02em] mb-4">
                    {kindLabel} 사진
                  </h3>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {galleryGrid.map((src, i) => (
                      <button key={i} onClick={() => setLightbox(i)}
                              className="aspect-[4/3] overflow-hidden rounded-xl bg-bg-card block">
                        <img src={src} alt={`${pkg.name} ${i + 1}`}
                             className="w-full h-full object-cover
                                        transition-transform duration-[600ms] ease-out
                                        hover:scale-[1.04]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 비슷한 코스 */}
          {similar.length > 0 && (
            <RevealOnScroll>
            <section className="mt-16">
              <h2 className="font-pretendard font-bold
                             text-[20px] md:text-[22px] lg:text-[24px]
                             text-text-pri tracking-[-0.02em] mb-4">
                비슷한 {kindLabel}
              </h2>
              <Carousel label={`비슷한 ${kindLabel}`}
                        className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 pb-2"
                        itemClassName="w-[80%] sm:w-[60%] md:w-[46%] lg:w-[32%]">
                {similar.map((p) => <PackageCard key={p.id} {...p} />)}
              </Carousel>
            </section>
            </RevealOnScroll>
          )}
        </div>

        {/* 코스는 판매 상품이 아니다. 패스 안내로 연결한다 */}
        <aside className="mt-8 lg:mt-0 lg:sticky lg:top-24 h-fit
                          shadow-card rounded-2xl p-5 lg:p-6 bg-white">
          <p className="font-pretendard font-bold text-[18px] text-text-pri tracking-[-0.02em]">
            동해사이 패스로 이 {isProgram ? '프로그램을' : '코스를'} 즐긴다
          </p>
          <p className="mt-2 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed">
            {kindLabel} 안의 상점과 체험에서 패스 할인을 적용한다. 1일권 5,000원, 2일권 8,000원, 3일권 10,000원이다.
          </p>
          <Link to="/membership"
                className="mt-5 w-full h-12 inline-flex items-center justify-center
                           bg-primary-hover text-white rounded-lg
                           font-pretendard font-medium text-[15px]
                           hover:bg-primary transition-colors duration-150">
            패스 보기
          </Link>
          <p className="mt-3 font-pretendard font-light text-[12px] text-text-meta">
            {kindLabel}에 등장하는 장소는 방문 전 영업일과 휴무를 확인한다
          </p>
        </aside>
      </div>

      {/* Lightbox */}
      {lightbox !== null && galleryGrid.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
          <button aria-label="닫기" onClick={() => setLightbox(null)}
                  className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                             inline-flex items-center justify-center transition-colors duration-150">
            <X size={22} className="text-white" />
          </button>
          {galleryGrid.length > 1 && (
            <>
              <button aria-label="이전"
                      onClick={() => setLightbox((i) => (i - 1 + galleryGrid.length) % galleryGrid.length)}
                      className="absolute left-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                                 inline-flex items-center justify-center transition-colors duration-150">
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button aria-label="다음"
                      onClick={() => setLightbox((i) => (i + 1) % galleryGrid.length)}
                      className="absolute right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                                 inline-flex items-center justify-center transition-colors duration-150">
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}
          <img src={galleryGrid[lightbox]} alt={`${pkg.name} ${lightbox + 1}`}
               className="max-w-[90vw] max-h-[85vh] object-contain" />
          <div className="absolute bottom-5 font-pretendard font-medium text-[14px] text-white">
            {lightbox + 1} / {galleryGrid.length}
          </div>
        </div>
      )}

    </div>
  )
}
