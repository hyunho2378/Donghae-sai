import { Children, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// KAREUM_MIRROR 2-2. 공용 가로 캐러셀
// transform 슬라이드 대신 네이티브 scroll-snap 을 쓴다. 반응형과 접근성에 안전하다
// controls side 는 좌우 화살표, bottom 은 하단 인디케이터와 화살표
export default function Carousel({
  children,
  itemClassName = '',
  className = '',
  gapClassName = 'gap-4 md:gap-6',
  controls = 'side',
  label = '캐러셀'
}) {
  const ref = useRef(null)
  const [idx, setIdx] = useState(0)
  const items = Children.toArray(children)
  const total = items.length

  const behavior = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

  const go = (dir) => {
    const el = ref.current
    if (!el) return
    const next = Math.min(Math.max(idx + dir, 0), total - 1)
    el.children[next]?.scrollIntoView({ behavior: behavior(), inline: 'start', block: 'nearest' })
  }

  // 스크롤 위치에서 현재 아이템을 되읽는다. 스와이프와 화살표가 같은 값을 본다
  const onScroll = () => {
    const el = ref.current
    if (!el) return
    let near = 0
    let best = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const d = Math.abs(el.children[i].offsetLeft - el.scrollLeft - el.clientLeft)
      if (d < best) { best = d; near = i }
    }
    setIdx(near)
  }

  const arrow = (dir, position) => (
    <button
      type="button"
      aria-label={dir < 0 ? '이전' : '다음'}
      onClick={() => go(dir)}
      className={`w-12 h-12 rounded-full bg-black/40 hover:bg-black/60
                  items-center justify-center transition-colors duration-150 ${position}`}>
      {dir < 0
        ? <ChevronLeft size={24} className="text-white" />
        : <ChevronRight size={24} className="text-white" />}
    </button>
  )

  return (
    <div className="relative">
      <ul
        ref={ref}
        onScroll={onScroll}
        aria-label={label}
        className={`relative flex ${gapClassName} overflow-x-auto scrollbar-hide
                    snap-x snap-mandatory ${className}`}>
        {items.map((child, i) => (
          <li key={i} className={`snap-start shrink-0 ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>

      {total > 1 && controls === 'side' && (
        <>
          {arrow(-1, 'hidden md:inline-flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2')}
          {arrow(1, 'hidden md:inline-flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2')}
        </>
      )}

      {total > 1 && controls === 'bottom' && (
        <div className="mt-6 flex items-center justify-between">
          <span className="font-pretendard font-medium text-[14px] text-text-meta tracking-[0.06em] tabular-nums">
            {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="flex gap-3">
            {arrow(-1, 'inline-flex')}
            {arrow(1, 'inline-flex')}
          </div>
        </div>
      )}
    </div>
  )
}
