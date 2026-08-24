import { Link } from 'react-router-dom'
import KareumHeader from './KareumHeader'
import Carousel from './Carousel'

// KAREUM_MIRROR 2-8. 코스 2열 가로 캐러셀
// 데이터에 원가와 할인가 구분 필드가 없어 가격은 단일 표기한다
export default function PackageCarousel({ title, items = [] }) {
  if (items.length === 0) return null

  return (
    <section className="mx-auto w-full
                        px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                        max-w-[1400px] 2xl:max-w-[1600px]
                        py-8">
      <KareumHeader title={title} count={items.length} countLabel="개 코스" />

      <div className="mt-8">
        <Carousel
          label={title}
          className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12
                     xl:-mx-16 xl:px-16 3xl:-mx-24 3xl:px-24 pb-2"
          itemClassName="w-[82%] sm:w-[62%] md:w-[46%] lg:w-[46%] xl:w-[46%]">
          {items.map((p) => {
            const hasPrice = p.price_label && p.price_label !== '확인 안 됨'
            return (
              <Link key={p.id} to={`/packages/${p.id}`} className="group block h-full">
                <article className="flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-border-sub">
                  <div className="relative aspect-[16/9] overflow-hidden bg-bg-card border-b-2 border-primary">
                    {p.main_image && (
                      <img src={p.main_image} alt={p.name} loading="lazy"
                           className="w-full h-full object-cover
                                      transition-transform duration-[600ms] ease-out
                                      motion-reduce:transition-none group-hover:scale-[1.04]" />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-4 lg:p-5">
                    <h3 className="font-pretendard font-bold
                                   text-[17px] md:text-[18px] lg:text-[19px] 4xl:text-[20px]
                                   tracking-[-0.02em] text-text-strong line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="mt-2 font-pretendard font-normal
                                  text-[14px] md:text-[15px]
                                  tracking-[-0.01em] leading-relaxed text-text-sec line-clamp-2">
                      {p.short_description}
                    </p>

                    {p.tags?.length > 0 && (
                      <p className="mt-3 font-pretendard font-medium text-[13px] text-text-meta">
                        {p.tags.map((t) => `#${t}`).join(' ')}
                      </p>
                    )}

                    <p className="mt-auto pt-4 text-right font-pretendard font-bold
                                  text-[16px] tracking-[-0.02em] text-text-strong">
                      {hasPrice ? p.price_label : (
                        <span className="font-light text-[13px] text-text-meta">가격 자료 대기</span>
                      )}
                    </p>
                  </div>
                </article>
              </Link>
            )
          })}
        </Carousel>
      </div>
    </section>
  )
}
