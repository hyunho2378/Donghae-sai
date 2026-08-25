import clsx from 'clsx'

export default function Input({ label, error, className, type = 'text', ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="block font-pretendard font-medium text-[14px] text-text-pri mb-2">
          {label}
        </span>
      )}
      <input
        type={type}
        className={clsx(
          'w-full h-12 px-4',
          'bg-white rounded-lg',
          'font-pretendard font-normal text-[16px] text-text-pri',
          'placeholder:text-text-ter',
          'focus:outline-none focus:border-2 focus:border-primary',
          'transition-colors duration-150',
          error ? 'border-2 border-red-600' : 'border border-border-def',
          className
        )}
        {...rest} />
      {error && (
        <span className="mt-1 block font-pretendard font-medium text-[12px] text-red-600">{error}</span>
      )}
    </label>
  )
}
