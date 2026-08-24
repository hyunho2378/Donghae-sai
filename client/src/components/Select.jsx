import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import clsx from 'clsx'

/**
 * 커스텀 드롭다운. OS 기본 select를 화면에 노출하지 않는다.
 * options는 [{ value, label }] 형태다.
 */
export default function Select({ label, value, options = [], onChange, placeholder = '선택해라', className }) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div className="block" ref={boxRef}>
      {label && (
        <span className="block font-pretendard font-medium text-[14px] text-text-pri mb-2">
          {label}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={clsx(
            'w-full h-12 pl-4 pr-10 flex items-center text-left',
            'bg-white border border-border-def rounded-lg',
            'font-pretendard font-normal text-[16px]',
            current ? 'text-text-pri' : 'text-text-ter',
            'hover:border-primary focus-visible:border-primary',
            'transition-colors duration-150 motion-reduce:transition-none',
            className
          )}>
          {current ? current.label : placeholder}
        </button>
        <ChevronDown size={20}
          className={clsx('absolute right-3 top-1/2 -translate-y-1/2 text-text-meta pointer-events-none',
                          'transition-transform duration-150 motion-reduce:transition-none',
                          open && 'rotate-180')} />
        {open && (
          <ul role="listbox"
              className="absolute z-40 mt-2 w-full max-h-[280px] overflow-y-auto
                         bg-white border border-border-def rounded-lg py-1">
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => { onChange?.(o.value); setOpen(false) }}
                  className={clsx(
                    'w-full min-h-11 px-4 flex items-center justify-between gap-2 text-left',
                    'font-pretendard text-[15px]',
                    o.value === value ? 'text-primary-hover font-medium' : 'text-text-pri font-normal',
                    'hover:bg-bg-card transition-colors duration-150 motion-reduce:transition-none'
                  )}>
                  {o.label}
                  {o.value === value && <Check size={16} className="shrink-0 text-primary-hover" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
