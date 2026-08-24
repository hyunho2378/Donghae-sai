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
      aria-label={active ? '북마크 해제' : '북마크'}
      onClick={toggle}
      className={clsx(
        'w-10 h-10 inline-flex items-center justify-center rounded-full',
        'transition-colors duration-150',
        onImage ? 'bg-black/40 hover:bg-black/60' : 'hover:bg-bg-card'
      )}>
      <Bookmark
        size={20}
        className={clsx(
          active ? 'text-primary' : (onImage ? 'text-white' : 'text-text-pri')
        )}
        fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
