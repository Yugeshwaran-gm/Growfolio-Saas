import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Alert, EmptyState } from '../../components/ui/States'
import { Loading } from '../../components/ui/Loading'
import { skillService } from '../../services/skillService'
import { getSkillLogoUrl } from '../../utils/skillLogos'
import SkillLogo from '../../components/ui/SkillLogo'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [savingSkillId, setSavingSkillId] = useState(null)
  const [deletingSkillId, setDeletingSkillId] = useState(null)

  const loadSkills = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await skillService.listSkills()
      setSkills(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load skills.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSkills()
  }, [])

  const handleExtractSkills = async () => {
    setExtracting(true)
    setError('')
    setSuccessMessage('')

    try {
      const result = await skillService.extractSkills()
      setSuccessMessage(result?.summary || result?.message || 'Skill extraction started successfully.')
      await loadSkills()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract skills.')
    } finally {
      setExtracting(false)
    }
  }

  const updateSkillField = (skillId, field, value) => {
    setSkills((currentSkills) =>
      currentSkills.map((skillObj) =>
        skillObj.id === skillId
          ? {
              ...skillObj,
              [field]: value,
            }
          : skillObj
      )
    )
  }

  const handleSaveSkill = async (skillObj) => {
    setSavingSkillId(skillObj.id)
    setError('')

    try {
      const payload = {
        source: skillObj.source,
        is_visible: Boolean(skillObj.is_visible),
        sort_order: Number(skillObj.sort_order) || 0,
      }

      const updated = await skillService.updateSkill(skillObj.id, payload)
      setSkills((currentSkills) =>
        currentSkills
          .map((item) => (item.id === skillObj.id ? { ...item, ...updated } : item))
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || String(a.skill?.name || '').localeCompare(String(b.skill?.name || '')))
      )
      await loadSkills()
      setSuccessMessage('Skill updated successfully.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update skill.')
    } finally {
      setSavingSkillId(null)
    }
  }

  const handleDeleteSkill = async (skillObj) => {
    if (!window.confirm(`Remove ${skillObj?.skill?.name || 'this skill'} from your portfolio?`)) return

    setDeletingSkillId(skillObj.id)
    setError('')

    try {
      await skillService.deleteSkill(skillObj.id)
      await loadSkills()
      setSuccessMessage('Skill removed from your portfolio.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete skill.')
    } finally {
      setDeletingSkillId(null)
    }
  }

  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 80) return 'bg-green-500'
    if (proficiency >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Skills</h1>
          <p className="text-slate-600">Your extracted technical skills</p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4">
          <Alert type="success" message={successMessage} />
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Your Skills</h2>
              {/* <p className="text-sm text-slate-500">Skill management coming soon</p> */}
            </div>
            <Button variant="secondary" onClick={handleExtractSkills} disabled={extracting}>
              {extracting ? 'Extracting...' : 'Extract Skills'}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loading message="Loading skills..." />
          ) : skills.length === 0 ? (
            <EmptyState message="No skills available yet." />
          ) : (
            <div className="space-y-4">
              {skills.map((skillObj) => {
                const skill = skillObj?.skill || {}
                const name = skill?.name || skillObj?.name || 'Unknown'
                const proficiency = skillObj?.proficiency || 0
                const logoUrl = skill?.logo_url || getSkillLogoUrl(name)

                return (
                  <div key={skillObj.id || name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                          <SkillLogo src={logoUrl} name={name} className="size-7" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">{name}</span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                              {skillObj?.source || 'auto'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">Visible on portfolio and sorted by order</p>
                        </div>
                      </div>

                      <div className="min-w-[160px]">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Proficiency</span>
                          <span className="text-sm text-slate-600">{proficiency}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200">
                          <div
                            className={`h-2 rounded-full ${getProficiencyColor(proficiency)}`}
                            style={{ width: `${proficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Input
                        type="number"
                        label="Order"
                        value={skillObj.sort_order ?? 0}
                        onChange={(event) => updateSkillField(skillObj.id, 'sort_order', event.target.value)}
                        min={0}
                        disabled={!skillObj.is_visible}
                        helperText={skillObj.is_visible ? 'Lower numbers appear first on your portfolio.' : 'Enable visibility to change ordering.'}
                      />

                      <div className="flex items-end">
                        <label className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={Boolean(skillObj.is_visible)}
                            onChange={(event) => updateSkillField(skillObj.id, 'is_visible', event.target.checked)}
                            className="size-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                          />
                          Show in portfolio
                        </label>
                      </div>

                      <div className="flex items-end gap-2">
                        <Button
                          variant="primary"
                          className="flex-1"
                          onClick={() => handleSaveSkill(skillObj)}
                          disabled={savingSkillId === skillObj.id || deletingSkillId === skillObj.id}
                        >
                          {savingSkillId === skillObj.id ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteSkill(skillObj)}
                          disabled={savingSkillId === skillObj.id || deletingSkillId === skillObj.id}
                        >
                          {deletingSkillId === skillObj.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardLayout>
  )
}
