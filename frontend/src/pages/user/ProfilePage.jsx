import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Alert } from '../../components/ui/States'
import { API_BASE_URL } from '../../services/api'
import { profileService } from '../../services/profileService'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    github: '',
    github_username: '',
    linkedin: '',
  })
  const [profileImage, setProfileImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError('')

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
        setError(err.response?.data?.detail || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const profileImageUrl = useMemo(() => {
    if (!currentImage) {
      return ''
    }

    if (currentImage.startsWith('http')) {
      return currentImage
    }

    return `${API_BASE_URL}${currentImage}`
  }, [currentImage])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError('')

    try {
      const payload = { ...formData }

      if (profileImage) {
        payload.profile_image = profileImage
      }

      const updatedProfile = await profileService.updateProfile(payload)
      setCurrentImage(updatedProfile?.profile_image || currentImage)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600">Manage your account information</p>
      </div>

      <div className="max-w-2xl">
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} />
          </div>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Personal Information</h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <p className="text-slate-500">Loading profile...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {success && (
                  <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                    Profile updated successfully!
                  </div>
                )}

                <Input
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="GitHub Username"
                    name="github_username"
                    value={formData.github_username}
                    onChange={handleChange}
                  />
                  <Input
                    label="GitHub URL"
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="LinkedIn URL"
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-600"
                  />

                  {(profileImageUrl || profileImage) && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-100">
                        <img
                          src={profileImage ? URL.createObjectURL(profileImage) : profileImageUrl}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-slate-500">Preview of the current or selected image.</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <CardFooter>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  )
}
