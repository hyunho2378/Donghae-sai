import clsx from 'clsx'

export default function IconButton({ icon: Icon, label, size = 24, className, ...rest }) {
  return (
    <button
      aria-label={label}
      className={clsx(
        'w-10 h-10 inline-flex items-center justify-center',
        'rounded-full hover:bg-bg-card',
        'transition-colors duration-150',
        className
      )}
      {...rest}>
      <Icon size={size} className="text-text-pri" />
    </button>
  )
}
