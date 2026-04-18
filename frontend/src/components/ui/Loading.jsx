import clsx from 'clsx'

export function Loading({ size = 'md', message = 'Loading...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={clsx(
          'animate-spin rounded-full border-4 border-slate-200 border-t-primary-500',
          sizes[size]
        )}
      />
      {message && <p className="mt-4 text-slate-600">{message}</p>}
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Loading size="lg" message="Loading..." />
    </div>
  )
}
