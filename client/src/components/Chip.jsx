import clsx from 'clsx'

export default function Chip({ label, isSelected = false, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'h-11 md:h-10 px-4 rounded-full whitespace-nowrap',
        'font-pretendard font-semibold text-[15px]',
        'transition-colors duration-150',
        isSelected
          ? 'bg-accent text-white border border-accent'
          : 'bg-white text-text-pri border border-border-def hover:border-primary',
        className
      )}>
      {label}
    </button>
  )
}
