import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import StayCard from '../components/card/StayCard'
import staysData from '../data/stays.json'

// 수치는 REBRAND_MASTER.md의 확정 전제만 쓴다
const STATS = [
  { value: '1,220만 9,032명', label: '최근 1년 방문객' },
  { value: '86%', label: '당일 귀가' },
  { value: '14.2%', label: '숙박 전환율' }
]

const POINTS = [
  {
    title: '사이를 잇는다',
    desc: '숙소와 식당 사이, 낮과 밤 사이, 당일과 1박 사이를 잇는다. 장소를 점으로 두고 경로를 선으로 잇는다.'
  },
  {
    title: '네 갈래 제휴',
    desc: '먹거리 숙박 체험 볼거리 네 갈래로 로컬 자원을 묶는다. 동해시청 관광과와 동해문화관광재단이 함께하는 공공 협력 사업이다.'
  },
  {
    title: '일회성 NFC 패스',
    desc: '월 구독이 아니라 여행 기간만큼만 산다. 관문과 코스와 체류 세 가지 태그로 할인과 스탬프를 처리한다.'
  }
]

const STAMPS = [
  { num: 1, label: '저녁', desc: '로컬 식당에서 저녁을 먹는다' },
  { num: 2, label: '별', desc: '별빛 콘텐츠를 이용한다' },
  { num: 3, label: '밤 활동', desc: '밤 시간대 코스를 돈다' },
  { num: 4, label: '오늘의 동해 접수', desc: '저녁에 맡긴다' },
  { num: 5, label: '숙소', desc: '1박을 기록한다' },
  { num: 6, label: '일출', desc: '다음 날 아침을 연다' },
  { num: 7, label: '오늘의 동해 수령', desc: '아침에 받는다' }
]

const REGIONS = ['추암', '무릉', '천곡', '묵호', '망상']

const SECTION = 'mx-auto w-full px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24 max-w-[1400px] 2xl:max-w-[1600px]'
const H2 = 'font-pretendard font-bold text-[20px] md:text-[24px] lg:text-[28px] tracking-[-0.02em]'

export default function AboutPage() {
  const featured = staysData.filter((s) => s.main_image && s.type !== 'eat').slice(0, 6)

  return (
    <div className="page-enter">
      <Helmet>
        <title>동해사이 소개 | 동해사이</title>
        <meta name="description" content="당일에서 1박으로. 흩어진 동해의 장소와 경험을 이어 하루 더 머무는 여행을 만든다." />
        <meta property="og:title" content="동해사이 소개 | 동해사이" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      {/* 히어로 */}
      <section className="bg-black text-white">
        <div className={`${SECTION} py-16 md:py-20 lg:py-24 4xl:py-32`}>
          <p className="font-pretendard font-medium text-[12px] tracking-[0.06em] text-primary">
            donghae sai
          </p>
          <h1 className="mt-4 font-pretendard font-bold
                         text-[28px] md:text-[36px] lg:text-[44px]
                         tracking-[-0.02em] leading-tight max-w-[820px]">
            하루와 하루 사이, 동해
          </h1>
          <p className="mt-4 max-w-[640px] font-pretendard font-normal
                        text-[15px] md:text-[16px] text-white/75 tracking-[-0.01em] leading-relaxed">
            흩어진 동해의 장소와 경험을 이어 하루 더 머무는 여행을 만든다.
          </p>
        </div>
      </section>

      {/* 문제 정의 */}
      <section className={`${SECTION} py-12 md:py-18 lg:py-24`}>
        <h2 className={`${H2} text-text-pri`}>문제</h2>
        <p className="mt-4 max-w-[720px] font-pretendard font-normal
                      text-[15px] md:text-[16px] text-text-sec tracking-[-0.01em] leading-relaxed">
          동해는 사람이 오지 않는 도시가 아니다. 최근 1년 동안 1,220만 9,032명이 왔다.
          문제는 그중 86%가 당일에 돌아간다는 것이다. 숙박 전환율은 14.2%에 그친다.
          체류시간을 늘리는 것이 아니라 당일을 1박으로 바꾸는 것이 목표다.
        </p>
        <div className="mt-8 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="shadow-card rounded-xl p-5">
              <p className="font-pretendard font-bold text-[20px] md:text-[24px] text-text-pri tracking-[-0.02em]">
                {s.value}
              </p>
              <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 해법 */}
      <section className="bg-bg-card">
        <div className={`${SECTION} py-12 md:py-18 lg:py-24`}>
          <h2 className={`${H2} text-text-pri`}>동해사이의 답</h2>
          <div className="mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
            {POINTS.map((p) => (
              <div key={p.title} className="bg-white shadow-card rounded-2xl p-6">
                <p className="font-pretendard font-bold text-[17px] text-text-pri tracking-[-0.02em]">
                  {p.title}
                </p>
                <p className="mt-3 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 스탬프 7단계 */}
      <section className={`${SECTION} py-12 md:py-18 lg:py-24`}>
        <h2 className={`${H2} text-text-pri`}>하룻밤을 완성하는 일곱 단계</h2>
        <div className="mt-8 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {STAMPS.map((s) => (
            <div key={s.num} className="shadow-card rounded-xl p-5">
              <p className="font-pretendard font-bold text-[13px] text-primary-hover tracking-[0.04em]">
                {String(s.num).padStart(2, '0')}
              </p>
              <p className="mt-2 font-pretendard font-bold text-[16px] text-text-pri tracking-[-0.02em]">
                {s.label}
              </p>
              <p className="mt-1 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5권역 */}
      <section className="bg-bg-card">
        <div className={`${SECTION} py-12 md:py-18 lg:py-24`}>
          <h2 className={`${H2} text-text-pri`}>다섯 권역</h2>
          <p className="mt-2 font-pretendard font-normal text-[15px] text-text-sec">
            동해시 공식 권역 구분을 그대로 쓴다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <Link key={r} to={`/stays?region=${encodeURIComponent(r)}`}
                    className="inline-flex items-center h-11 px-5 rounded-full
                               bg-white border border-border-def
                               font-pretendard font-medium text-[15px] text-text-pri
                               hover:border-primary transition-colors duration-150">
                {r}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 함께하는 로컬 */}
      <section className={`${SECTION} py-12 md:py-18 lg:py-24`}>
        <h2 className={`${H2} text-text-pri`}>함께하는 로컬</h2>
        <p className="mt-2 font-pretendard font-normal text-[15px] text-text-sec">
          방문 전 영업일과 휴무를 확인한다.
        </p>
        <div className="mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => <StayCard key={s.id} {...s} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className={`${SECTION} py-16 lg:py-24 text-center`}>
          <h2 className={H2}>오늘 밤, 하루 더 머문다</h2>
          <div className="mt-8 inline-flex flex-wrap justify-center gap-3">
            <Link to="/membership"
                  className="h-12 lg:h-14 px-6 lg:px-8 inline-flex items-center rounded-lg
                             bg-white text-text-pri
                             font-pretendard font-medium text-[15px] lg:text-[16px]
                             hover:bg-white/90 transition-colors duration-150">
              패스 보기
            </Link>
            <Link to="/packages"
                  className="h-12 lg:h-14 px-6 lg:px-8 inline-flex items-center rounded-lg
                             bg-transparent text-white border border-white/30
                             font-pretendard font-medium text-[15px] lg:text-[16px]
                             hover:bg-white/10 transition-colors duration-150">
              코스 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
