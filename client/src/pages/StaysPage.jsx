import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import StayCard from '../components/card/StayCard'
import Chip from '../components/Chip'
import EmptyState from '../components/feedback/EmptyState'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import ColorBlockCarousel from '../components/kareum/ColorBlockCarousel'
import PackageCarousel from '../components/kareum/PackageCarousel'
import staysData from '../data/stays.json'
import packagesData from '../data/packages.json'
import { STAY_TYPE_LABEL } from '../lib/format'

const REGIONS = ['전체', '추암', '무릉', '천곡', '묵호', '망상']

// 수치는 REBRAND_MASTER.md의 확정 전제만 쓴다
const INTRO_STATS = [
  { value: '1,220만 9,032명', label: '최근 1년 동해 방문객' },
  { value: '86%', label: '당일 귀가 비율' },
  { value: '14.2%', label: '숙박 전환율' }
]

// 네 갈래 진입. 대표 사진은 그 갈래에 속한 실제 장소 사진만 쓴다
// 숙박 갈래는 사진 자료가 없어 사진 없이 둔다. 다른 장소 사진을 끌어오지 않는다
const TYPE_ENTRIES = ['eat', 'stay', 'play', 'see'].map((key) => {
  const list = staysData.filter((s) => s.type === key)
  const withImage = list.find((s) => s.main_image)
  return {
    key,
    label: STAY_TYPE_LABEL[key],
    count: list.length,
    image: withImage ? withImage.main_image : null
  }
})

// 프로그램을 동해 사이 안으로 합쳤다. 코스와 프로그램 두 갈래
const PKG_TABS = [
  { key: 'course', label: '코스', desc: '2030과 4050, 뚜벅이와 자차로 나눈 이동 동선이다' },
  { key: 'program', label: '프로그램', desc: '숙박과 식사와 체험을 묶은 선택형 1박 2일 상품이다' }
]

export default function StaysPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [region, setRegion] = useState('전체')
  const [pkgTab, setPkgTab] = useState('course')

  const items = useMemo(() => {
    return staysData.filter((s) => {
      if (region !== '전체' && s.region !== region) return false
      if (q && !(s.name.includes(q) || s.region.includes(q))) return false
      return true
    })
  }, [region, q])

  const pkgList = packagesData.filter((p) => p.category === pkgTab)
  const pkgCurrent = PKG_TABS.find((t) => t.key === pkgTab)

  return (
    <>
      <Helmet>
        <title>동해 사이 | 동해사이</title>
        <meta name="description" content="추암 무릉 천곡 묵호 망상 5개 권역의 먹거리 숙박 체험 볼거리와 1박 2일 코스와 프로그램을 살펴보세요." />
        <meta property="og:title" content="동해 사이 | 동해사이" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      <div className="page-enter">
        <div className="container-page
                        pt-8 lg:pt-12">

          <RevealOnScroll className="mb-10 lg:mb-14">
            <span className="inline-flex items-center h-[26px] px-2.5
                             bg-bg-mute text-text-meta
                             font-pretendard font-semibold text-[12px] tracking-[0.04em] rounded-md">
              강원특별자치도 동해시
            </span>
            <h1 className="mt-4 font-pretendard font-bold
                           text-[22px] md:text-[26px] lg:text-[30px]
                           text-text-pri tracking-[-0.02em] leading-tight max-w-[820px]">
              흩어진 장소를 이어 하루 더 머무는 여행을 만든다
            </h1>
            <p className="mt-3 font-pretendard font-normal text-[14px] md:text-[15px] text-text-meta leading-relaxed max-w-[760px]">
              최근 1년 방문객 1,220만 9,032명 가운데 86%가 당일 귀가한다. 동해사이는 저녁부터 다음 날 아침까지를 잇는다.
            </p>
            <div className="mt-6 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
              {INTRO_STATS.map((s) => (
                <div key={s.value} className="bg-bg-card shadow-card rounded-xl p-5">
                  <p className="font-pretendard font-bold text-[22px] md:text-[26px] text-accent tracking-[-0.02em]">
                    {s.value}
                  </p>
                  <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* 네 갈래 진입. 정보용 개요 카드 */}
          <RevealOnScroll className="mb-10 lg:mb-14">
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              {TYPE_ENTRIES.map((t) => (
                <div key={t.key}
                     className="overflow-hidden rounded-xl shadow-card">
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg-card">
                    {t.image ? (
                      <img src={t.image} alt={t.label} loading="lazy"
                           className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-soft" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-pretendard font-bold text-[16px] md:text-[18px] tracking-[0.04em] text-text-pri">
                      {t.label}
                    </p>
                    <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">
                      {t.count}곳
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* 코스와 프로그램. 프로그램 페이지를 여기로 합쳤다 */}
          <RevealOnScroll className="mb-2">
            <h2 className="font-pretendard font-bold
                           text-[22px] md:text-[26px] lg:text-[30px]
                           text-text-pri tracking-[-0.02em] leading-tight">
              코스와 프로그램
            </h2>
            <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
              {pkgCurrent.desc}
            </p>
            <div className="mt-6 flex gap-1 border-b border-border-sub">
              {PKG_TABS.map((t) => {
                const count = packagesData.filter((p) => p.category === t.key).length
                return (
                  <button key={t.key}
                          onClick={() => setPkgTab(t.key)}
                          className={`min-h-11 px-4 font-pretendard font-semibold text-[15px] tracking-[0.02em]
                                      border-b-2 transition-colors duration-150 motion-reduce:transition-none
                                      ${pkgTab === t.key
                                        ? 'text-accent border-accent'
                                        : 'text-text-meta border-transparent hover:text-text-pri'}`}>
                    {t.label} {count}
                  </button>
                )
              })}
            </div>
          </RevealOnScroll>
        </div>

        {pkgTab === 'program'
          ? <ColorBlockCarousel items={pkgList} />
          : <PackageCarousel title="1박 2일 코스" items={pkgList} />}

        <div className="container-page
                        pt-8 lg:pt-12 pb-12 lg:pb-16">

          <h2 className="font-pretendard font-bold
                         text-[22px] md:text-[26px] lg:text-[30px]
                         text-text-pri tracking-[-0.02em] leading-tight">
            동해 로컬 자원
          </h2>
          <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
            {q ? `검색어 ${q} 에 대한 결과 ${items.length}곳` : '네 갈래로 묶은 동해 로컬 자원'}
          </p>

          <div className="mt-6 lg:mt-8">
            <p className="font-pretendard font-medium text-[13px] text-text-pri mb-2">지역</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
              {REGIONS.map((r) => (
                <Chip key={r} label={r} isSelected={region === r} onClick={() => setRegion(r)} />
              ))}
            </div>
          </div>

          <div className="mt-8 lg:mt-10">
            {items.length === 0 ? (
              <EmptyState
                title="결과가 없어요"
                description="조건을 바꿔서 다시 검색해 보세요" />
            ) : (
              <div className="grid gap-4 md:gap-6
                              grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {items.map((s) => <StayCard key={s.id} {...s} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
