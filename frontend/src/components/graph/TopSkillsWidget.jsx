export default function TopSkillsWidget({ skills = [], limit = 5 }) {
  const topItems = Array.isArray(skills) ? skills.slice(0, limit) : []

  if (topItems.length === 0) {
    return <p className="text-sm text-slate-500">No skill intelligence available yet.</p>
  }

  return (
    <div className="space-y-2">
      {topItems.map((skill) => (
        <div key={skill.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">{skill.name}</p>
            <span className="text-xs font-semibold text-slate-600">{skill.relationship_count} links</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Projects: {Number(skill.project_uses || 0)} | Articles: {Number(skill.article_mentions || 0)}
          </p>
        </div>
      ))}
    </div>
  )
}
