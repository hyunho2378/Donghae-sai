import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BedDouble, Binoculars, Check, Download, Nfc, Utensils, Waves } from 'lucide-react'
import Eyebrow from '../components/Eyebrow'
import NfcStampDemo from '../components/pass/NfcStampDemo'
import { STAMPS } from '../lib/format'

// 발표 시연용 가짜 데이터다. NFC 실물 태그와 NeonDB를 연결하기 전까지 이 값을 쓴다
// STAY EAT PLAY 세 카테고리를 먼저 모았고 SEE만 남은 상황이다
const DEMO = {
  collected: ['stay', 'eat', 'play'],
  log: [
    { stamp: 'stay', place: '103LAB 게스트하우스', at: '2026.08.24 14:20' },
    { stamp: 'play', place: '도째비골 스카이밸리', at: '2026.08.24 16:05' },
    { stamp: 'eat', place: '거동탕수육', at: '2026.08.24 20:40' }
  ]
}

const ICON = { stay: BedDouble, eat: Utensils, play: Waves, see: Binoculars }
// 카테고리 진행 표는 STAMPS 하나로만 만든다
function categoryView(done) {
  return STAMPS.map((s) => ({ label: s.label, Icon: ICON[s.id], complete: done.has(s.id) }))
}

export default function PassPage() {
  // /pass?nfc=tap|stamp|next 로 들어오면 해당 화면을 바로 연다(발표와 스크린샷용). hold=1 이면 자동 전환을 멈춘다
  const [params] = useSearchParams()
  const nfcParam = params.get('nfc')
  const hold = params.get('hold') === '1'
  const [showNfcDemo, setShowNfcDemo] = useState(!!nfcParam)
  const [demoKey, setDemoKey] = useState(0)
  const done = new Set(DEMO.collected)
  const total = STAMPS.length
  const categories = categoryView(done)

  // 시연용. 패스 화면을 연 뒤 7초가 지나면 가게 스티커를 태그한 상황을 띄운다
  useEffect(() => {
    if (nfcParam) return undefined
    const timer = window.setTimeout(() => setShowNfcDemo(true), 7000)
    return () => window.clearTimeout(timer)
  }, [nfcParam])

  const replayNfc = () => { setDemoKey((k) => k + 1); setShowNfcDemo(true) }

  return (
    <div className="page-enter container-page
                    py-8 lg:py-12">
      <Eyebrow>나의 패스</Eyebrow>
      <h1 className="mt-3 type-page-title text-text-pri">
        내 패스
      </h1>
      <p className="mt-2 font-pretendard font-medium text-[15px] md:text-[16px] text-text-sec leading-relaxed">
        가게에서 태그할 때마다 스탬프가 하나씩 쌓여요. 네 개를 모두 모으면 무코 굿즈를 받아요.
      </p>

      <div className="mt-8 grid gap-6 md:gap-10 lg:grid-cols-[480px_1fr]">
        <div>
          <img src="/images/pass/pass.png" alt="동해사이 묵호 패스"
            className="w-full h-auto drop-shadow-xl" />
          <a href="/images/pass/pass.png" download="donghaesai-mukho-pass.png"
            className="mt-4 inline-flex items-center gap-2 min-h-11 px-4
                       bg-white text-text-pri border border-border-def
                       font-pretendard font-medium text-[14px]
                       rounded-lg hover:border-primary transition-colors duration-150
                       motion-reduce:transition-none">
            <Download size={16} />
            카드 이미지 저장
          </a>
          <button type="button" onClick={replayNfc}
            className="mt-4 ml-2 inline-flex items-center gap-2 min-h-11 px-4
                       bg-primary text-white
                       font-pretendard font-bold text-[14px]
                       rounded-lg hover:bg-primary-hover transition-colors duration-150
                       motion-reduce:transition-none">
            <Nfc size={16} />
            NFC 태그 체험
          </button>

        <section className="mt-6 bg-white shadow-depth rounded-2xl p-5">
        <p className="font-pretendard font-bold text-[17px] text-text-pri tracking-[-0.02em]">
          아직 안 찍은 스탬프
        </p>
        <p className="mt-2 font-pretendard font-medium text-[15px] text-text-pri leading-relaxed">
          {STAMPS.filter((s) => !done.has(s.id)).map((s) => s.label).join(', ') || '모두 모았어요'}
        </p>
        <Link to="/packages"
          className="mt-5 inline-flex items-center justify-center min-h-11 px-5
                     bg-primary-hover text-white rounded-lg
                     font-pretendard font-medium text-[15px]
                     hover:bg-primary transition-colors duration-150 motion-reduce:transition-none">
          코스 보러 가기
        </Link>
        </section>
        </div>

        <div className="space-y-8 md:space-y-10">
          <section className="rounded-2xl bg-bg-card p-5 md:p-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="type-section-title text-text-pri">
                스탬프 여권
              </h2>
              <p className="font-pretendard font-bold text-[17px] text-primary-hover tabular-nums">
                {done.size} / {total}
              </p>
            </div>

            <p className="font-pretendard font-medium text-[14px] text-text-sec text-pretty">
              머문 곳의 경험을 모아 다음 동해사이로 이어가요
            </p>

            <div className="mt-5 grid grid-cols-4 gap-1" aria-label="스탬프 카테고리 진행 상황">
              {categories.map(({ label, Icon, complete }) => (
                <div key={label} className={`relative flex flex-col items-center ${complete ? 'text-primary-hover' : 'text-text-ter'}`}>
                  <div className={`relative w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center
                                   ${complete ? 'border-primary bg-primary-soft' : 'border-border-def'}`}>
                    <Icon size={22} strokeWidth={2.2} />
                    {complete && (
                      <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-primary-hover text-white flex items-center justify-center">
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className="mt-2 font-pretendard font-bold text-[11px] tracking-[0.04em]">{label}</span>
                </div>
              ))}
            </div>

            <p className="mt-5 font-pretendard font-medium text-[14px] text-text-sec leading-relaxed text-pretty">
              네 카테고리를 모두 모으면 완주 스탬프가 열리고 무코 굿즈를 받아요.
            </p>
          </section>

          <section>
            <h2 className="type-section-title text-text-pri mb-4">
              방문 기록
            </h2>
            <ul className="divide-y divide-border-sub shadow-card rounded-xl">
              {DEMO.log.length === 0 ? (
                <li className="px-5 py-4 font-pretendard font-normal text-[14px] text-text-meta">
                  아직 태그한 기록이 없어요
                </li>
              ) : DEMO.log.map((r) => {
                const stamp = STAMPS.find((s) => s.id === r.stamp)
                return (
                  <li key={`${r.stamp}-${r.at}`} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-pretendard font-medium text-[15px] text-text-pri truncate">{r.place}</p>
                      <p className="mt-0.5 font-pretendard font-medium text-[13px] text-text-sec tabular-nums">{r.at}</p>
                    </div>
                    <span className="shrink-0 font-pretendard font-medium text-[12px] text-primary
                                     bg-primary-soft px-2.5 py-1 rounded-md">
                      {stamp?.label} 스탬프
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 font-pretendard font-normal text-[13px] text-text-meta leading-relaxed">
              방문 기록은 익명 패스 번호에만 남아요. 이름과 전화번호는 받지 않아요.
            </p>
          </section>
        </div>
      </div>
      {showNfcDemo && (
        <NfcStampDemo key={demoKey} initialStage={demoKey ? 'tap' : (nfcParam || 'tap')} hold={!demoKey && hold}
          onClose={() => setShowNfcDemo(false)} />
      )}
    </div>
  )
}
