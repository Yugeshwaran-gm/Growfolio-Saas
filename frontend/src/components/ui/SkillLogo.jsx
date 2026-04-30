import { useState } from 'react'

export default function SkillLogo({ src, name, size = 28, className = '' }) {
  const [errored, setErrored] = useState(false)

  const sizeClass = typeof size === 'number' ? `${size}px` : size

  if (!src || errored) {
    return (
      <div
        className={className}
        style={{ width: sizeClass, height: sizeClass, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
      >
        <span className="text-sm font-bold text-slate-700">{(name || '').slice(0, 2).toUpperCase()}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      src={src}
      alt={`${name} logo`}
      onError={() => setErrored(true)}
      className={className}
      style={{ width: sizeClass, height: sizeClass, objectFit: 'contain' }}
    />
  )
}
