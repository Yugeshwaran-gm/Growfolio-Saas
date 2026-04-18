import clsx from 'clsx'

export function ErrorState({ 
  message = 'Something went wrong', 
  onRetry,
  className 
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
      <p className="text-slate-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ 
  message = 'No data found',
  icon = null,
  action = null,
  className 
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon ? (
        icon
      ) : (
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Data</h3>
      <p className="text-slate-600 mb-4">{message}</p>
      {action}
    </div>
  )
}

export function Alert({ 
  type = 'info',
  message,
  onClose,
  className 
}) {
  const typeStyles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  }

  const iconMap = {
    info: '✓',
    success: '✓',
    warning: '!',
    error: '✕',
  }

  return (
    <div
      className={clsx(
        'p-4 rounded-lg border flex items-start gap-3',
        typeStyles[type],
        className
      )}
    >
      <span className="text-xl font-bold">{iconMap[type]}</span>
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-sm font-medium opacity-75 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  )
}
