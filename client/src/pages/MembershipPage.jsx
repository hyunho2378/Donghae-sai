import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DoorOpen, MapPin, BedDouble, Check, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import plansData from '../data/membership_plans.json'

// 아래 내용은 전부 자료집 pass 항목 원문 근거다. 원문에 없는 값은 미정으로 둔다
const TAGS = [
  { Icon: DoorOpen, title: '관문 태그', desc: '여정 시작점에서 패스 활성화' },
  { Icon: MapPin, title: '코스 태그', desc: '관광지와 상점에서 스탬프 적립' },
  { Icon: BedDouble, title: '체류 태그', desc: '숙소에서 1박 기록' }
]

const FLOW = [
  '사이트에서 선불 1회 결제',
  '익명 패스 번호 발급',
  '현장에서 NFC 태그',
  '할인과 스탬프 적립',
  '다음 장소 추천',
  '여정이 끝날 때까지 반복'
]

const STAMPS = ['저녁', '별', '밤 활동', '오늘의 동해 접수', '숙소', '일출', '오늘의 동해 수령']

const FAQ = [
  { q: '개인정보를 내야 하나요?', a: '이름과 전화번호를 받지 않는다. 익명 패스 번호가 세션 ID가 되어 여정 데이터를 익명으로 연결한다.' },
  { q: '관광지 입장료가 포함되나요?', a: '포함하지 않는다. 도째비골과 천곡동굴과 무릉별유천지는 이미 자체 할인과 동해사랑상품권 환급으로 운영된다. 패스는 별빛 콘텐츠와 상권 할인과 데이터 참여를 담는다.' },
  { q: '가족은 어떻게 사나요?', a: '묶음권 1매가 아니라 인원수만큼 개별권으로 발급한다. 4인이면 패스 번호 4개를 발급해 각자 NFC 태그로 개인별 여정 데이터를 남긴다. 가족 묶음 시 10에서 15% 추가 할인이 적용된다. 2일권 4인은 32,000원에서 가족팩 27,900원이다.' },
  { q: '패스가 없어도 태그할 수 있나요?', a: '태그하면 코스 소개와 구매 안내가 뜬다. 혜택은 잠기되 익명 방문 기록은 남는다.' },
  { q: '스탬프를 다 모으면 어떻게 되나요?', a: '완주하면 문어 굿즈 등 보상을 준다.' },
  { q: '환불 규정은 어떻게 되나요?', a: '자료 도착 후 안내한다.' }
]

function passCta(isAuthenticated, planId) {
  const target = `/checkout?type=pass&plan=${planId}`
  return isAuthenticated ? target : `/auth?redirect=${target}`
}

const SECTION = 'container-page'
const H2 = 'font-pretendard font-bold text-[20px] md:text-[24px] lg:text-[28px] text-text-pri tracking-[-0.02em]'

