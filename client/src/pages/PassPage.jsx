import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Download, MapPin, Star, Gift } from 'lucide-react'
import html2canvas from 'html2canvas'
import PassCard from '../components/card/PassCard'
import { STAMPS } from '../lib/format'

// 발표 시연용 가짜 데이터다. NFC 실물 태그와 NeonDB를 연결하기 전까지 이 값을 쓴다
const DEMO = {
  userName: '데모 여행자',
  passCode: 'DHS-2026-0824-0137',
  planLabel: '2일권',
  validLabel: '2026년 8월 26일까지 사용',
  collected: ['mukho', 'cheongok', 'mangsang', 'starlight'],
  log: [
    { stamp: 'mukho', place: '논골담길', at: '2026.08.24 14:20' },
    { stamp: 'cheongok', place: '천곡황금박쥐동굴', at: '2026.08.24 16:05' },
    { stamp: 'starlight', place: '한섬 별빛 타임', at: '2026.08.24 20:40' },
    { stamp: 'mangsang', place: '망상해변', at: '2026.08.25 09:10' }
  ]
}

const ICON = { region: MapPin, starlight: Star, complete: Gift }

export default function PassPage() {
  const cardRef = useRef(null)
  const done = new Set(DEMO.collected)
  const total = STAMPS.length

  const onDownload = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null })
    const link = document.createElement('a')
    link.download = `donghaesai-pass-${DEMO.passCode}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                    max-w-[1400px] 2xl:max-w-[1600px]
                    py-8 lg:py-12">
      <h1 className="font-pretendard font-bold
                     text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                     text-text-pri tracking-[-0.02em] leading-tight">
        마이 패스
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
        권역에서 태그할 때마다 스탬프가 쌓인다. 일곱 개를 다 모으면 문어 굿즈를 받는다
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[480px_1fr]">
        <div>
          <PassCard
            ref={cardRef}
            userName={DEMO.userName}
            planLabel={DEMO.planLabel}
            validLabel={DEMO.validLabel}
            collected={done.size}
            total={total}
            passCode={DEMO.passCode} />
          <button
            onClick={onDownload}
            className="mt-4 inline-flex items-center gap-2 min-h-11 px-4
                       bg-white text-text-pri border border-border-def
                       font-pretendard font-medium text-[14px]
                       rounded-lg hover:border-primary transition-colors duration-150
                       motion-reduce:transition-none">
            <Download size={16} />
            카드 이미지 저장
          </button>

        <section className="mt-6 shadow-card rounded-2xl p-6">
        <p className="font-pretendard font-bold text-[17px] text-text-pri tracking-[-0.02em]">
          아직 안 모은 권역
        </p>
        <p className="mt-2 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed">
          {STAMPS.filter((s) => s.kind === 'region' && !done.has(s.id)).map((s) => s.label).join(', ') || '전부 모았다'}
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

        <div className="space-y-10">
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-pretendard font-bold text-[20px] md:text-[22px] lg:text-[24px] text-text-pri tracking-[-0.02em]">
                스탬프
              </h2>
              <p className="font-pretendard font-bold text-[15px] text-primary-hover">
                {done.size} / {total}
              </p>
            </div>

            <div className="h-1 w-full rounded-full bg-bg-mute overflow-hidden">
              <div className="h-full bg-primary-hover transition-[width] duration-300 motion-reduce:transition-none"
                   style={{ width: `${(done.size / total) * 100}%` }} />
            </div>

            <ul className="mt-6 grid grid-cols-4 md:grid-cols-7 gap-3 md:gap-4">
              {STAMPS.map((s) => {
                const Icon = ICON[s.kind]
                const filled = done.has(s.id)
                return (
                  <li key={s.id} className="text-center">
                    <div
                      title={s.note}
                      className={`aspect-square w-full min-w-11 rounded-full border-2
                                  inline-flex items-center justify-center
                                  ${filled
                                    ? 'border-primary bg-primary-soft text-primary-hover'
                                    : 'border-border-def bg-white text-text-ter'}`}>
                      <Icon size={20} strokeWidth={filled ? 2 : 1.5} />
                    </div>
                    <p className={`mt-2 font-pretendard text-[13px]
                                   ${filled ? 'font-medium text-text-pri' : 'font-light text-text-meta'}`}>
                      {s.label}
                    </p>
                  </li>
                )
              })}
            </ul>

            <p className="mt-5 font-pretendard font-light text-[13px] text-text-meta leading-relaxed">
              권역 다섯 곳과 별빛 콘텐츠를 모으면 완주 스탬프가 열린다. 완주 보상은 문어 굿즈다
            </p>
          </section>

          <section>
            <h2 className="font-pretendard font-bold text-[20px] md:text-[22px] lg:text-[24px] text-text-pri tracking-[-0.02em] mb-4">
              방문 기록
            </h2>
            <ul className="divide-y divide-border-sub shadow-card rounded-xl">
              {DEMO.log.length === 0 ? (
                <li className="px-5 py-4 font-pretendard font-light text-[14px] text-text-meta">
                  아직 태그한 기록이 없습니다
                </li>
              ) : DEMO.log.map((r) => {
                const stamp = STAMPS.find((s) => s.id === r.stamp)
                return (
                  <li key={`${r.stamp}-${r.at}`} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-pretendard font-medium text-[15px] text-text-pri truncate">{r.place}</p>
                      <p className="mt-0.5 font-pretendard font-light text-[13px] text-text-meta">{r.at}</p>
                    </div>
                    <span className="shrink-0 font-pretendard font-medium text-[12px] text-primary
                                     bg-primary-soft px-2.5 py-1 rounded-md">
                      {stamp?.label} 스탬프
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 font-pretendard font-light text-[12px] text-text-meta">
              방문 기록은 익명 패스 번호에만 연결된다. 이름과 전화번호는 받지 않는다
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
