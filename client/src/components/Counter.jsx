import { Minus, Plus } from 'lucide-react'

export default function Counter({ count = 1, min = 1, max = 10, onChange }) {
  const dec = () => onChange?.(Math.max(min, count - 1))
  const inc = () => onChange?.(Math.min(max, count + 1))
  return (
    <div className="inline-flex items-center gap-3">
      <button
        aria-label="감소"
        onClick={dec}
        disabled={count <= min}
        className="w-11 h-11 md:w-10 md:h-10 rounded-full border border-border-def
                   inline-flex items-center justify-center
                   hover:border-primary
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150">
        <Minus size={16} className="text-text-pri" />
      </button>
      <span className="w-8 text-center font-pretendard font-medium text-[16px] text-text-pri tabular-nums">
        {count}
      </span>
      <button
        aria-label="증가"
        onClick={inc}
        disabled={count >= max}
        className="w-11 h-11 md:w-10 md:h-10 rounded-full border border-border-def
                   inline-flex items-center justify-center
                   hover:border-primary
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150">
        <Plus size={16} className="text-text-pri" />
      </button>
    </div>
  )
}
