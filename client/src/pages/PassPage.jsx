import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Binoculars, Check, Download, MapPin, Star, Utensils, Waves, Gift } from 'lucide-react'
import Eyebrow from '../components/Eyebrow'
import NfcStampDemo from '../components/pass/NfcStampDemo'
import { STAMPS } from '../lib/format'

// 발표 시연용 가짜 데이터다. NFC 실물 태그와 NeonDB를 연결하기 전까지 이 값을 쓴다
const DEMO = {
  collected: ['mukho', 'cheongok', 'mangsang', 'starlight'],
  log: [
    { stamp: 'mukho', place: '논골담길', at: '2026.08.24 14:20' },
    { stamp: 'cheongok', place: '천곡황금박쥐동굴', at: '2026.08.24 16:05' },
    { stamp: 'starlight', place: '한섬 별빛 타임', at: '2026.08.24 20:40' },
    { stamp: 'mangsang', place: '망상해변', at: '2026.08.25 09:10' }
  ]
}

const ICON = { region: MapPin, starlight: Star, complete: Gift }
const CATEGORIES = [
  { label: 'STAY', Icon: BedDouble, complete: true },
  { label: 'EAT', Icon: Utensils, complete: true, current: true },
  { label: 'PLAY', Icon: Waves, complete: true },
  { label: 'SEE', Icon: Binoculars, complete: true }
]

export default function PassPage() {
  const [showNfcDemo, setShowNfcDemo] = useState(false)
  const done = new Set(DEMO.collected)
  const total = STAMPS.length

  useEffect(() => {
    const timer = window.setTimeout(() => setShowNfcDemo(true), 7000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="page-enter container-page
                    py-8 lg:py-12">
      <Eyebrow>나의 패스</Eyebrow>
      <h1 className="mt-3 type-page-title text-text-pri">
        내 패스
      </h1>
      <p className="mt-2 font-pretendard font-medium text-[15px] md:text-[16px] text-text-sec leading-relaxed">
        권역에서 태그할 때마다 스탬프가 하나씩 쌓여요. 일곱 개를 모두 모으면 문어 굿즈를 받아요.
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

        <section className="mt-6 bg-white shadow-depth rounded-2xl p-5">
        <p className="font-pretendard font-bold text-[17px] text-text-pri tracking-[-0.02em]">
          아직 안 모은 권역
        </p>
        <p className="mt-2 font-pretendard font-medium text-[15px] text-text-pri leading-relaxed">
          {STAMPS.filter((s) => s.kind === 'region' && !done.has(s.id)).map((s) => s.label).join(', ') || '모두 모았어요'}
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

            <div className="mt-5 grid grid-cols-4 gap-1" aria-label="여행 카테고리 진행 상황">
              {CATEGORIES.map(({ label, Icon, complete, current }) => (
                <div key={label} className={`relative flex flex-col items-center ${current ? 'text-accent' : complete ? 'text-primary-hover' : 'text-text-ter'}`}>
                  <div className={`relative w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center
                                   ${current ? 'border-primary text-accent' : complete ? 'border-primary bg-primary-soft' : 'border-border-def'}`}>
                    <Icon size={22} strokeWidth={2.2} />
                    {complete && (
                      <span className={`absolute -right-1 -top-1 w-5 h-5 rounded-full text-white flex items-center justify-center
                                        ${current ? 'bg-primary' : 'bg-primary-hover'}`}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className="mt-2 font-pretendard font-bold text-[11px] tracking-[0.04em]">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border-sub pt-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-pretendard font-bold text-[15px] text-text-pri">지역 스탬프</p>
                <p className="font-pretendard font-medium text-[13px] text-text-meta tabular-nums">{done.size}곳 완료</p>
              </div>
            <ul className="mt-4 grid grid-cols-4 md:grid-cols-7 gap-x-2 gap-y-4 md:gap-4">
              {STAMPS.map((s) => {
                const Icon = ICON[s.kind]
                const filled = done.has(s.id)
                return (
                  <li key={s.id} className="flex flex-col items-center text-center">
                    <div
                      aria-label={`${s.label} ${filled ? '완료' : '미완료'}`}
                      className={`relative w-11 h-11 md:w-12 md:h-12 rounded-full border-2
                                  flex items-center justify-center
                                  ${filled
                                    ? 'border-primary bg-primary-soft text-primary-hover'
                                    : 'border-border-def bg-white text-text-ter'}`}>
                      <Icon size={20} strokeWidth={2} />
                      {filled && (
                        <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 font-pretendard text-[12px] md:text-[13px] leading-tight
                                   ${filled ? 'font-medium text-text-pri' : 'font-normal text-text-meta'}`}>
                      {s.label}
                    </p>
                  </li>
                )
              })}
            </ul>
            </div>

            <p className="mt-5 font-pretendard font-medium text-[14px] text-text-sec leading-relaxed text-pretty">
              권역 다섯 곳과 별빛 콘텐츠를 모으면 완주 스탬프가 열리고 무코 굿즈를 받아요.
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
      {showNfcDemo && <NfcStampDemo onClose={() => setShowNfcDemo(false)} />}
    </div>
  )
}
