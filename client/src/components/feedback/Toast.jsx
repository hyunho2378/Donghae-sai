import { useEffect } from 'react'

export default function Toast({ message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onClose?.(), duration)
    return () => clearTimeout(t)
  }, [message, duration, onClose])

  if (!message) return null
  return (
    <div role="status" aria-live="polite"
         className="fixed top-[calc(5rem+env(safe-area-inset-top))] right-5 z-50
                    px-5 py-4 max-w-[calc(100vw-40px)] md:right-6 md:max-w-[360px]
                    bg-text-strong text-white
                    font-pretendard font-medium text-[15px]
                    rounded-xl">
      {message}
    </div>
  )
}
