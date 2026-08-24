import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-primary text-white',
  dark: 'bg-black text-white',
  soft: 'bg-primary-soft text-primary'
}

export default function Badge({ variant = 'primary', children, className }) {
  return (
    <span className={clsx(
      'h-[26px] px-2.5 rounded-md inline-flex items-center',
      'font-pretendard font-medium text-[12px]',
      VARIANTS[variant],
      className
    )}>
      {children}
    </span>
  )
}
