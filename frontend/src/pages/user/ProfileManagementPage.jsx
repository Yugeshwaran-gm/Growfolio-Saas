import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Alert, ErrorState, EmptyState } from '../../components/ui/States'
import { Loading } from '../../components/ui/Loading'
import { API_BASE_URL } from '../../services/api'
import { profileService } from '../../services/profileService'
import { useGraphMetrics } from '../../hooks/useGraphMetrics'
import SpecializationBadge from '../../components/graph/SpecializationBadge'

export default function ProfileManagementPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    github: '',
    github_username: '',
    linkedin: '',
    professional_summary: '',
    career_objective: '',
    education_text: '',
    certificates_text: '',
    extras_text: '',
  })
  const [profileImage, setProfileImage] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { metrics: graphMetrics, loading: graphLoading, error: graphError } = useGraphMetrics({ topN: 5, enabled: true })

  const specialization = graphMetrics?.specialization_summary || {}

  const profileImageUrl = useMemo(() => {
    if (!currentImage) {
      return ''
    }

    if (currentImage.startsWith('http')) {
      return currentImage
    }

    return `${API_BASE_URL}${currentImage}`
  }, [currentImage])

  const loadProfile = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const profile = await profileService.getProfile()
      setFormData({
        full_name: profile?.full_name || '',
        bio: profile?.bio || '',
        github: profile?.github || '',
        github_username: profile?.github_username || '',
        linkedin: profile?.linkedin || '',
          professional_summary: profile?.professional_summary || '',
          career_objective: profile?.career_objective || '',
          education_text: Array.isArray(profile?.education) ? (profile.education.join('\n')) : (profile?.education || ''),
          certificates_text: Array.isArray(profile?.certificates) ? (profile.certificates.join('\n')) : (profile?.certificates || ''),
          extras_text: Array.isArray(profile?.extras) ? (profile.extras.join('\n')) : (profile?.extras || ''),
      })
      setCurrentImage(profile?.profile_image || '')
      // resume will not be shown as preview, but keep in mind it's available
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const payload = {
        full_name: formData.full_name,
        bio: formData.bio,
        github: formData.github,
        github_username: formData.github_username,
        linkedin: formData.linkedin,
        professional_summary: formData.professional_summary,
        career_objective: formData.career_objective,
        education: formData.education_text ? formData.education_text.split('\n').map(s => s.trim()).filter(Boolean) : [],
        certificates: formData.certificates_text ? formData.certificates_text.split('\n').map(s => s.trim()).filter(Boolean) : [],
        extras: formData.extras_text ? formData.extras_text.split('\n').map(s => s.trim()).filter(Boolean) : [],
      }

      if (profileImage) {
        payload.profile_image = profileImage
      }
      if (resumeFile) {
        payload.resume = resumeFile
      }

      const updatedProfile = await profileService.updateProfile(payload)

      setFormData((prev) => ({
        ...prev,
        full_name: updatedProfile?.full_name ?? prev.full_name,
        bio: updatedProfile?.bio ?? prev.bio,
        github: updatedProfile?.github ?? prev.github,
        github_username: updatedProfile?.github_username ?? prev.github_username,
        linkedin: updatedProfile?.linkedin ?? prev.linkedin,
      }))
      setCurrentImage(updatedProfile?.profile_image || currentImage)
      setProfileImage(null)
      setSuccessMessage('Profile updated successfully.')
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Failed to save profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary-500">Profile Management</h2>
          <p className="mt-1 text-slate-500">Update your public profile details.</p>
        </header>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-primary-500">Specialization Badge</h3>
              <p className="text-sm text-slate-500">Your profile now includes graph-based expertise concentration signals.</p>
            </div>
            {graphLoading ? (
              <span className="text-sm text-slate-500">Loading...</span>
            ) : graphError ? (
              <span className="text-sm text-red-600">Unavailable</span>
            ) : (
              <SpecializationBadge level={specialization.specialization_level} topSkill={specialization.top_skill} />
            )}
          </div>
        </section>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10">
            <Loading message="Loading profile..." />
          </div>
        ) : errorMessage && !successMessage ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState message={errorMessage} onRetry={loadProfile} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && <Alert type="success" message={successMessage} />}
            {errorMessage && <Alert type="error" message={errorMessage} />}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-primary-500">Profile Image</h3>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100">
                  {(profileImageUrl || profileImage) ? (
                    <img
                      src={profileImage ? URL.createObjectURL(profileImage) : profileImageUrl}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400">No image</div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-600"
                  />
                  <p className="mt-2 text-xs text-slate-500">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-primary-500">Resume / CV</h3>

              <div>
                <input
                  type="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-600"
                />
                <p className="mt-2 text-xs text-slate-500">PDF or Word document. Max size 10MB.</p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-primary-500">Personal Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

                <Input
                  label="GitHub Username"
                  name="github_username"
                  value={formData.github_username}
                  onChange={handleChange}
                  placeholder="e.g., username"
                />

                <Input
                  label="GitHub URL"
                  name="github"
                  type="url"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />

                <Input
                  label="LinkedIn URL"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/username"
                />
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-primary-500">About You</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell people about yourself"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Professional Summary</label>
                  <textarea
                    name="professional_summary"
                    value={formData.professional_summary}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your professional background and expertise"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Career Objective</label>
                  <textarea
                    name="career_objective"
                    value={formData.career_objective}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="What are your career goals and aspirations?"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-primary-500">Academic & Achievements</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Education (one per line)</label>
                  <textarea
                    name="education_text"
                    value={formData.education_text}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="B.S. Computer Science — Stanford University — 2020&#10;M.S. Artificial Intelligence — MIT — 2022"
                  />
                  <p className="mt-1 text-xs text-slate-500">Enter each education entry on a new line (degree — institution — year)</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Certificates (one per line)</label>
                  <textarea
                    name="certificates_text"
                    value={formData.certificates_text}
                    onChange={handleChange}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="AWS Solutions Architect — Professional&#10;Google Cloud Professional — Data Engineer"
                  />
                  <p className="mt-1 text-xs text-slate-500">Enter each certificate on a new line</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Extra-Curricular Activities (one per line)</label>
                  <textarea
                    name="extras_text"
                    value={formData.extras_text}
                    onChange={handleChange}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Open-source contributor to React&#10;Speaker at NodeConf and React Summit"
                  />
                  <p className="mt-1 text-xs text-slate-500">Enter each activity on a new line</p>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        )}

        {!loading && !errorMessage && !formData.full_name && !formData.bio && !formData.github && !formData.linkedin && !formData.github_username && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState message="Your profile is empty. Add details and save to publish your profile." />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
