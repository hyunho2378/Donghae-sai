import clsx from 'clsx'

export default function LoadingSkeleton({ variant = 'card', count = 1 }) {
  if (variant === 'line') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-bg-card animate-pulse rounded-md" />
        ))}
      </div>
    )
  }
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className={clsx('aspect-[4/3] bg-bg-card animate-pulse rounded-xl')} />
          <div className="pt-4 space-y-2">
            <div className="h-3 w-1/3 bg-bg-card animate-pulse rounded-md" />
            <div className="h-5 w-3/4 bg-bg-card animate-pulse rounded-md" />
            <div className="h-4 w-1/2 bg-bg-card animate-pulse rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
