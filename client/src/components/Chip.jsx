import clsx from 'clsx'

export default function Chip({ label, isSelected = false, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'h-9 px-4 rounded-full whitespace-nowrap',
        'font-pretendard font-medium text-[14px]',
        'transition-colors duration-150',
        isSelected
          ? 'bg-primary text-white border border-primary'
          : 'bg-white text-text-pri border border-border-def hover:border-primary',
        className
      )}>
      {label}
    </button>
  )
}
