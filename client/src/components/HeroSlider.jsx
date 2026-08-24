import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSlider({ slides = [] }) {
  const [idx, setIdx] = useState(0)
  const total = slides.length

  useEffect(() => {
    if (total === 0) return
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000)
    return () => clearInterval(t)
  }, [total])

  if (total === 0) return null
  const slide = slides[idx]

  const go = (dir) => setIdx((i) => (i + dir + total) % total)

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] xl:aspect-[21/9]">
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[400ms] ease-out"
            style={{ opacity: i === idx ? 1 : 0 }}>
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-end">
          <div className="container-page
                          pb-10 md:pb-16 lg:pb-20">
            <h1 className="font-pretendard font-bold text-white tracking-[-0.02em]
                           text-[28px] md:text-[40px] lg:text-[56px] 4xl:text-[72px]
                           leading-tight">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-3 font-pretendard font-normal text-white/90
                            text-[16px] md:text-[17px] lg:text-[18px]">
                {slide.subtitle}
              </p>
            )}
          </div>
        </div>

        <button
          aria-label="이전"
          onClick={() => go(-1)}
          className="hidden md:inline-flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2
                     w-12 h-12 rounded-full bg-black/40 hover:bg-black/60
                     items-center justify-center transition-colors duration-150">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <button
          aria-label="다음"
          onClick={() => go(1)}
          className="hidden md:inline-flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2
                     w-12 h-12 rounded-full bg-black/40 hover:bg-black/60
                     items-center justify-center transition-colors duration-150">
          <ChevronRight size={24} className="text-white" />
        </button>

        <div className="absolute bottom-4 right-5 md:bottom-6 md:right-8
                        font-pretendard font-medium text-[14px] text-white tracking-[0.06em]">
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>
    </section>
  )
}
