import clsx from 'clsx'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx('card-base p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={clsx('mb-4 pb-4 border-b border-slate-200', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div
      className={clsx('', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={clsx('mt-4 pt-4 border-t border-slate-200 flex gap-3 justify-end', className)}
      {...props}
    >
      {children}
    </div>
  )
}
