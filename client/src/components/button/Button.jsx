import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-white text-primary border border-primary hover:bg-primary-soft',
  ghost: 'bg-transparent text-text-sec hover:text-text-pri',
  dark: 'bg-black text-white hover:bg-text-strong'
}

const SIZES = {
  sm: 'h-9 px-4 text-[14px]',
  md: 'h-12 lg:h-12 px-6 text-[16px]',
  lg: 'h-14 px-8 text-[18px]'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        'font-pretendard font-medium tracking-[-0.01em] rounded-lg',
        'transition-colors duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
