import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import StayCard from '../components/card/StayCard'
import Chip from '../components/Chip'
import EmptyState from '../components/feedback/EmptyState'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import staysData from '../data/stays.json'
import Eyebrow from '../components/Eyebrow'
import { STAY_TYPE_LABEL } from '../lib/format'

const REGIONS = ['전체', '추암', '무릉', '천곡', '묵호', '망상']

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

// 이 페이지는 로컬 자원 소개와 검색만 다룬다. 코스와 프로그램은 여행 코스 페이지로 분리했다
export default function StaysPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [region, setRegion] = useState('전체')

  const items = useMemo(() => {
    return staysData.filter((s) => {
      if (region !== '전체' && s.region !== region) return false
      if (q && !(s.name.includes(q) || s.region.includes(q))) return false
      return true
    })
  }, [region, q])

  return (
    <>
      <Helmet>
        <title>로컬 자원 | 동해사이</title>
        <meta name="description" content="추암 무릉 천곡 묵호 망상 5개 권역의 먹거리 숙박 체험 볼거리를 살펴보세요." />
        <meta property="og:title" content="로컬 자원 | 동해사이" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      <div className="page-enter">
        <div className="container-page pt-8 lg:pt-12">

          <RevealOnScroll className="mb-10 lg:mb-14">
            <Eyebrow>강원특별자치도 동해시</Eyebrow>
            <h1 className="mt-3 font-pretendard font-bold
                           text-[22px] md:text-[26px] lg:text-[30px]
                           text-text-pri tracking-[-0.02em] leading-tight max-w-[820px]">
              흩어진 장소를 이어 하루 더 머무는 여행을 만든다
            </h1>
          </RevealOnScroll>

          {/* 네 갈래 진입. 정보용 개요 카드 */}
          <RevealOnScroll className="mb-10 lg:mb-14">
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              {TYPE_ENTRIES.map((t) => (
                <div key={t.key}
                  className="overflow-hidden rounded-xl border border-primary bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg-mute">
                    {t.image ? (
                      <img src={t.image} alt={t.label} loading="lazy"
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-soft" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-pretendard font-bold text-[16px] md:text-[18px] text-text-pri">
                      {t.label}
                    </p>
                    <p className="mt-1 font-pretendard font-semibold text-[13px] text-text-sec tabular-nums">
                      {t.count}곳
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

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

          <div className="mt-8 lg:mt-10 pb-12 lg:pb-16">
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
