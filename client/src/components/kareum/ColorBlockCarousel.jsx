import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Carousel from './Carousel'
import Eyebrow from '../Eyebrow'

// KAREUM_MIRROR 2-7. 프로그램 시그니처 컬러블록 캐러셀
// 색은 1-3 규칙대로 프라이머리 계열만 쓴다. 프로그램마다 색을 바꾸지 않는다
export default function ColorBlockCarousel({ items = [] }) {
  if (items.length === 0) return null

  return (
    <section className="w-full bg-primary-soft">
      <div className="container-page
                      pt-8 pb-12 md:pb-18 lg:pb-24 4xl:pb-32">
        <Carousel controls="bottom" itemClassName="w-full" gapClassName="gap-0" label="프로그램">
          {items.map((p, i) => {
            // 이름 앞머리 번호를 아이브로우로 올리고 제목은 이름만 남긴다
            const m = p.name.match(/^(\d+)\s+(.*)$/)
            const num = m ? m[1] : null
            const title = m ? m[2] : p.name
            return (
              <article key={p.id} className="grid gap-6 md:gap-10 lg:gap-14 md:grid-cols-2 md:items-center">
                <div className="overflow-hidden rounded-2xl shadow-card bg-bg-card">
                  {/* 첫 슬라이드는 진입 즉시 떠야 한다. 나머지만 지연 로드한다 */}
                  <img src={p.main_image} alt={p.name}
                       loading={i === 0 ? 'eager' : 'lazy'}
                       fetchpriority={i === 0 ? 'high' : undefined}
                       className="w-full aspect-[16/9] object-cover" />
                </div>

                <div>
                  <Eyebrow className="flex items-center gap-1.5">
                    <MapPin size={16} strokeWidth={2} className="text-primary" />
                    {num ? `PROGRAM ${num}` : 'PROGRAM'}
                    {p.region && <span className="text-text-meta">{p.region}</span>}
                  </Eyebrow>

                  <h3 className="mt-4 font-pretendard font-bold
                                 text-[22px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                                 tracking-[-0.02em] leading-tight text-text-pri line-clamp-2">
                    {title}
                  </h3>

                  <p className="mt-4 font-pretendard font-normal
                                text-[15px] md:text-[16px] 4xl:text-[17px]
                                tracking-[-0.01em] leading-relaxed text-text-sec line-clamp-2">
                    {p.short_description}
                  </p>

                  {p.tags?.length > 0 && (
                    <p className="mt-4 font-pretendard font-medium text-[13px] text-text-meta">
                      {p.tags.map((t) => `#${t}`).join(' ')}
                    </p>
                  )}

                  <Link to={`/packages/${p.id}`}
                        className="mt-6 h-12 lg:h-14 px-6 lg:px-8
                                   bg-primary text-white
                                   font-pretendard font-bold text-[16px]
                                   rounded-lg inline-flex items-center
                                   hover:bg-primary-hover
                                   transition-[background-color,scale] duration-150 ease-out
                                   motion-reduce:transition-none active:scale-[0.96]">
                    자세히 보기
                  </Link>
                </div>
              </article>
            )
          })}
        </Carousel>
      </div>
    </section>
  )
}
