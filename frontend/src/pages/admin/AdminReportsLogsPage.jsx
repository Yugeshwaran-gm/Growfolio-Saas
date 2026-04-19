import { useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'

// KPI Card Component
function KPICard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-tight">{label}</p>
        <p className="text-3xl font-display font-black text-accent">{value}</p>
      </div>
    </div>
  )
}

// Report Status Badge Component
function StatusBadge({ status }) {
  if (status === 'OPEN') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-primary text-xs font-bold border border-accent/40">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
        OPEN
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-primary/20 text-primary/60 text-xs font-bold">
      RESOLVED
    </span>
  )
}

// Report Reason Badge Component
function ReasonBadge({ reason }) {
  return (
    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase">
      {reason}
    </span>
  )
}

// Report Row Component
function ReportRow({ report }) {
  const handleReview = () => alert(`Reviewing report: ${report.id}`)
  const handleDismiss = () => alert(`Dismissing report: ${report.id}`)

  const isResolved = report.status === 'RESOLVED'

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4 text-sm font-mono text-slate-600 font-bold">{report.id}</td>
      <td className="px-6 py-4 text-sm font-medium text-slate-900">{report.reporter}</td>
      <td className="px-6 py-4 text-sm text-slate-600">{report.targetUser}</td>
      <td className="px-6 py-4">
        <ReasonBadge reason={report.reason} />
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={report.status} />
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={handleReview}
          disabled={isResolved}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            isResolved
              ? 'bg-primary text-white opacity-50 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20'
          }`}
        >
          Review
        </button>
        <button
          onClick={handleDismiss}
          disabled={isResolved}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            isResolved
              ? 'text-primary border border-primary/20 bg-slate-50 cursor-default'
              : 'text-primary border border-primary/20 hover:bg-slate-50'
          }`}
        >
          {isResolved ? 'Archived' : 'Dismiss'}
        </button>
      </td>
    </tr>
  )
}

// Log Entry Component
function LogEntry({ timestamp, level, message }) {
  const getLevelColor = () => {
    switch (level) {
      case 'INFO':
        return 'text-accent'
      case 'WARN':
        return 'text-accent'
      case 'ERROR':
        return 'text-red-400'
      default:
        return 'text-green-400'
    }
  }

  const getMessageColor = () => {
    switch (level) {
      case 'ERROR':
        return 'text-red-300'
      case 'WARN':
        return 'text-accent/90 italic'
      default:
        return 'text-white/80'
    }
  }

  return (
    <div className="flex gap-4">
      <span className="text-white/30 shrink-0 font-mono">{timestamp}</span>
      <span className={`${getLevelColor()} font-bold shrink-0`}>[{level}]</span>
      <span className={getMessageColor()}>{message}</span>
    </div>
  )
}

export default function AdminReportsLogsPage() {
  const [activeTab, setActiveTab] = useState('user-reports')

  const kpiData = [
    { icon: '📋', label: 'Pending User Reports', value: '124' },
    { icon: '🚩', label: 'Active Abuse Flags', value: '42' },
    { icon: '🐛', label: 'System Error Count', value: '12' },
  ]

  const reports = [
    {
      id: '#REP-8842',
      reporter: 'Alex Rivera',
      targetUser: 'User99_Alpha',
      reason: 'Spam Content',
      status: 'OPEN',
    },
    {
      id: '#REP-8841',
      reporter: 'Jordan Smith',
      targetUser: 'CryptoDev_42',
      reason: 'Harassment',
      status: 'RESOLVED',
    },
    {
      id: '#REP-8840',
      reporter: 'Taylor Case',
      targetUser: 'User_Vault_12',
      reason: 'Inappropriate Data',
      status: 'OPEN',
    },
  ]

  const logs = [
    {
      timestamp: '2023-11-24 14:02:11',
      level: 'INFO',
      message: 'User "Alex Rivera" submitted report #REP-8842. Attachment hash verified.',
    },
    {
      timestamp: '2023-11-24 14:02:15',
      level: 'INFO',
      message: 'Portfolio Aggregator: Synchronized 142 API endpoints successfully.',
    },
    {
      timestamp: '2023-11-24 14:03:01',
      level: 'WARN',
      message: 'High latency detected in cluster region US-EAST-1. Load balancer re-routing...',
    },
    {
      timestamp: '2023-11-24 14:04:45',
      level: 'ERROR',
      message: 'Failed to process payment for account #GF-9921. Gateway timeout.',
    },
    {
      timestamp: '2023-11-24 14:05:12',
      level: 'INFO',
      message: 'Worker thread #41 initialized for background data scrubbing.',
    },
    {
      timestamp: '2023-11-24 14:06:33',
      level: 'INFO',
      message: 'Admin authentication successful. IP: 192.168.1.104',
    },
    {
      timestamp: '2023-11-24 14:07:01',
      level: 'ERROR',
      message: 'Unauthorized attempt to access /admin/security/vault. Logged for review.',
    },
    {
      timestamp: '2023-11-24 14:08:12',
      level: 'INFO',
      message: 'System health check: 99.8% uptime. All services operational.',
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-display font-bold text-primary">Governance Oversight</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              🔔
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <span className="text-sm font-medium text-slate-500">Last System Update: 2m ago</span>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* KPI Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpiData.map((kpi, index) => (
              <KPICard key={index} icon={kpi.icon} label={kpi.label} value={kpi.value} />
            ))}
          </div>

          {/* Tabs & Table Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('user-reports')}
                  className={`py-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-colors ${
                    activeTab === 'user-reports'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>👤</span>User Reports
                </button>
                <button
                  onClick={() => setActiveTab('abuse-reports')}
                  className={`py-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-colors ${
                    activeTab === 'abuse-reports'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>⚠️</span>Abuse Reports
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Target User
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report, index) => (
                    <ReportRow key={index} report={report} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Logs Section */}
          <div className="bg-primary rounded-xl border border-primary shadow-2xl overflow-hidden flex flex-col h-96">
            {/* Log Header */}
            <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">💻</span>
                <span className="text-white text-sm font-bold font-display tracking-wide uppercase">
                  Real-Time System Logs
                </span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-accent/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
            </div>

            {/* Log Content */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 bg-[#1A0D26]">
              {logs.map((log, index) => (
                <LogEntry key={index} timestamp={log.timestamp} level={log.level} message={log.message} />
              ))}
            </div>

            {/* Log Footer */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex items-center shrink-0">
              <span className="text-white/40 text-xs font-mono">_ root@growfolio-prod: tail -f /var/log/syslog</span>
              <span className="w-2 h-4 bg-accent ml-2 animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
