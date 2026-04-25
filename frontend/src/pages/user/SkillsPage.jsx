import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Alert, EmptyState } from '../../components/ui/States'
import { Loading } from '../../components/ui/Loading'
import { skillService } from '../../services/skillService'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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
      setSuccessMessage(result?.message || 'Skill extraction started successfully.')
      await loadSkills()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract skills.')
    } finally {
      setExtracting(false)
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
          <p className="text-slate-600">Your extracted technical skills (read-only)</p>
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
              <p className="text-sm text-slate-500">Skill management coming soon</p>
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
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-slate-900">{skill.name}</span>
                      <span className="text-sm text-slate-600">{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)}`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardLayout>
  )
}
