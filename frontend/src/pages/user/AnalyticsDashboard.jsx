import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'

// KPI Stat Card Component
function StatCard({ icon, label, value, change }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="text-2xl bg-primary/10 p-2 rounded-lg">
          {icon}
        </div>
        <span className="text-emerald-500 text-xs font-bold">{change}</span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-black text-accent mt-1">{value}</h3>
    </div>
  )
}

// Article Performance Bar Component
function PerformanceBar({ platform, views, percentage, isAccent }) {
  const widthClass = getWidthClass(percentage)
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-semibold text-slate-600 truncate">{platform}</div>
      <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden flex">
        <div
          className={`h-full rounded-r-full ${isAccent ? 'bg-accent' : 'bg-primary'} ${widthClass}`}
        ></div>
      </div>
      <div className="w-12 text-sm font-bold text-primary">{views}</div>
    </div>
  )
}

// Progress Bar Component (Referring Sources)
function ProgressBar({ label, percentage }) {
  const widthClass = getWidthClass(percentage)
  
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-primary">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full">
        <div
          className={`bg-accent h-full rounded-full ${widthClass}`}
        ></div>
      </div>
    </div>
  )
}

// Helper function to map percentages to Tailwind width classes
function getWidthClass(percentage) {
  const ranges = [
    { min: 0, max: 5, class: 'w-1' },
    { min: 5, max: 10, class: 'w-1/12' },
    { min: 10, max: 15, class: 'w-1/6' },
    { min: 15, max: 20, class: 'w-1/5' },
    { min: 20, max: 25, class: 'w-1/4' },
    { min: 25, max: 30, class: 'w-2/7' },
    { min: 30, max: 35, class: 'w-1/3' },
    { min: 35, max: 40, class: 'w-2/5' },
    { min: 40, max: 45, class: 'w-5/12' },
    { min: 45, max: 50, class: 'w-1/2' },
    { min: 50, max: 55, class: 'w-7/12' },
    { min: 55, max: 60, class: 'w-3/5' },
    { min: 60, max: 65, class: 'w-2/3' },
    { min: 65, max: 70, class: 'w-7/10' },
    { min: 70, max: 75, class: 'w-3/4' },
    { min: 75, max: 80, class: 'w-4/5' },
    { min: 80, max: 90, class: 'w-5/6' },
    { min: 90, max: 100, class: 'w-full' },
  ]
  
  const range = ranges.find(r => percentage >= r.min && percentage <= r.max)
  return range?.class || 'w-full'
}

export default function AnalyticsDashboard() {
  const [timePeriod, setTimePeriod] = useState('30D')

  const statCards = [
    { icon: '👁️', label: 'Total Profile Views', value: '24,502', change: '+12.5%' },
    { icon: '👆', label: 'Total Engagements', value: '1,284', change: '+5.2%' },
    { icon: '🎖️', label: 'Recruiter Visits', value: '856', change: '+18.7%' },
    { icon: '🔄', label: 'Avg. API Sync Rate', value: '98.2%', change: '+0.4%' },
  ]

  const articleData = [
    { platform: 'Medium', views: '12k', percentage: 75, isAccent: false },
    { platform: 'Dev.to', views: '8.4k', percentage: 60, isAccent: true },
    { platform: 'Hashnode', views: '5.2k', percentage: 45, isAccent: false },
    { platform: 'Substack', views: '3.1k', percentage: 30, isAccent: true },
  ]

  const referringSources = [
    { label: 'LinkedIn', percentage: 42 },
    { label: 'Google Search', percentage: 28 },
    { label: 'Direct Traffic', percentage: 15 },
    { label: 'GitHub Profile', percentage: 10 },
    { label: 'Twitter / X', percentage: 3 },
    { label: 'Other', percentage: 2 },
  ]

  const chartHeights = [40, 55, 45, 70, 85, 60, 50, 65, 90, 75, 60, 80]

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

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              label={card.label}
              value={card.value}
              change={card.change}
            />
          ))}
        </div>

        {/* Main Performance Chart */}
        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-xl font-bold text-primary">Profile Views</h4>
              <p className="text-sm text-slate-500">Daily unique visitors over the last 30 days</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-xs font-semibold text-slate-600">Current Period</span>
            </div>
          </div>
          <div className="relative h-80 w-full bg-slate-50 rounded-lg flex items-end justify-between px-4 pb-4">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-accent to-transparent rounded-lg"></div>
            <div className="w-full h-full relative flex items-end gap-1">
              {chartHeights.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-accent/20 border-t-4 border-primary rounded-t-sm"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Article Performance Bar Chart */}
          <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-xl font-bold text-primary mb-6">Article Performance</h4>
            <div className="space-y-6">
              {articleData.map((article, index) => (
                <PerformanceBar
                  key={index}
                  platform={article.platform}
                  views={article.views}
                  percentage={article.percentage}
                  isAccent={article.isAccent}
                />
              ))}
            </div>
          </div>

          {/* API Contribution Multi-line Chart */}
          <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xl font-bold text-primary">API Contribution Trends</h4>
              <div className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>Github
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>StackOverflow
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>Dev.to
                </div>
              </div>
            </div>
            <div className="h-48 relative border-b border-l border-slate-200 ml-4 flex items-center justify-center">
              <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
              </div>
              <div className="w-full h-full p-4 relative overflow-hidden">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                  {/* Github Line */}
                  <path
                    d="M0,80 Q50,20 100,50 T200,30 T300,60 T400,20"
                    fill="none"
                    stroke="#3B1E54"
                    strokeWidth="3"
                  ></path>
                  {/* StackOverflow Line */}
                  <path
                    d="M0,60 Q50,90 100,40 T200,70 T300,30 T400,50"
                    fill="none"
                    stroke="#FFBF00"
                    strokeWidth="3"
                  ></path>
                  {/* Dev.to Line */}
                  <path
                    d="M0,40 Q50,60 100,80 T200,50 T300,70 T400,90"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
          <h4 className="text-xl font-bold text-primary mb-6">Top Referring Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {referringSources.slice(0, 3).map((source, index) => (
                <ProgressBar
                  key={index}
                  label={source.label}
                  percentage={source.percentage}
                />
              ))}
            </div>
            <div className="space-y-4">
              {referringSources.slice(3).map((source, index) => (
                <ProgressBar
                  key={index}
                  label={source.label}
                  percentage={source.percentage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
