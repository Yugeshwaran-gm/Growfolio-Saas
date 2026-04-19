import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

// Skill Tag Component
function SkillTag({ skill, onRemove }) {
  return (
    <div className="bg-accent-500/20 text-primary-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
      {skill}
      <button
        onClick={onRemove}
        className="hover:text-primary-700 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}

// Experience Item Component
function ExperienceItem({ title, company, period, onEdit }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
      <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center text-white shrink-0 text-sm">
        🏢
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-primary-500 leading-none">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{company} • {period}</p>
      </div>
      <button
        onClick={onEdit}
        className="text-slate-400 hover:text-primary-500 transition-colors"
      >
        ✏️
      </button>
    </div>
  )
}

// Social Link Input Component
function SocialLinkInput({ icon, placeholder, value, onChange }) {
  const iconMap = {
    linkedin: '🔗',
    twitter: '@',
    website: '🌐',
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-primary-500 shrink-0">
        {iconMap[icon] || icon}
      </div>
      <input
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-transparent text-sm p-2"
      />
    </div>
  )
}

export default function ProfileManagementPage() {
  const { user, updateUser, logout } = useAuth()
  const [isPublic, setIsPublic] = useState(true)
  const [formData, setFormData] = useState({
    fullName: user?.first_name || 'Alexander Sterling',
    location: user?.location || 'San Francisco, CA',
    bio: user?.bio || 'Product Designer & SaaS Enthusiast. Helping startups scale their vision through user-centric design systems and data-driven decisions.',
    linkedin: user?.linkedin || 'linkedin.com/in/alexsterling',
    twitter: user?.twitter || 'x.com/alexdesign',
    website: user?.website || 'alexsterling.design',
  })
  
  const [skills, setSkills] = useState(['UI/UX Design', 'React', 'SaaS Strategy', 'Figma'])
  const [newSkill, setNewSkill] = useState('')
  const [experience] = useState([
    { id: 1, title: 'Senior Designer', company: 'Stripe', period: '2021 - Present' }
  ])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      updateUser({
        first_name: formData.fullName,
        location: formData.location,
        bio: formData.bio,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        website: formData.website,
      })
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header with Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-primary-500">Profile Management</h2>
            <p className="text-slate-500 mt-1">Control your professional identity and public presence.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-700">Public Visibility</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500" />
            </label>
          </div>
        </div>

        {/* Profile Picture Card */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl">
                {user?.first_name?.charAt(0) || 'A'}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-2xl">📷</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-500">Profile Picture</h3>
              <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size 2MB</p>
            </div>
          </div>
          <Button variant="primary" size="md">
            📤 Change Photo
          </Button>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-lg font-bold text-primary-500 flex items-center gap-2">
              <span>ℹ️</span>
              Personal Information
            </h4>
            <div className="space-y-3">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Location
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">📍</span>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/50 p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/50 p-2 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-6">
            {/* Skills Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-primary-500 flex items-center gap-2">
                <span>⚡</span>
                Skills & Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <SkillTag
                    key={index}
                    skill={skill}
                    onRemove={() => removeSkill(skill)}
                  />
                ))}
                <button className="border-2 border-dashed border-accent-500 text-primary-500 px-3 py-1 rounded-full text-xs font-bold hover:bg-accent-500/10 transition-colors">
                  + Add Skill
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add a new skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/50 p-2 text-sm"
                />
                <button
                  onClick={addSkill}
                  className="bg-primary-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-primary-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-lg font-bold text-primary-500 flex items-center gap-2">
                <span>💼</span>
                Experience
              </h4>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <ExperienceItem
                    key={exp.id}
                    title={exp.title}
                    company={exp.company}
                    period={exp.period}
                    onEdit={() => console.log('Edit:', exp)}
                  />
                ))}
                <Button variant="secondary" className="w-full">
                  ➕ Add New Experience
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4 mt-6">
          <h4 className="text-lg font-bold text-primary-500 flex items-center gap-2">
            <span>🔗</span>
            Professional Links
          </h4>
          <div className="space-y-3">
            <SocialLinkInput
              icon="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={(e) => handleInputChange({ target: { name: 'linkedin', value: e.target.value } })}
            />
            <SocialLinkInput
              icon="twitter"
              placeholder="X (Twitter) URL"
              value={formData.twitter}
              onChange={(e) => handleInputChange({ target: { name: 'twitter', value: e.target.value } })}
            />
            <SocialLinkInput
              icon="website"
              placeholder="Portfolio Website"
              value={formData.website}
              onChange={(e) => handleInputChange({ target: { name: 'website', value: e.target.value } })}
            />
          </div>
        </div>

        {/* Resume Management */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4 mt-6">
          <h4 className="text-lg font-bold text-primary-500 flex items-center gap-2">
            <span>📄</span>
            Resume Management
          </h4>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-accent-500/5 hover:border-accent-500 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all text-2xl">
              📤
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-primary-500">Upload PDF Resume</p>
              <p className="text-xs text-slate-500 mt-1">Drag and drop or click to browse</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-lg">📋</span>
              <span className="text-sm font-medium text-slate-700">Sterling_CV_2024.pdf</span>
            </div>
            <button className="text-slate-400 hover:text-red-500 transition-colors text-lg">
              ✕
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end gap-4">
          <Button variant="secondary">
            Discard Changes
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
