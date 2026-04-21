import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState } from '../../components/ui/States'
import Button from '../../components/ui/Button'
import { analyticsService } from '../../services/analyticsService'

// Stat Card Component
function StatCard({ icon, label, value, badge, badgeColor }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500">
          {icon}
        </div>
        {badge && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-black text-slate-900 mt-1">
        {value}
        <span className="text-accent-500 text-lg">.</span>
      </p>
    </div>
  )
}

// Activity Item Component
function ActivityItem({ icon, title, time, platform, badge }) {
  const badgeColors = {
    G: 'bg-black',
    M: 'bg-blue-600',
    L: 'bg-orange-500',
  }

  return (
    <div className="flex gap-4">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-primary-500/5 flex items-center justify-center text-primary-500">
          {icon}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${badgeColors[badge] || 'bg-slate-400'} text-white rounded-full p-0.5 shadow-sm flex items-center justify-center text-[10px] font-bold`}>
          {badge}
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-800">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{time} • {platform}</p>
      </div>
    </div>
  )
}

// Integration Status Item Component
function IntegrationItem({ name, initials, isConnected, bgColor }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded ${bgColor} text-white flex items-center justify-center font-black text-xs`}>
          {initials}
        </div>
        <p className="text-sm font-bold">{name}</p>
      </div>
      {isConnected ? (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase">Connected</span>
        </div>
      ) : (
        <span className="text-xs font-bold uppercase text-slate-400">Not Connected</span>
      )}
    </div>
  )
}

// Platform Connect Card Component
function PlatformCard({ name, initials, bgColor }) {
  return (
    <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 flex items-center gap-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-xs uppercase`}>
          {initials}
        </div>
        <span className="text-sm font-bold text-slate-700">{name}</span>
      </div>
      <Button variant="accent" size="sm">Connect</Button>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [analytics, setAnalytics] = useState({ profile_views: 0, project_views: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const displayName = user?.full_name || user?.first_name || 'User'

  const statCards = [
    {
      icon: '👁️',
      label: 'Profile Views',
      value: analytics.profile_views.toLocaleString(),
      badge: 'Live',
      badgeColor: 'text-primary-500 text-xs font-bold bg-primary-500/10 px-2 py-1 rounded-full',
    },
    {
      icon: '📊',
      label: 'Project Views',
      value: analytics.project_views.toLocaleString(),
      badge: 'Live',
      badgeColor: 'text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full',
    },
    {
      icon: '💻',
      label: 'Dashboard Status',
      value: 'Live',
      badge: 'Active',
      badgeColor: 'text-slate-400 text-xs font-medium bg-slate-100 px-2 py-1 rounded-full',
    },
    {
      icon: '⚙️',
      label: 'Portfolio Overview',
      value: 'Synced',
      badge: 'OK',
      badgeColor: 'text-accent-500 text-xs font-bold bg-accent-500/10 px-2 py-1 rounded-full',
    },
  ]

  const activityItems = [
    {
      icon: '📝',
      title: 'New repository pushed: "saas-dashboard-template" to GitHub',
      time: '2 hours ago',
      platform: 'Repository',
      badge: 'G',
    },
    {
      icon: '✏️',
      title: 'Article draft updated: "Mastering Tailwind CSS v4"',
      time: '5 hours ago',
      platform: 'Medium',
      badge: 'M',
    },
    {
      icon: '🏆',
      title: 'Solved problem: "Trapping Rain Water" (Hard)',
      time: 'Yesterday',
      platform: 'LeetCode',
      badge: 'L',
    },
  ]

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await analyticsService.getDashboard()
        setAnalytics({
          profile_views: data?.profile_views ?? 0,
          project_views: data?.project_views ?? 0,
        })
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load dashboard analytics.')
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  return (
    <DashboardLayout>
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500/60 group-focus-within:text-primary-500 transition-colors">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search resources, stats, integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard/notifications')}
              aria-label="Open notifications"
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              🔔
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full border-2 border-white" />
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2" />

            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              aria-label="Open profile"
              className="flex items-center gap-3 p-1 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-500/10 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                {displayName.charAt(0)}
              </div>
              <span>▼</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-black text-primary-500 tracking-tight">
              Welcome back, {displayName}
            </h2>
            <p className="text-slate-500 mt-1">Here's what happened with your portfolio while you were away.</p>
          </div>

          {/* Stats Cards Grid */}
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10">
              <Loading message="Loading dashboard analytics..." />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <ErrorState message={error} onRetry={() => window.location.reload()} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  badge={stat.badge}
                  badgeColor={stat.badgeColor}
                />
              ))}
            </div>
          )}

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-primary-500">Mock Activity Feed</h3>
                <button className="text-primary-500 text-sm font-bold hover:underline">View all</button>
              </div>
              <div className="p-6 space-y-6">
                {activityItems.map((item, index) => (
                  <ActivityItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    time={item.time}
                    platform={item.platform}
                    badge={item.badge}
                  />
                ))}
              </div>
            </div>

            {/* Integration Status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-lg text-primary-500">Integration Status</h3>
              </div>
              <div className="p-6 space-y-4">
                <IntegrationItem
                  name="GitHub"
                  initials="GH"
                  isConnected={true}
                  bgColor="bg-black"
                />
                <IntegrationItem
                  name="Medium"
                  initials="M"
                  isConnected={false}
                  bgColor="bg-blue-600"
                />
                <IntegrationItem
                  name="LeetCode"
                  initials="LC"
                  isConnected={true}
                  bgColor="bg-orange-600"
                />
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/dashboard/integrations')}
                >
                  Manage Integrations
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Connect Row */}
          <div className="bg-primary-500/5 rounded-2xl p-8 border border-primary-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-primary-500">Quick Connect</h3>
                <p className="text-slate-600 text-sm">Expand your portfolio by syncing more platforms instantly.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <PlatformCard name="Dev.to" initials="Dev" bgColor="bg-slate-900" />
                <PlatformCard name="Hashnode" initials="H" bgColor="bg-blue-500" />
                <PlatformCard name="arXiv" initials="arXiv" bgColor="bg-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
