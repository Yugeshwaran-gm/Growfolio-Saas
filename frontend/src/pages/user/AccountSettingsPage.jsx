import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'

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
    setPasswords(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert('Passwords do not match')
      return
    }
    if (!passwords.current || !passwords.new) {
      alert('Please fill all password fields')
      return
    }
    alert('Password updated successfully!')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      alert('Account deletion initiated...')
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
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleUpdatePassword}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Update Password
              </button>
            </div>
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

          {/* Danger Zone */}
          <SettingsSection isDangerZone={true}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">Danger Zone</h2>
                <p className="text-sm text-slate-500">Permanently remove your account and all aggregated portfolio data. This action is irreversible.</p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="bg-primary/10 text-primary border border-primary/30 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shrink-0"
              >
                Delete Account
              </button>
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
