import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ColorBlockCarousel from '../components/kareum/ColorBlockCarousel'
import PackageCarousel from '../components/kareum/PackageCarousel'
import packagesData from '../data/packages.json'
import Eyebrow from '../components/Eyebrow'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import { BRAND_HEX } from '../lib/designTokens'

// 코스와 프로그램은 서로 다른 기획 산출물이다.
// 코스는 연령대(2030 4050) x 이동수단(뚜벅이 자차)으로 나눈 1박 2일 이동 동선 8종
// 프로그램은 타깃(2030 커플친구혼행 4050 가족)별 숙박 식음 체험 관광을 묶은 선택형 1박 2일 상품 10종
const PKG_TABS = [
  { key: 'course', label: '코스', desc: '2030과 4050, 뚜벅이와 자차에 맞춰 이동 동선을 나눴어요.' },
  { key: 'program', label: '프로그램', desc: '숙박과 식사와 체험을 묶어 1박 2일로 즐길 수 있어요.' }
]

export default function PackagesPage() {
  const [pkgTab, setPkgTab] = useState('course')

  const pkgList = packagesData.filter((p) => p.category === pkgTab)
  const pkgCurrent = PKG_TABS.find((t) => t.key === pkgTab)

  return (
    <>
      <Helmet>
        <title>여행 코스 | 동해사이</title>
        <meta name="description" content="타깃별 1박 2일 코스와 프로그램으로 동해에서 하루 더 머무는 여행을 계획하세요." />
        <meta property="og:title" content="여행 코스 | 동해사이" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content={BRAND_HEX.primary} />
      </Helmet>

      <div className="page-enter">
        <div className="container-page pt-8 lg:pt-12">
          <RevealOnScroll className="mb-2">
            <Eyebrow>강원특별자치도 동해시</Eyebrow>
            <h1 className="mt-3 type-page-title text-text-pri">
              여행 코스
            </h1>
            <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec">
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
                        ? 'text-primary border-primary'
                        : 'text-text-meta border-transparent hover:text-text-pri'}`}>
                    {t.label} <span className="tabular-nums">{count}</span>
                  </button>
                )
              })}
            </div>
          </RevealOnScroll>
        </div>

        <div className="pt-6 lg:pt-8 pb-12 lg:pb-16">
          {pkgTab === 'program'
            ? <ColorBlockCarousel items={pkgList} />
            : <PackageCarousel title="1박 2일 코스" items={pkgList} />}
        </div>
      </div>
    </>
  )
}
