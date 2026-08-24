import { useState, useEffect } from 'react'

// 답변을 기다리는 동안 문구가 돌아간다. 첫 토큰이 오면 부모가 실제 답변으로 갈아끼운다
const PHRASES = ['동해 자료 찾는 중', '코스 살펴보는 중', '답변 정리하는 중']
const ROTATE_MS = 2200

export default function AnswerSkeleton({ compact = false }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setStep((v) => (v + 1) % PHRASES.length), ROTATE_MS)
    return () => clearInterval(timer)
  }, [])

  const bar = compact ? 'h-2.5' : 'h-3'

  return (
    <div aria-live="polite" aria-label="답변 생성 중">
      <p className={`font-pretendard font-medium text-text-sec
                     ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
        {PHRASES[step]}
      </p>
      <div className={`mt-3 space-y-2 ${compact ? 'max-w-[200px]' : 'max-w-[560px]'}`}>
        <div className={`skeleton-bar rounded-md w-full ${bar}`} />
        <div className={`skeleton-bar skeleton-bar-2 rounded-md w-full ${bar}`} />
        <div className={`skeleton-bar skeleton-bar-3 rounded-md w-[70%] ${bar}`} />
      </div>
    </div>
  )
}
