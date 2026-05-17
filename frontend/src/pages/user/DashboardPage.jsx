import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState } from '../../components/ui/States'
import Button from '../../components/ui/Button'
import MaterialIcon from '../../components/ui/MaterialIcon'
import { analyticsService } from '../../services/analyticsService'
import { integrationService } from '../../services/integrationService'
import { useGraphMetrics } from '../../hooks/useGraphMetrics'
import { useGraphData } from '../../hooks/useGraphData'
import SpecializationBadge from '../../components/graph/SpecializationBadge'
import TopSkillsWidget from '../../components/graph/TopSkillsWidget'
import { GraphVisualization } from '../../components/graph/GraphVisualization'

// Stat Card Component 
function StatCard({ icon, label, value, badge, badgeColor, isPreview = false, previewNote = '' }) {
  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow ${isPreview ? 'opacity-80' : 'hover:shadow-md'}`}>
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
      {isPreview && previewNote ? (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{previewNote}</p>
      ) : null}
      <p className="text-3xl font-black text-slate-900 mt-1">
        {value}
        <span className="text-accent-500 text-lg">.</span>
      </p>
    </div>
  )
}

function ComingSoonNotice({ message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-700">Coming soon</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  )
}

function formatSyncTime(value) {
  if (!value) {
    return 'Not synced yet'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Not synced yet'
  }

  return parsed.toLocaleString()
}

function getIntegrationBadgeStyle(status) {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'connected') {
    return 'bg-emerald-50 text-emerald-700'
  }
  if (normalized === 'pending') {
    return 'bg-amber-50 text-amber-700'
  }
  if (normalized === 'failed') {
    return 'bg-red-50 text-red-700'
  }
  return 'bg-slate-100 text-slate-600'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [analytics, setAnalytics] = useState({ profile_views: 0, project_views: 0 })
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analyticsError, setAnalyticsError] = useState('')
  const [integrations, setIntegrations] = useState([])
  const [integrationsLoading, setIntegrationsLoading] = useState(true)
  const [integrationsError, setIntegrationsError] = useState('')
  const displayName = user?.full_name || user?.first_name || 'User'
  const { metrics: graphMetrics, loading: graphLoading, error: graphError } = useGraphMetrics({ topN: 6, enabled: true })
  const { nodes: graphNodes, edges: graphEdges, loading: graphDataLoading, error: graphDataError } = useGraphData(250, true)

  const specialization = graphMetrics?.specialization_summary || {}
  const projectConcentration = graphMetrics?.project_concentration || {}
  const topSkills = Array.isArray(graphMetrics?.top_skills) ? graphMetrics.top_skills : []
  const mostConnected = Array.isArray(graphMetrics?.most_connected_technologies) ? graphMetrics.most_connected_technologies : []
  const topSkillPair = graphMetrics?.skill_ecosystem_clustering?.top_skill_pairs?.[0]

  const statCards = [
    {
      iconName: 'visibility',
      label: 'Profile Views',
      value: analytics.profile_views.toLocaleString(),
      badge: 'Live',
      badgeColor: 'text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full',
    },
    {
      iconName: 'bar_chart',
      label: 'Project Views',
      value: analytics.project_views.toLocaleString(),
      badge: 'Live',
      badgeColor: 'text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full',
    },
    {
      iconName: 'dashboard',
      label: 'Dashboard Status',
      value: 'Live',
      badge: 'Preview',
      badgeColor: 'text-slate-500 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full',
      isPreview: true,
      previewNote: 'Static preview',
    },
    {
      iconName: 'work_outline',
      label: 'Portfolio Overview',
      value: 'Synced',
      badge: 'Preview',
      badgeColor: 'text-slate-500 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full',
      isPreview: true,
      previewNote: 'Static preview',
    },
  ]

  useEffect(() => {
    const loadDashboardData = async () => {
      setAnalyticsLoading(true)
      setAnalyticsError('')
      setIntegrationsLoading(true)
      setIntegrationsError('')

      try {
        const data = await analyticsService.getDashboard()
        setAnalytics({
          profile_views: data?.profile_views ?? 0,
          project_views: data?.project_views ?? 0,
        })
      } catch (err) {
        setAnalyticsError(err.response?.data?.detail || 'Failed to load dashboard analytics.')
      } finally {
        setAnalyticsLoading(false)
      }

      try {
        const integrationData = await integrationService.getIntegrations()
        setIntegrations(Array.isArray(integrationData) ? integrationData : [])
      } catch (err) {
        setIntegrationsError(err.response?.data?.error || 'Failed to load integrations.')
      } finally {
        setIntegrationsLoading(false)
      }
    }

    loadDashboardData()
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
                <MaterialIcon name="search" size={18} className="text-primary-500/80" ariaLabel="Search" />
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
              <MaterialIcon name="notifications" size={20} className="text-slate-600" ariaLabel="Notifications" />
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
              <MaterialIcon name="expand_more" size={18} className="text-slate-500" ariaLabel="Open profile menu" />
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
          {analyticsLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10">
              <Loading message="Loading dashboard analytics..." />
            </div>
          ) : analyticsError ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <ErrorState message={analyticsError} onRetry={() => window.location.reload()} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={<MaterialIcon name={stat.iconName} size={20} className="text-primary-500" />}
                  label={stat.label}
                  value={stat.value}
                  badge={stat.badge}
                  badgeColor={stat.badgeColor}
                  isPreview={stat.isPreview}
                  previewNote={stat.previewNote}
                />
              ))}
            </div>
          )}

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-primary-500">Activity Feed</h3>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">Coming soon</span>
              </div>
              <div className="p-6 space-y-6">
                <ComingSoonNotice message="Real activity events will appear here once timeline tracking is available." />
              </div>
            </div>

            {/* Integration Status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-primary-500">Integration Status</h3>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary-500/10 text-primary-500 uppercase">
                  Live
                </span>
              </div>
              <div className="p-6 space-y-4">
                {integrationsLoading ? (
                  <Loading message="Loading integration status..." />
                ) : integrationsError ? (
                  <ErrorState message={integrationsError} onRetry={() => window.location.reload()} />
                ) : integrations.length === 0 ? (
                  <p className="text-sm text-slate-500">No integrations connected yet.</p>
                ) : (
                  integrations.slice(0, 3).map((integration) => (
                    <div key={integration.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-800">{integration.source_name}</p>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getIntegrationBadgeStyle(integration.sync_status)}`}>
                          {integration.sync_status || 'unknown'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Last sync: {formatSyncTime(integration.last_sync)}</p>
                    </div>
                  ))
                )}
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
                <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-primary-500">Quick Connect</h3>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">Coming soon</span>
                </div>
                <p className="text-slate-600 text-sm">More one-click connectors will be available in a future update.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/dashboard/integrations')}
                >
                  Open Integrations
                </Button>
              </div>
            </div>
          </div>

          {/* Graph Visualization */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-primary-500">Your Skill Graph</h3>
              <p className="text-sm text-slate-500">Visual map of how your skills connect across projects.</p>
            </div>
            <GraphVisualization 
              nodes={graphNodes}
              edges={graphEdges}
              loading={graphDataLoading}
              error={graphDataError}
            />
          </section>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-primary-500">Graph Intelligence</h3>
                  <p className="text-sm text-slate-500">Specialization and skill ecosystem insights.</p>
                </div>
                <SpecializationBadge level={specialization.specialization_level} topSkill={specialization.top_skill} compact />
              </div>

              {graphLoading ? (
                <Loading message="Loading graph intelligence..." />
              ) : graphError ? (
                <p className="text-sm text-red-600">{graphError}</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Specialization Level</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{specialization.specialization_level || 'broad'}</p>
                    <p className="mt-1 text-xs text-slate-500">Top skill share: {Number(specialization.top_skill_share || 0) * 100}%</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project Concentration</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{Number(projectConcentration.avg_skills_per_project || 0)}</p>
                    <p className="mt-1 text-xs text-slate-500">Avg skills per project</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Skill Pair Insight</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {topSkillPair
                        ? `${topSkillPair.pair?.[0]} + ${topSkillPair.pair?.[1]}`
                        : 'No pair signal available yet.'}
                    </p>
                    {topSkillPair ? (
                      <p className="mt-1 text-xs text-slate-500">Observed together in {topSkillPair.project_count} project(s).</p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-primary-500">Top Skills</h3>
              <p className="mb-4 text-sm text-slate-500">Most connected technologies from your graph.</p>

              {graphLoading ? (
                <Loading message="Loading top skills..." />
              ) : graphError ? (
                <p className="text-sm text-red-600">{graphError}</p>
              ) : (
                <TopSkillsWidget skills={topSkills.length ? topSkills : mostConnected} limit={5} />
              )}
            </div>
          </section>

          {user?.is_recruiter ? (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-primary-500">Recruiter Intelligence Summary</h3>
              <p className="mt-1 text-sm text-slate-500">Reusable candidate-evaluation signals are active and ready for recruiter workflows.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Specialization</p>
                  <p className="text-sm font-semibold text-slate-800">{specialization.specialization_level || 'broad'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Top Technology</p>
                  <p className="text-sm font-semibold text-slate-800">{specialization.top_skill || 'N/A'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Consistency</p>
                  <p className="text-sm font-semibold text-slate-800">{Math.round(Number(graphMetrics?.cross_project_skill_consistency?.top_skill_project_coverage_percent || 0))}%</p>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  )
}
