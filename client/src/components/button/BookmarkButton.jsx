import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import clsx from 'clsx'
import { useBookmark } from '../../hooks/useBookmark'

export default function BookmarkButton({ initial = false, onImage = false, onChange, itemId, itemType }) {
  const { isBookmarked, toggle: hookToggle } = useBookmark(itemType, itemId)
  const [localActive, setLocalActive] = useState(initial)

  const active = itemId ? isBookmarked : localActive

  const toggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (itemId) {
      hookToggle()
    } else {
      const next = !localActive
      setLocalActive(next)
      onChange?.(next)
    }
  }

  return (
    <button
      aria-label={active ? '저장 해제' : '저장'}
      onClick={toggle}
      className={clsx(
        'w-11 h-11 md:w-10 md:h-10 inline-flex items-center justify-center rounded-full',
        'transition-colors duration-150',
        onImage ? 'bg-black/40 hover:bg-black/60' : 'hover:bg-bg-card'
      )}>
      <span className={clsx(
        'relative block w-5 h-5',
        active ? 'text-primary' : (onImage ? 'text-white' : 'text-text-pri')
      )}>
        <Bookmark size={20}
          className={clsx(
            'absolute inset-0 transition-[opacity,transform,filter] duration-150 motion-reduce:transition-none',
            active ? 'opacity-0 scale-75 blur-[1px]' : 'opacity-100 scale-100 blur-0'
          )} />
        <Bookmark size={20} fill="currentColor"
          className={clsx(
            'absolute inset-0 transition-[opacity,transform,filter] duration-150 motion-reduce:transition-none',
            active ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-[1px]'
          )} />
      </span>
    </button>
  )
}
