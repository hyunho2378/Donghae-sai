import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import StayCard from '../components/card/StayCard'
import Chip from '../components/Chip'
import EmptyState from '../components/feedback/EmptyState'
import staysData from '../data/stays.json'
import { STAY_TYPE_LABEL } from '../lib/format'

const REGIONS = ['전체', '추암', '무릉', '천곡', '묵호', '망상']
const TYPES = [
  { key: 'all', label: '전체' },
  { key: 'eat', label: STAY_TYPE_LABEL.eat },
  { key: 'stay', label: STAY_TYPE_LABEL.stay },
  { key: 'play', label: STAY_TYPE_LABEL.play },
  { key: 'see', label: STAY_TYPE_LABEL.see }
]

// 수치는 REBRAND_MASTER.md의 확정 전제만 쓴다
const INTRO_STATS = [
  { value: '1,220만 9,032명', label: '최근 1년 동해 방문객' },
  { value: '86퍼센트', label: '당일 귀가 비율' },
  { value: '14.2퍼센트', label: '숙박 전환율' }
]

export default function StaysPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [region, setRegion] = useState('전체')
  const [type, setType] = useState('all')

  const items = useMemo(() => {
    return staysData.filter((s) => {
      if (region !== '전체' && s.region !== region) return false
      if (type !== 'all' && s.type !== type) return false
      if (q && !(s.name.includes(q) || s.region.includes(q))) return false
      return true
    })
  }, [region, type, q])

  return (
    <>
      <Helmet>
        <title>사이 찾기 | 동해사이</title>
        <meta name="description" content="추암 무릉 천곡 묵호 망상 5개 권역의 EAT STAY PLAY SEE 연계 후보를 살펴보세요." />
        <meta property="og:title" content="사이 찾기 | 동해사이" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content="#60A5FA" />
      </Helmet>
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                    max-w-[1400px] 2xl:max-w-[1600px]
                    py-8 lg:py-12">

      <section className="mb-10 lg:mb-14">
        <span className="inline-flex items-center h-[26px] px-2.5
                         bg-primary-soft text-primary
                         font-pretendard font-medium text-[12px] tracking-[0.04em] rounded-md">
          강원특별자치도 동해시
        </span>
        <h2 className="mt-4 font-pretendard font-bold
                       text-[22px] md:text-[26px] lg:text-[30px]
                       text-text-pri tracking-[-0.02em] leading-tight max-w-[820px]">
          흩어진 장소를 이어 하루 더 머무는 여행을 만든다
        </h2>
        <p className="mt-3 font-pretendard font-normal text-[14px] md:text-[15px] text-text-meta leading-relaxed max-w-[760px]">
          최근 1년 방문객 1,220만 9,032명 가운데 86퍼센트가 당일 귀가한다. 동해사이는 저녁부터 다음 날 아침까지를 잇는다.
        </p>
        <div className="mt-6 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
          {INTRO_STATS.map((s) => (
            <div key={s.value} className="border border-border-sub rounded-xl p-5">
              <p className="font-pretendard font-bold text-[18px] md:text-[20px] text-text-pri tracking-[-0.02em]">
                {s.value}
              </p>
              <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <h1 className="font-pretendard font-bold
                     text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                     text-text-pri tracking-[-0.02em] leading-tight">
        동해사이 연계 후보
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
        {q ? `검색어 ${q} 에 대한 결과 ${items.length}곳` : 'EAT STAY PLAY SEE 네 갈래로 묶은 동해 로컬 자원'}
      </p>
      <p className="mt-1 font-pretendard font-light text-[12px] md:text-[13px] text-text-meta">
        총 {items.length}곳 표시 중. 모두 확정 제휴처가 아니라 연계 후보다
      </p>

      <div className="mt-6 lg:mt-8 space-y-4">
        <div>
          <p className="font-pretendard font-medium text-[13px] text-text-pri mb-2">지역</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {REGIONS.map((r) => (
              <Chip key={r} label={r} isSelected={region === r} onClick={() => setRegion(r)} />
            ))}
          </div>
        </div>
        <div>
          <p className="font-pretendard font-medium text-[13px] text-text-pri mb-2">유형</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {TYPES.map((t) => (
              <Chip key={t.key} label={t.label} isSelected={type === t.key} onClick={() => setType(t.key)} />
            ))}
          </div>
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
    </>
  )
}
