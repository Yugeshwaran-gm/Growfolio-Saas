import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Alert, ErrorState, EmptyState } from '../../components/ui/States'
import { Loading } from '../../components/ui/Loading'
import { API_BASE_URL } from '../../services/api'
import { profileService } from '../../services/profileService'

export default function ProfileManagementPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    github: '',
    github_username: '',
    linkedin: '',
  })
  const [profileImage, setProfileImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
      })
      setCurrentImage(profile?.profile_image || '')
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
      }

      if (profileImage) {
        payload.profile_image = profileImage
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
              <h3 className="mb-4 text-lg font-bold text-primary-500">Profile Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell people about your work"
                  />
                </div>

                <Input
                  label="GitHub Username"
                  name="github_username"
                  value={formData.github_username}
                  onChange={handleChange}
                />

                <Input
                  label="GitHub URL"
                  name="github"
                  type="url"
                  value={formData.github}
                  onChange={handleChange}
                />

                <Input
                  label="LinkedIn URL"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
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
