import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
  type = 'text',
  placeholder,
  error,
  disabled = false,
  className,
  label,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'form-input',
          error && 'border-red-500 focus:ring-red-500',
          disabled && 'bg-slate-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
