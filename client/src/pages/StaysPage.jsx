import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import StayCard from '../components/card/StayCard'
import Chip from '../components/Chip'
import EmptyState from '../components/feedback/EmptyState'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import staysData from '../data/stays.json'
import Eyebrow from '../components/Eyebrow'
import { BRAND_HEX } from '../lib/designTokens'

const REGIONS = ['전체', '추암', '무릉', '천곡', '묵호', '망상']

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
        <meta name="theme-color" content={BRAND_HEX.primary} />
      </Helmet>

      <div className="page-enter">
        <div className="container-page pt-8 lg:pt-12">

          <RevealOnScroll className="mb-10 lg:mb-14">
            <Eyebrow>강원특별자치도 동해시</Eyebrow>
            <h1 className="mt-3 type-page-title text-text-pri max-w-[820px]">
              흩어진 장소를 이어 하루 더 머무는 여행을 만들어요
            </h1>
          </RevealOnScroll>

          <h2 className="type-section-title text-text-pri">
            동해 로컬 자원
          </h2>
          <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec tabular-nums">
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
