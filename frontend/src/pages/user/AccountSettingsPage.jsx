import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Alert } from '../../components/ui/States'
import { authService } from '../../services/authService'

// Toggle Switch Component
function ToggleSwitch({ defaultChecked = false, onChange }) {
  const [isChecked, setIsChecked] = useState(defaultChecked)

  const handleToggle = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    onChange?.(newValue)
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
    </label>
  )
}

// Preference Item Component
function PreferenceItem({ title, description, defaultChecked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ToggleSwitch defaultChecked={defaultChecked} onChange={onChange} />
    </div>
  )
}

// Section Header Component
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-6 text-primary">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  )
}

// Settings Section Component
function SettingsSection({ children, isDangerZone = false }) {
  return (
    <section
      className={`bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border p-8 ${
        isDangerZone
          ? 'border-dashed border-primary/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {children}
    </section>
  )
}

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    displayName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    timezone: 'Pacific Time (PT) - Los Angeles',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [preferences, setPreferences] = useState({
    weeklyAnalytics: true,
    recruiterMessage: true,
    apiSyncAlerts: true,
    marketingUpdates: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setErrorMessage('')
    setSuccessMessage('')
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
    setPasswords(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePasswordForm = () => {
    const nextErrors = {}

    if (!passwords.current.trim()) {
      nextErrors.current = 'Current password is required.'
    }

    if (!passwords.new.trim()) {
      nextErrors.new = 'New password is required.'
    } else if (passwords.new.length < 8) {
      nextErrors.new = 'New password must be at least 8 characters.'
    }

    if (!passwords.confirm.trim()) {
      nextErrors.confirm = 'Please confirm your new password.'
    } else if (passwords.new !== passwords.confirm) {
      nextErrors.confirm = 'Passwords do not match.'
    }

    if (passwords.current && passwords.new && passwords.current === passwords.new) {
      nextErrors.new = 'New password must be different from the current password.'
    }

    return nextErrors
  }

  const handleUpdatePassword = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const nextErrors = validatePasswordForm()
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSavingPassword(true)

    try {
      const response = await authService.changePassword({
        old_password: passwords.current,
        new_password: passwords.new,
      })

      if (response?.error) {
        setErrorMessage(response.error)
        return
      }

      setSuccessMessage(response?.message || 'Password updated successfully.')
      setPasswords({ current: '', new: '', confirm: '' })
      setFieldErrors({})
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Failed to update password.'
      )
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-primary">Account Settings</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your personal profile, security protocols, and notification logic.</p>
        </header>

        <div className="space-y-8">
          {/* Account Information Section */}
          <SettingsSection>
            <SectionHeader icon="👤" title="Account Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-colors"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Timezone</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-colors"
                >
                  <option>Pacific Time (PT) - Los Angeles</option>
                  <option>Eastern Time (ET) - New York</option>
                  <option>Central European Time (CET) - Berlin</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection>
            <SectionHeader icon="🔒" title="Security" />
            {errorMessage && (
              <div className="mb-6">
                <Alert type="error" message={errorMessage} />
              </div>
            )}

            {successMessage && (
              <div className="mb-6">
                <Alert type="success" message={successMessage} />
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-colors"
                  />
                  {fieldErrors.current && <p className="text-xs text-red-600">{fieldErrors.current}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">New Password</label>
                  <input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-colors"
                  />
                  {fieldErrors.new && <p className="text-xs text-red-600">{fieldErrors.new}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-colors"
                  />
                  {fieldErrors.confirm && <p className="text-xs text-red-600">{fieldErrors.confirm}</p>}
                </div>
              </div>
              <div className="mt-2">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {isSavingPassword ? 'Updating...' : 'Update Password'}
              </button>
              </div>
            </form>
          </SettingsSection>

          {/* Preferences Section */}
          <SettingsSection>
            <SectionHeader icon="🔔" title="Preferences" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Email Preferences */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Email Notifications</h3>
                <div className="space-y-6">
                  <PreferenceItem
                    title="Weekly Analytics Report"
                    description="Summary of your portfolio performance"
                    defaultChecked={preferences.weeklyAnalytics}
                    onChange={(value) => setPreferences(prev => ({ ...prev, weeklyAnalytics: value }))}
                  />
                  <PreferenceItem
                    title="New Recruiter Message"
                    description="Alerts for inbound inquiries"
                    defaultChecked={preferences.recruiterMessage}
                    onChange={(value) => setPreferences(prev => ({ ...prev, recruiterMessage: value }))}
                  />
                </div>
              </div>

              {/* System Preferences */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">System Alerts</h3>
                <div className="space-y-6">
                  <PreferenceItem
                    title="API Sync Alerts"
                    description="Failures or connection warnings"
                    defaultChecked={preferences.apiSyncAlerts}
                    onChange={(value) => setPreferences(prev => ({ ...prev, apiSyncAlerts: value }))}
                  />
                  <PreferenceItem
                    title="Marketing Updates"
                    description="News and feature releases"
                    defaultChecked={preferences.marketingUpdates}
                    onChange={(value) => setPreferences(prev => ({ ...prev, marketingUpdates: value }))}
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2024 GrowFolio Systems Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </footer>
      </main>
    </DashboardLayout>
  )
}
