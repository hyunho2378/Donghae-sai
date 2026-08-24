import { useState } from 'react'
import ColorBlockCarousel from '../components/kareum/ColorBlockCarousel'
import PackageCarousel from '../components/kareum/PackageCarousel'
import packagesData from '../data/packages.json'

const TABS = [
  { key: 'course', label: '코스', desc: '2030과 4050, 뚜벅이와 자차로 나눈 이동 동선이다' },
  { key: 'program', label: '프로그램', desc: '숙박과 식사와 체험을 묶은 선택형 1박 2일 상품이다' }
]

export default function PackagesPage() {
  const [tab, setTab] = useState('course')
  const list = packagesData.filter((p) => p.category === tab)
  const current = TABS.find((t) => t.key === tab)

  return (
    <div className="page-enter">
      <div className="mx-auto w-full
                      px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                      max-w-[1400px] 2xl:max-w-[1600px]
                      pt-8 lg:pt-12">
        <h1 className="font-pretendard font-bold
                       text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                       text-text-pri tracking-[-0.02em] leading-tight">
          1박 2일 코스와 프로그램
        </h1>
        <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
          {current.desc}
        </p>

        <div className="mt-6 flex gap-1 border-b border-border-sub">
          {TABS.map((t) => {
            const count = packagesData.filter((p) => p.category === t.key).length
            return (
              <button key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`min-h-11 px-4 font-pretendard font-semibold text-[15px] tracking-[0.02em]
                                  border-b-2 transition-colors duration-150 motion-reduce:transition-none
                                  ${tab === t.key
                                    ? 'text-accent border-accent'
                                    : 'text-text-meta border-transparent hover:text-text-pri'}`}>
                {t.label} {count}
              </button>
            )
          })}
        </div>
      </div>

      {tab === 'program'
        ? <ColorBlockCarousel items={list} />
        : <PackageCarousel title="1박 2일 코스" items={list} />}

      <div className="pb-12 lg:pb-16" />
    </div>
  )
}
