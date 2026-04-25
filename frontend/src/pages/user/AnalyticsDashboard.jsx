import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { analyticsService } from '../../services/analyticsService'

// KPI Stat Card Component
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="text-2xl bg-primary/10 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-black text-accent mt-1">{value}</h3>
    </div>
  )
}

function PlaceholderPanel({ title }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
      <h4 className="text-xl font-bold text-primary mb-4">{title}</h4>
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <p className="text-sm font-semibold text-slate-600">Detailed analytics coming soon</p>
      </div>
    </div>
  )
}

function ChartDataPanel({ title, chartData }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
      <h4 className="text-xl font-bold text-primary mb-4">{title}</h4>
      <div className="grid grid-cols-1 gap-2">
        {chartData.slice(0, 6).map((item, index) => (
          <div key={index} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [timePeriod, setTimePeriod] = useState('30D')
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const extractDashboard = (payload) => payload?.data ?? payload ?? {}

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await analyticsService.getDashboard()
      setDashboardData(extractDashboard(response))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load analytics dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const profileViewsRaw = dashboardData?.profile_views
  const projectViewsRaw = dashboardData?.project_views
  const profileViews = Number.isFinite(Number(profileViewsRaw)) ? Number(profileViewsRaw) : null
  const projectViews = Number.isFinite(Number(projectViewsRaw)) ? Number(projectViewsRaw) : null

  const hasDashboardData = profileViews !== null || projectViews !== null
  const detailedChartDataAvailable = Array.isArray(dashboardData?.chart_data) && dashboardData.chart_data.length > 0

  const statCards = [
    {
      icon: '👁️',
      label: 'Profile Views',
      value: profileViews !== null ? profileViews.toLocaleString() : '0',
    },
    {
      icon: '📊',
      label: 'Project Views',
      value: projectViews !== null ? projectViews.toLocaleString() : '0',
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-primary">Analytics Dashboard</h2>
            <p className="text-slate-500 mt-1">Real-time performance metrics and recruiter engagement insights.</p>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            {['7D', '30D', '90D'].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timePeriod === period
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10">
            <Loading message="Loading analytics dashboard..." />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState message={error} onRetry={loadAnalytics} />
          </div>
        ) : !hasDashboardData ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState message="No analytics data available yet." />
          </div>
        ) : (
          <>
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {statCards.map((card, index) => (
                <StatCard
                  key={index}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                />
              ))}
            </div>

            {/* Main Performance Chart */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-xl font-bold text-primary">Profile and Project Views</h4>
                  <p className="text-sm text-slate-500">Current aggregated dashboard values</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-5 border border-slate-200">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">Profile Views</p>
                  <p className="mt-2 text-3xl font-black text-primary">{profileViews.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-5 border border-slate-200">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">Project Views</p>
                  <p className="mt-2 text-3xl font-black text-primary">{projectViews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {detailedChartDataAvailable ? <ChartDataPanel title="Article Performance" chartData={dashboardData.chart_data} /> : <PlaceholderPanel title="Article Performance" />}
              {detailedChartDataAvailable ? <ChartDataPanel title="API Contribution Trends" chartData={dashboardData.chart_data} /> : <PlaceholderPanel title="API Contribution Trends" />}
            </div>

            {/* Engagement Metrics */}
            {detailedChartDataAvailable ? <ChartDataPanel title="Top Referring Sources" chartData={dashboardData.chart_data} /> : <PlaceholderPanel title="Top Referring Sources" />}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
