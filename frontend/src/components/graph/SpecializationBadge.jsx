function getBadgeStyle(level) {
  const normalized = (level || '').toLowerCase()

  if (normalized === 'high') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  if (normalized === 'moderate') {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }

  return 'bg-slate-100 text-slate-700 border-slate-200'
}

function normalizeLabel(level) {
  if (!level) {
    return 'Broad'
  }

  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
}

export default function SpecializationBadge({ level, topSkill, compact = false }) {
  const classes = getBadgeStyle(level)
  const label = normalizeLabel(level)

  if (compact) {
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${classes}`}>
        {label}
      </span>
    )
  }

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${classes}`}>
      <span>Specialization: {label}</span>
      {topSkill ? <span className="text-xs opacity-80">Top skill: {topSkill}</span> : null}
    </div>
  )
}
