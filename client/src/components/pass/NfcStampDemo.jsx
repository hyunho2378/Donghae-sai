import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BedDouble,
  Binoculars,
  Check,
  Navigation,
  Utensils,
  Waves,
  X
} from 'lucide-react'

const CATEGORIES = [
  { label: 'STAY', Icon: BedDouble, active: false },
  { label: 'EAT', Icon: Utensils, active: true },
  { label: 'PLAY', Icon: Waves, active: false },
  { label: 'SEE', Icon: Binoculars, active: false }
]

function CategoryProgress() {
  return (
    <div className="mt-6 grid grid-cols-4 gap-1" aria-label="스탬프 카테고리 진행 상황">
      {CATEGORIES.map(({ label, Icon, active }) => (
        <div key={label} className={`relative flex flex-col items-center ${active ? 'text-accent' : 'text-text-ter'}`}>
          <div className={`relative z-10 w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center
                           ${active ? 'border-primary text-accent' : 'border-border-def'}`}>
            <Icon size={22} strokeWidth={2.2} />
            {active && (
              <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </span>
            )}
          </div>
          <span className="mt-2 font-pretendard font-bold text-[11px] tracking-[0.04em]">{label}</span>
        </div>
      ))}
    </div>
  )
}

function StampResult({ onNext }) {
  return (
    <div className="relative -mt-5 rounded-t-[28px] bg-white px-5 pt-6 pb-7 text-center md:mt-0 md:rounded-none md:px-0 md:py-8">
      <div className="mx-auto w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-card">
        <Check size={32} strokeWidth={3} />
      </div>
      <h2 className="mt-4 font-pretendard font-bold text-[27px] leading-tight tracking-[-0.03em] text-text-pri text-wrap balance">
        <span className="text-accent">EAT</span> 스탬프 획득!
      </h2>
      <p className="mt-2 font-pretendard font-bold text-[16px] text-text-pri">
        <span className="text-primary-hover">거동탕수육</span> 방문 완료
      </p>

      <CategoryProgress />

      <p className="mt-4 inline-flex rounded-full bg-bg-mute px-4 py-2
                    font-pretendard font-bold text-[14px] text-text-pri tabular-nums">
        현재 <span className="mx-1 text-accent">5 / 7</span> 완료
      </p>
      <p className="mt-3 font-pretendard font-medium text-[14px] text-text-sec text-pretty">
        다음 장소를 방문해 새 스탬프를 모아보세요
      </p>
      <button type="button" onClick={onNext}
        className="mt-5 w-full min-h-12 rounded-xl bg-accent text-white
                   inline-flex items-center justify-center gap-2
                   font-pretendard font-bold text-[16px]
                   hover:bg-accent-hover active:scale-[0.96]
                   transition-[background-color,transform] duration-150 motion-reduce:transition-none">
        다음 코스 추천
        <ArrowRight size={18} />
      </button>
    </div>
  )
}

function NextCourse() {
  return (
    <div className="relative -mt-5 rounded-t-[28px] bg-white px-5 pt-6 pb-7 text-center md:mt-0 md:rounded-none md:px-0 md:py-8">
      <h2 className="font-pretendard font-bold text-[25px] leading-tight tracking-[-0.03em] text-text-pri text-wrap balance">
        다음 <span className="text-accent">동해</span><span className="text-primary-hover">사이</span>는<br />어디일까요?
      </h2>

      <article className="mt-5 overflow-hidden rounded-2xl bg-white shadow-depth text-left">
        <img src="/images/places/nongol-damgil.jpg" alt="논골담길 골목 풍경"
          className="w-full aspect-[16/8] object-cover" />
        <div className="p-4">
          <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-1
                           font-pretendard font-bold text-[11px] text-primary-hover tracking-[0.04em]">
            SEE
          </span>
          <h3 className="mt-2 font-pretendard font-bold text-[21px] text-text-pri tracking-[-0.02em]">
            논골담길
          </h3>
          <p className="mt-1 font-pretendard font-medium text-[13px] text-text-sec tabular-nums">
            도보 8분 · 약 550m
          </p>

          <div className="mt-4 rounded-xl bg-bg-mute px-4 py-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
              <span className="mx-2 flex-1 border-t-2 border-dashed border-primary" />
              <span className="w-4 h-4 rounded-full bg-accent shrink-0 ring-4 ring-accent-soft" />
            </div>
            <div className="mt-2 flex justify-between font-pretendard font-medium text-[11px] text-text-meta">
              <span>현재 위치</span>
              <span>논골담길</span>
            </div>
          </div>
        </div>
      </article>

      <p className="mt-4 font-pretendard font-medium text-[14px] leading-relaxed text-text-sec text-pretty">
        해가 지기 전에 골목을 둘러보고 다음 코스로 이어가 보세요
      </p>
      <Link to="/stays/sai-004"
        className="mt-5 w-full min-h-12 rounded-xl bg-accent text-white
                   inline-flex items-center justify-center gap-2
                   font-pretendard font-bold text-[16px]
                   hover:bg-accent-hover active:scale-[0.96]
                   transition-[background-color,transform] duration-150 motion-reduce:transition-none">
        <Navigation size={18} fill="currentColor" />
        길찾기
      </Link>
      <Link to="/packages"
        className="mt-2 w-full min-h-11 rounded-xl border border-primary text-primary-hover
                   inline-flex items-center justify-center gap-1
                   font-pretendard font-semibold text-[14px]
                   hover:bg-primary-soft transition-colors duration-150 motion-reduce:transition-none">
        다음 코스 보기
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}

export default function NfcStampDemo({ onClose }) {
  const [stage, setStage] = useState('stamp')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto scrollbar-hide bg-bg-card pb-[env(safe-area-inset-bottom)]" role="dialog" aria-modal="true" aria-label="NFC 방문 스탬프 시연">
      <div className="min-h-full md:flex md:items-center md:justify-center md:p-8">
        <section className="relative min-h-[100svh] w-full overflow-hidden bg-white
                            md:min-h-[620px] md:max-w-[1120px] md:grid md:grid-cols-2 md:rounded-[32px] md:shadow-float">
          <button type="button" onClick={onClose} aria-label="NFC 시연 닫기"
            className="absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20 w-11 h-11 rounded-full bg-white/90 text-text-sec md:right-5 md:top-5
                       flex items-center justify-center shadow-card
                       hover:text-text-pri transition-colors duration-150 motion-reduce:transition-none">
            <X size={20} />
          </button>

          <div className={`bg-primary-soft px-5 pt-[calc(1.5rem+env(safe-area-inset-top))] flex flex-col items-center overflow-hidden md:h-auto md:min-h-[620px] md:justify-center md:pt-6
                           ${stage === 'stamp' ? 'h-[330px]' : 'h-[245px]'}`}>
            <img src="/images/logo/logo-wordmark.svg" alt="동해사이"
              className="w-[138px] h-auto md:w-[170px]" />
            <img src="/images/character/muko-main.png" alt="동해사이 캐릭터 무코"
              className={`mt-2 object-contain object-top md:mt-5 ${stage === 'stamp' ? 'w-[260px] md:w-[390px]' : 'w-[190px] md:w-[300px]'}`} />
          </div>

          <div className="md:flex md:items-center md:px-10">
            {stage === 'stamp'
              ? <StampResult onNext={() => setStage('next')} />
              : <NextCourse />}
          </div>
        </section>
      </div>
    </div>
  )
}