export default function MembershipPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="page-enter">
      <Helmet>
        <title>동해사이 패스 | 동해사이</title>
        <meta name="description" content="스탬프로 완성하는 하룻밤. 1일권 5,000원, 2일권 8,000원, 3일권 10,000원." />
        <meta property="og:title" content="동해사이 패스 | 동해사이" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      {/* 히어로 */}
      <section className={`${SECTION} py-10 md:py-14 lg:py-16`}>
        <p className="font-pretendard font-medium text-[12px] tracking-[0.06em] text-primary-hover">
          donghae sai pass
        </p>
        <h1 className="mt-4 font-pretendard font-bold
                       text-[28px] md:text-[36px] lg:text-[44px]
                       text-text-pri tracking-[-0.02em] leading-tight">
          스탬프로 완성하는 하룻밤
        </h1>
        <p className="mt-4 max-w-[640px] font-pretendard font-normal
                      text-[15px] md:text-[16px] text-text-sec tracking-[-0.01em] leading-relaxed">
          동해의 밤을 걷고 스탬프를 모아 하룻밤을 완성하는 여행 패스
        </p>
      </section>

      {/* 패스 상품 */}
      <section className="bg-bg-card">
        <div className={`${SECTION} py-10 md:py-14 lg:py-16`}>
          <h2 className={H2}>패스 상품</h2>
          <div className="mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
            {plansData.map((plan) => {
              const isRec = plan.recommended
              return (
                <div key={plan.id}
                     className={`relative bg-white rounded-2xl p-6 lg:p-8
                       ${isRec ? 'border-2 border-primary' : 'shadow-card'}`}>
                  {isRec && (
                    <span className="absolute -top-3 left-6 inline-flex items-center h-[24px] px-2.5
                                     bg-primary-hover text-white
                                     font-pretendard font-medium text-[11px] tracking-[0.04em] rounded-md">
                      추천
                    </span>
                  )}
                  <p className={`font-pretendard font-bold text-[20px] tracking-[-0.02em]
                                 ${isRec ? 'text-primary-hover' : 'text-text-pri'}`}>
                    {plan.name}
                  </p>
                  <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">
                    {plan.purpose}
                  </p>
                  <p className="mt-5 font-pretendard font-bold text-[28px] text-text-pri tracking-[-0.02em]">
                    {plan.price.toLocaleString()}
                    <span className="ml-1 font-medium text-[16px] text-text-meta">원</span>
                  </p>
                  <p className="mt-0.5 font-pretendard font-light text-[13px] text-text-meta">
                    1일당 {plan.price_per_day.toLocaleString()}원
                  </p>
                  <ul className="mt-6 space-y-2">
                    {plan.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 font-pretendard font-normal text-[14px] text-text-sec">
                        <Check size={16} className="mt-0.5 shrink-0 text-primary-hover" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-pretendard font-light text-[13px] text-text-meta leading-relaxed">
                    {plan.note}
                  </p>
                  <Link to={passCta(isAuthenticated, plan.id)}
                        className={`mt-6 w-full h-12 rounded-lg inline-flex items-center justify-center
                                    font-pretendard font-medium text-[15px] transition-colors duration-150
                                    ${isRec
                                      ? 'bg-primary-hover text-white hover:bg-primary'
                                      : 'bg-white text-text-sec border border-border-def hover:border-primary hover:text-primary-hover'}`}>
                    구매하기
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* NFC 태그 3종 */}
      <section className={`${SECTION} py-10 md:py-14 lg:py-16`}>
        <h2 className={H2}>NFC 태그 세 가지</h2>
        <div className="mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          {TAGS.map(({ Icon, title, desc }) => (
            <div key={title} className="shadow-card rounded-2xl p-6">
              <span className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-primary-soft">
                <Icon size={20} className="text-primary-hover" />
              </span>
              <p className="mt-4 font-pretendard font-bold text-[17px] text-text-pri tracking-[-0.02em]">
                {title}
              </p>
              <p className="mt-2 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 사용 흐름 */}
      <section className="bg-bg-card">
        <div className={`${SECTION} py-10 md:py-14 lg:py-16`}>
          <h2 className={H2}>사용 흐름</h2>
          <ol className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {FLOW.map((step, i) => (
              <li key={step} className="bg-white shadow-card rounded-xl p-5">
                <p className="font-pretendard font-bold text-[14px] text-primary-hover tracking-[0.04em]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 font-pretendard font-normal text-[15px] text-text-sec leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 스탬프 7단계 */}
      <section className={`${SECTION} py-10 md:py-14 lg:py-16`}>
        <h2 className={H2}>스탬프 일곱 단계</h2>
        <p className="mt-2 font-pretendard font-normal text-[15px] text-text-sec">
          저녁에서 시작해 다음 날 아침에 끝난다. 일곱 개를 다 모으면 하룻밤이 완성된다.
        </p>
        <ol className="mt-8 flex flex-wrap gap-x-2 gap-y-4">
          {STAMPS.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="w-10 h-10 inline-flex items-center justify-center rounded-full
                               border border-border-def
                               font-pretendard font-bold text-[13px] text-text-meta">
                {i + 1}
              </span>
              <span className="font-pretendard font-medium text-[14px] text-text-pri">{s}</span>
              {i < STAMPS.length - 1 && (
                <span aria-hidden="true" className="w-6 h-px bg-border-def" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="bg-bg-card">
        <div className={`${SECTION} py-10 md:py-14 lg:py-16`}>
          <h2 className={H2}>자주 묻는 질문</h2>
          <div className="mt-8 shadow-card rounded-2xl bg-white overflow-hidden">
            {FAQ.map((item, i) => (
              <div key={item.q} className="border-t border-border-sub first:border-t-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full min-h-14 px-5 py-4 flex items-center justify-between gap-4 text-left
                             hover:bg-bg-card transition-colors duration-150">
                  <span className="font-pretendard font-medium text-[15px] text-text-pri">{item.q}</span>
                  <ChevronDown size={20}
                    className={`shrink-0 text-text-meta transition-transform duration-150
                                ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${SECTION} py-10 md:py-14 lg:py-16 text-center`}>
        <h2 className={H2}>오늘 밤, 하루 더 머문다</h2>
        <p className="mt-3 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
          1일권 5,000원 2일권 8,000원 3일권 10,000원
        </p>
        <div className="mt-6 inline-flex flex-wrap justify-center gap-3">
          <Link to={passCta(isAuthenticated, 'pass-2day')}
                className="inline-flex items-center justify-center h-12 lg:h-14 px-8
                           bg-primary-hover text-white rounded-lg
                           font-pretendard font-medium text-[15px] lg:text-[16px]
                           hover:bg-primary transition-colors duration-150">
            2일권 8,000원으로 시작하기
          </Link>
          <Link to="/goods"
                className="inline-flex items-center justify-center h-12 lg:h-14 px-8
                           bg-white text-text-pri border border-border-def rounded-lg
                           font-pretendard font-medium text-[15px] lg:text-[16px]
                           hover:border-primary transition-colors duration-150">
            굿즈 보기
          </Link>
        </div>
      </section>
    </div>
  )
}
