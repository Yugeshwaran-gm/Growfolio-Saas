import React from 'react'

// MaterialIcon: small wrapper for Google Material Symbols.
// Props:
// - name: symbol name string (e.g. 'menu', 'visibility', 'notifications')
// - variant: 'rounded' | 'outlined' (defaults to 'rounded')
// - size: number|string, applied as font-size (defaults to 20)
// - className: additional classes
export default function MaterialIcon({ name, variant = 'rounded', size = 20, className = '', ariaLabel, ...rest }) {
  const family = variant === 'outlined' ? 'material-symbols-outlined' : 'material-symbols-rounded'
  const style = { fontSize: typeof size === 'number' ? `${size}px` : size, lineHeight: 1 }

  return (
    <span
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      className={`${family} inline-flex items-center justify-center ${className}`}
      style={style}
      {...rest}
    >
      {name}
    </span>
  )
}
