import { Helmet } from 'react-helmet-async'
import SovereignHero from '../components/SovereignHero'
import RegionSection from '../components/RegionSection'
import SectionHeader from '../components/SectionHeader'
import PackageCard from '../components/card/PackageCard'
import JournalCard from '../components/card/JournalCard'
import packagesData from '../data/packages.json'
import journalData from '../data/journal.json'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="page-enter">
      <Helmet>
        <title>동해사이 | 하루와 하루 사이, 동해</title>
        <meta name="description" content="흩어진 동해의 장소와 경험을 이어 하루 더 머무는 여행을 만든다. 추암 무릉 천곡 묵호 망상 5개 권역과 동해사이 패스." />
        <meta property="og:title" content="동해사이 | 하루와 하루 사이, 동해" />
        <meta property="og:description" content="당일에서 1박으로. 동해사이가 흩어진 장소를 잇는다." />
        <meta property="og:image" content="/images/regions/mukho.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#60A5FA" />
      </Helmet>
      <SovereignHero />
      <RegionSection />

      <section className="bg-bg-mute">
        <div className="mx-auto w-full
                        px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                        max-w-[1400px] 2xl:max-w-[1600px]
                        py-12 md:py-18 lg:py-24 4xl:py-32">
          <SectionHeader
            title="COURSE"
            subtitle="저녁부터 다음 날 아침까지, 코스 여덟 개와 프로그램 열 개"
            to="/packages" />
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...packagesData.filter((p) => p.category === 'course').slice(0, 3),
              ...packagesData.filter((p) => p.category === 'program').slice(0, 3)]
              .map((p) => <PackageCard key={p.id} {...p} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full
                          px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                          max-w-[1400px] 2xl:max-w-[1600px]
                          py-12 md:py-18 lg:py-24 4xl:py-32">
        <SectionHeader
          title="LOCAL"
          subtitle="동해의 카페와 책방과 소품샵"
          to="/journal" />
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {journalData.slice(0, 3).map((j) => <JournalCard key={j.id} {...j} />)}
        </div>
      </section>

      <section className="bg-black text-white py-16 lg:py-24 4xl:py-32">
        <div className="mx-auto w-full
                        px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                        max-w-[1400px] 2xl:max-w-[1600px]
                        text-center">
          <h2 className="font-pretendard font-bold
                         text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                         tracking-[-0.02em]">
            스탬프로 완성하는 하룻밤
          </h2>
          <p className="mt-3 font-pretendard font-normal text-[15px] md:text-[16px] text-white/80">
            일회성 NFC 패스. 1일권 5,000원, 2일권 8,000원, 3일권 10,000원
          </p>
          <div className="mt-8 inline-flex gap-3">
            <Link to="/membership"
                  className="h-12 lg:h-14 px-6 lg:px-8
                             bg-white text-text-pri
                             font-pretendard font-medium text-[16px]
                             rounded-lg inline-flex items-center
                             hover:bg-white/90 transition-colors duration-150">
              패스 보기
            </Link>
            <Link to="/goods"
                  className="h-12 lg:h-14 px-6 lg:px-8
                             bg-transparent text-white border border-white/30
                             font-pretendard font-medium text-[16px]
                             rounded-lg inline-flex items-center
                             hover:bg-white/10 transition-colors duration-150">
              굿즈 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
