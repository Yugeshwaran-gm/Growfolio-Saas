import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function SkillsPage() {
  const [skills] = useState([
    { id: 1, name: 'React', proficiency: 90 },
    { id: 2, name: 'Python', proficiency: 85 },
    { id: 3, name: 'Django', proficiency: 85 },
    { id: 4, name: 'JavaScript', proficiency: 90 },
    { id: 5, name: 'SQL', proficiency: 80 },
    { id: 6, name: 'Tailwind CSS', proficiency: 95 },
  ])

  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 80) return 'bg-green-500'
    if (proficiency >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Skills</h1>
          <p className="text-slate-600">Manage your technical skills</p>
        </div>
        <Button variant="primary">
          Add Skill
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Your Skills</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{skill.name}</span>
                    <span className="text-sm text-slate-600">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)}`}
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  )
}
