import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DoorOpen, MapPin, BedDouble, Check, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import Eyebrow from '../components/Eyebrow'
import plansData from '../data/membership_plans.json'

// 아래 내용은 전부 자료집 pass 항목 원문 근거다. 원문에 없는 값은 미정으로 둔다
const TAGS = [
  { Icon: DoorOpen, title: '관문 태그', desc: '여정 시작점에서 패스를 켠다' },
  { Icon: MapPin, title: '코스 태그', desc: '관광지와 상점에서 스탬프를 쌓는다' },
  { Icon: BedDouble, title: '체류 태그', desc: '숙소에서 하룻밤을 기록한다' }
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
  {
    q: '개인정보를 내야 하나요?',
    a: '이름도 전화번호도 받지 않는다. 결제할 때 받은 익명 패스 번호 하나가 세션 ID 역할을 하고, 여정 기록은 그 번호에만 붙는다.'
  },
  {
    q: '관광지 입장료가 포함되나요?',
    a: '포함하지 않는다. 도째비골과 천곡동굴과 무릉별유천지는 이미 자체 할인과 동해사랑상품권 환급으로 운영한다. 패스가 담는 것은 별빛 콘텐츠와 상권 할인, 그리고 데이터 참여다.'
  },
  {
    q: '가족은 어떻게 사나요?',
    a: '묶음권 1매가 아니라 인원수만큼 개별권으로 발급한다. 4인이면 패스 번호 4개를 받아 각자 태그하고 각자의 여정 기록을 남긴다. 가족 묶음에는 10에서 15% 추가 할인이 붙어 2일권 4인 32,000원이 가족팩 27,900원이 된다.'
  },
  {
    q: '패스가 없어도 태그할 수 있나요?',
    a: '태그하면 코스 소개와 구매 안내가 뜬다. 혜택은 잠기지만 익명 방문 기록은 남는다.'
  },
  { q: '스탬프를 다 모으면 어떻게 되나요?', a: '일곱 개를 다 채우면 문어 굿즈를 비롯한 완주 보상을 받는다.' },
  { q: '환불 규정은 어떻게 되나요?', a: '자료 도착 후 안내한다.' }
]

function passCta(isAuthenticated, planId) {
  const target = `/checkout?type=pass&plan=${planId}`
  return isAuthenticated ? target : `/auth?redirect=${target}`
}

// 세 카드가 서로 구분되게 톤을 나눈다. 강조는 추천권 하나뿐이다
const PLAN_TONE = {
  recommended: {
    card: 'bg-white border-2 border-accent shadow-float',
    name: 'text-accent',
    check: 'text-accent',
    cta: 'bg-accent text-white hover:bg-accent-hover'
  },
  plain: {
    card: 'bg-white shadow-depth',
    name: 'text-text-pri',
    check: 'text-primary',
    cta: 'bg-white text-text-pri border border-border-def hover:border-primary hover:text-primary'
  },
  tinted: {
    card: 'bg-primary-soft shadow-depth',
    name: 'text-primary-hover',
    check: 'text-primary-hover',
    cta: 'bg-white text-primary-hover border border-primary hover:bg-primary hover:text-white'
  }
}

const SECTION = 'container-page'
const H2 = 'font-pretendard font-bold text-[22px] md:text-[26px] lg:text-[30px] text-text-pri leading-tight'

