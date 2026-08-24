import { useEffect, useRef, useState } from 'react'

// KAREUM_MIRROR 2-3. 진입 등장 래퍼. transform과 opacity만 건드린다
export default function RevealOnScroll({ children, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 모션 최소화 설정이면 애니메이션 없이 바로 보인다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        io.disconnect()
      }
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref}
         className={`transition-[opacity,transform] duration-[400ms] ease-out
                     motion-reduce:transition-none
                     ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                     ${className}`}>
      {children}
    </div>
  )
}
