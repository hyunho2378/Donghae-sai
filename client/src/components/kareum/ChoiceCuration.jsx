import RevealOnScroll from './RevealOnScroll'
import KareumHeader from './KareumHeader'

// 카름 초이스 예외 컴포넌트. 테마 큐레이션 해시태그 카드
// CONTENT_GUIDE 테마 3개. 사진은 그 테마에 실제로 속한 장소 사진만 쓴다. 임의로 섞지 않는다
const THEMES = [
  {
    tag: '뚜벅이 혼행',
    desc: '차 없이 대중교통으로 온 혼자 여행자의 1박',
    image: '/images/places/book-village.jpg',
    place: '무릉 책방'
  },
  {
    tag: '아이와 하루 더',
    desc: '4050 가족의 저녁부터 다음 날 아침까지',
    image: '/images/places/dokkaebi-skyvalley.jpg',
    place: '도째비골 스카이밸리'
  },
  {
    tag: '야간 관광',
    desc: '저녁 이후가 비어 있던 동해의 밤을 채우는 코스',
    image: '/images/places/nongol-damgil.jpg',
    place: '논골담길'
  }
]

export default function ChoiceCuration() {
  return (
    <section className="container-page
                        py-12 md:py-16 lg:py-20">
      <RevealOnScroll>
        <KareumHeader title="동해사이 초이스" count={THEMES.length} countLabel="개 테마" />
        <p className="mt-3 font-pretendard font-normal
                      text-[15px] md:text-[16px] text-text-sec tracking-[-0.01em]">
          밤과 머묾의 이유로 묶은 테마 큐레이션
        </p>
      </RevealOnScroll>

      <RevealOnScroll className="mt-8">
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          {THEMES.map((t) => (
            <article key={t.tag}
                     className="group relative overflow-hidden rounded-2xl bg-bg-card">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={t.image} alt={t.place} loading="lazy"
                     className="w-full h-full object-cover
                                transition-transform duration-[600ms] ease-out
                                motion-reduce:transition-none group-hover:scale-[1.04]" />
                {/* 가독성용 오버레이. 전체 어둡게 + 하단 절반 한 번 더(그라데이션 금지라 솔리드 겹침) */}
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/35" />
              </div>
              {/* 텍스트 위치를 카드 간 통일. desc 는 2줄로 고정해 제목 높이를 맞춘다 */}
              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                <p className="font-pretendard font-bold text-[20px] md:text-[22px] text-white tracking-[-0.02em]">
                  #{t.tag.replace(/\s/g, '')}
                </p>
                <p className="mt-2 min-h-[44px] font-pretendard font-normal text-[14px] md:text-[15px] text-white leading-relaxed line-clamp-2">
                  {t.desc}
                </p>
                <p className="mt-3 font-pretendard font-medium text-[12px] text-white/80 tracking-[0.04em]">
                  {t.place}
                </p>
              </div>
            </article>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  )
}