export default function MembershipPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [openFaq, setOpenFaq] = useState(null)
  const [mukoErr, setMukoErr] = useState(false)

  return (
    <div className="page-enter">
      <Helmet>
        <title>동해사이 패스 | 동해사이</title>
        <meta name="description" content="스탬프로 완성하는 하룻밤. 1일권 5,000원, 2일권 8,000원, 3일권 10,000원." />
        <meta property="og:title" content="동해사이 패스 | 동해사이" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      {/* 히어로. 무코가 옆에 서서 패스를 안내한다 */}
      <section className="bg-accent-soft">
        <div className={`${SECTION} py-6 md:py-7 lg:py-8`}>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Eyebrow tone="accent">donghae sai pass</Eyebrow>
              <h1 className="mt-3 font-pretendard font-bold
                             text-[26px] md:text-[32px] lg:text-[38px]
                             text-text-pri leading-tight">
                스탬프로 완성하는 하룻밤
              </h1>
              <p className="mt-2 max-w-[560px] font-pretendard font-medium
                            text-[15px] md:text-[16px] text-text-sec leading-relaxed">
                동해의 밤을 걷고 스탬프를 모아 하룻밤을 완성하는 여행 패스
              </p>
            </div>
            {!mukoErr && (
              <img src="/images/character/muko-main.png" alt="동해사이 캐릭터 무코"
                   onError={() => setMukoErr(true)}
                   className="hidden md:block w-[130px] lg:w-[160px] h-auto justify-self-end" />
            )}
          </div>
        </div>
      </section>

      {/* 패스 상품. 첫 화면에서 세 장을 한눈에 비교한다 */}
      <section className={`${SECTION} py-7 md:py-8 lg:py-9`}>
        <h2 className={H2}>패스 상품</h2>
        <div className="mt-4 grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-3">
          {plansData.map((plan, i) => {
            const tone = plan.recommended
              ? PLAN_TONE.recommended
              : (i === 0 ? PLAN_TONE.plain : PLAN_TONE.tinted)
            return (
              <div key={plan.id}
                   className={`relative rounded-[32px] p-5 flex flex-col ${tone.card}`}>
                {plan.recommended && (
                  <span className="absolute -top-3 left-5 inline-flex items-center h-[26px] px-3
                                   bg-accent text-white
                                   font-pretendard font-semibold text-[12px] tracking-[0.08em] rounded-md">
                    추천
                  </span>
                )}
                <p className={`font-pretendard font-bold text-[20px] ${tone.name}`}>
                  {plan.name}
                </p>
                <p className="mt-1 font-pretendard font-medium text-[13px] text-text-sec">
                  {plan.purpose}
                </p>
                <p className="mt-3 font-pretendard font-bold text-[30px] text-text-pri tabular-nums">
                  {plan.price.toLocaleString()}
                  <span className="ml-1 font-bold text-[16px] text-text-sec">원</span>
                </p>
                <p className="mt-0.5 font-pretendard font-medium text-[13px] text-text-sec tabular-nums">
                  1일당 {plan.price_per_day.toLocaleString()}원
                </p>
                <ul className="mt-4 space-y-1.5">
                  {plan.included.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 font-pretendard font-normal text-[14px] text-text-sec">
                      <Check size={16} strokeWidth={2.5} className={`mt-0.5 shrink-0 ${tone.check}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-pretendard font-normal text-[13px] text-text-meta leading-relaxed">
                  {plan.note}
                </p>
                <div className="mt-auto pt-4">
                  <Link to={passCta(isAuthenticated, plan.id)}
                        className={`w-full h-12 rounded-lg inline-flex items-center justify-center
                                    font-pretendard font-bold text-[15px]
                                    transition-[background-color,border-color,color,scale] duration-150 ease-out
                                    motion-reduce:transition-none active:scale-[0.96]
                                    ${tone.cta}`}>
                    구매하기
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* NFC 태그 */}
      <section className="bg-bg-mute">
        <div className={`${SECTION} py-8 md:py-10 lg:py-12`}>
          <h2 className={H2}>3가지 NFC 태그</h2>
          <div className="mt-5 grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-3">
            {TAGS.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white shadow-depth rounded-2xl p-5">
                <span className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-primary-soft">
                  <Icon size={20} strokeWidth={2} className="text-primary-hover" />
                </span>
                <p className="mt-4 font-pretendard font-bold text-[17px] text-text-pri">
                  {title}
                </p>
                <p className="mt-2 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 흐름 */}
      <section className={`${SECTION} py-8 md:py-10 lg:py-12`}>
        <h2 className={H2}>사용 흐름</h2>
        <ol className="mt-5 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {FLOW.map((step, i) => (
            <li key={step} className="bg-white shadow-depth rounded-xl p-4 flex items-baseline gap-3">
              <span className="font-pretendard font-bold text-[15px] text-primary tabular-nums shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-pretendard font-medium text-[15px] text-text-pri leading-relaxed">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* 스탬프 7단계. 원과 라벨을 한 격자에 정렬한다 */}
      <section className="bg-bg-mute">
        <div className={`${SECTION} py-8 md:py-10 lg:py-12`}>
          <h2 className={H2}>스탬프 일곱 단계</h2>
          <p className="mt-2 font-pretendard font-medium text-[15px] text-text-sec leading-relaxed">
            저녁에 시작해 다음 날 아침에 끝난다. 일곱 개를 다 모으면 하룻밤이 완성된다
          </p>
          <ol className="mt-6 grid grid-cols-4 md:grid-cols-7 gap-x-3 gap-y-5">
            {STAMPS.map((s, i) => (
              <li key={s} className="flex flex-col items-center text-center">
                <span className="w-12 h-12 inline-flex items-center justify-center rounded-full
                                 bg-white border-2 border-primary
                                 font-pretendard font-bold text-[15px] text-primary-hover tabular-nums">
                  {i + 1}
                </span>
                <span className="mt-2 font-pretendard font-semibold text-[13px] text-text-pri leading-tight">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${SECTION} py-8 md:py-10 lg:py-14`}>
        <h2 className={H2}>자주 묻는 질문</h2>
        <div className="mt-5 shadow-depth rounded-2xl bg-white overflow-hidden">
          {FAQ.map((item, i) => (
            <div key={item.q} className="border-t border-border-sub first:border-t-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full min-h-14 px-5 py-4 flex items-center justify-between gap-4 text-left
                           hover:bg-bg-mute
                           transition-[background-color] duration-150 motion-reduce:transition-none">
                <span className="font-pretendard font-semibold text-[15px] text-text-pri">{item.q}</span>
                <ChevronDown size={20}
                  className={`shrink-0 text-text-meta transition-transform duration-150 motion-reduce:transition-none
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
      </section>
    </div>
  )
}
