import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { isDemoOn, setDemoOn } from './demoFlag'
import { createKit, STOP } from './demoKit'
import { runDemo } from './demoScript'

// ?demo=1 로 들어오면 카운트다운 뒤 서비스 흐름을 자동으로 시연한다.
// 화면 녹화용이다. 가짜 커서와 하단 자막만 얹고 서비스 화면은 건드리지 않는다.
// 주소 옵션: wait=5(시작 전 초) speed=1(배속 0.5~3) cap=0(자막 끄기). Esc 로 중단한다
let currentRun = 0

export default function DemoDirector() {
  const navigate = useNavigate()
  const [on, setOn] = useState(isDemoOn())
  const [count, setCount] = useState(null)
  const [cap, setCap] = useState(null)
  const cursorRef = useRef(null)
  const layerRef = useRef(null)

  useEffect(() => {
    if (!isDemoOn()) return undefined
    const runId = ++currentRun
    const q = new URLSearchParams(window.location.search)
    const speed = Math.max(0.5, Math.min(3, Number(q.get('speed')) || 1))
    const wait = q.get('wait') !== null && Number(q.get('wait')) >= 0 ? Number(q.get('wait')) : 5
    const showCap = q.get('cap') !== '0'
    let stopped = false
    const onKey = (e) => { if (e.key === 'Escape') stopped = true }
    window.addEventListener('keydown', onKey)
    document.documentElement.classList.add('dhs-demo')

    const teardown = () => {
      document.documentElement.classList.remove('dhs-demo')
      window.removeEventListener('keydown', onKey)
      setDemoOn(false)
      setCount(null)
      setCap(null)
      setOn(false)
    }

    ;(async () => {
      try {
        const kit = createKit({
          cursor: cursorRef.current,
          layer: layerRef.current,
          speed,
          isStopped: () => stopped || runId !== currentRun
        })
        for (let i = wait; i > 0; i--) { setCount(i); await kit.sleepReal(1000) }
        setCount(null)
        await runDemo({
          kit,
          navigate,
          auth: useAuthStore,
          count: setCount,
          cap: (chip, text) => { if (showCap) setCap({ chip, text }) }
        })
        await kit.sleep(400)
        teardown()
      } catch (e) {
        if (e !== STOP) console.error('[demo]', e)
        // 개발 모드에서 효과가 두 번 실행될 때 앞선 실행이 뒤 실행을 지우지 않게 한다
        if (runId === currentRun) teardown()
      }
    })()

    return () => { stopped = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!on) return null
  return (
    <div ref={layerRef} className="fixed inset-0 z-[200] pointer-events-none" aria-hidden="true">
      {count !== null && (
        <div className="absolute left-1/2 top-24 -translate-x-1/2 flex items-center gap-3
                        h-12 pl-4 pr-5 rounded-full bg-white shadow-float">
          <span className="w-7 h-7 rounded-full bg-primary text-white inline-flex items-center justify-center
                           font-pretendard font-bold text-[14px] tabular-nums">{count}</span>
          <span className="font-pretendard font-semibold text-[14px] text-text-pri">
            동해사이 시연이 곧 시작됩니다
          </span>
        </div>
      )}

      <div ref={cursorRef} className="absolute left-0 top-0 will-change-transform"
        style={{ transform: 'translate(-100px,-100px)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" style={{ transformOrigin: '4px 2px', filter: 'drop-shadow(0 2px 3px rgba(16,16,16,.28))' }}>
          <path d="M4 2 L4 20 L8.5 15.8 L11.6 22.4 L14.2 21.2 L11.1 14.8 L17.5 14.8 Z"
            fill="#242426" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>

      {cap && (
        <div key={`${cap.chip}${cap.text}`}
          className="absolute left-8 bottom-8 flex items-center gap-3 h-12 pl-3 pr-5
                     rounded-full bg-white shadow-float animate-[dhsCap_.35s_ease-out]">
          {cap.chip && (
            <span className="h-7 px-3 rounded-full bg-primary-soft text-primary-hover inline-flex items-center
                             font-pretendard font-bold text-[12px] tracking-[0.06em]">
              {cap.chip}
            </span>
          )}
          <span className="font-pretendard font-semibold text-[15px] text-text-pri tracking-[-0.01em]">
            {cap.text}
          </span>
        </div>
      )}
    </div>
  )
}
