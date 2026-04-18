import { forwardRef } from 'react'
import clsx from 'clsx'

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = 'btn-base font-semibold transition-all duration-200'

  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:bg-slate-50',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 disabled:bg-accent-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
    ghost: 'text-slate-900 hover:bg-slate-100 disabled:text-slate-300',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
