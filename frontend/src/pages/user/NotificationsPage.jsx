import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'

// Notification Item Component
function NotificationItem({ icon, iconBg, title, titleColor, description, time, isNew, actionLabel, onAction }) {
  return (
    <div className={`group relative flex items-center gap-5 p-5 bg-white rounded-xl shadow-sm border border-primary/5 hover:shadow-md ${isNew ? 'hover:border-accent/20' : ''} transition-all ${!isNew ? 'opacity-80' : ''}`}>
      <div className="absolute top-5 right-5 flex items-center gap-3">
        <span className="text-[11px] text-slate-400 font-medium">{time}</span>
        {isNew && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>}
        {!isNew && <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>}
      </div>
      <div className={`w-12 h-12 flex items-center justify-center ${iconBg} rounded-lg`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex flex-col pr-20">
        <h4 className={`${titleColor} font-bold text-base`}>{title}</h4>
        <p className="text-slate-500 text-sm mb-3">{description}</p>
        {actionLabel && (
          <button
            onClick={onAction}
            className="w-fit px-4 py-1.5 bg-accent text-primary text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'recruiter',
      icon: '🔍',
      iconBg: 'bg-plum-light',
      title: 'Hiring Manager viewed your profile',
      titleColor: 'text-accent',
      description: 'A senior recruiter from a Tier 1 SaaS company spent 3 minutes reviewing your Portfolio Analytics.',
      time: '2m ago',
      isNew: true,
      actionLabel: null,
    },
    {
      id: 2,
      type: 'integration',
      icon: '⚠️',
      iconBg: 'bg-red-50',
      title: 'GitHub Sync Failed',
      titleColor: 'text-primary',
      description: "Unable to fetch latest repository data for 'GrowFolio-Dashboard'. Token might be expired.",
      time: '1h ago',
      isNew: true,
      actionLabel: 'Retry Connection',
    },
    {
      id: 3,
      type: 'milestone',
      icon: '📊',
      iconBg: 'bg-plum-light',
      title: 'Milestone Reached!',
      titleColor: 'text-primary',
      description: 'Your portfolio reached <span class="font-bold text-primary">100 views</span> this week. That\'s a 40% increase from last week.',
      time: '5h ago',
      isNew: false,
      actionLabel: null,
    },
    {
      id: 4,
      type: 'system',
      icon: 'ℹ️',
      iconBg: 'bg-plum-light',
      title: 'Platform Maintenance',
      titleColor: 'text-primary',
      description: 'Scheduled maintenance will occur on Sunday at 02:00 UTC. The platform will be offline for approximately 15 minutes.',
      time: 'Yesterday',
      isNew: false,
      actionLabel: null,
    },
    {
      id: 5,
      type: 'integration',
      icon: '🔗',
      iconBg: 'bg-plum-light',
      title: 'New Integration Added',
      titleColor: 'text-primary',
      description: 'ProductHunt API successfully connected to your portfolio metrics.',
      time: '2 days ago',
      isNew: false,
      actionLabel: null,
    },
  ])

  const filters = ['All', 'Recruiters', 'Integrations', 'System']

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })))
  }

  const handleLoadMore = () => {
    alert('Loading previous notifications...')
  }

  const handleRetryConnection = (id) => {
    const notif = notifications.find(n => n.id === id)
    if (notif) {
      alert(`Retrying connection for: ${notif.title}`)
    }
  }

  const getFilteredNotifications = () => {
    let filtered = notifications

    if (activeFilter !== 'All') {
      const typeMap = {
        'Recruiters': 'recruiter',
        'Integrations': 'integration',
        'System': 'system',
      }
      filtered = filtered.filter(n => n.type === typeMap[activeFilter])
    }

    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const newNotificationsCount = notifications.filter(n => n.isNew).length
  const filteredNotifications = getFilteredNotifications()

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header Area */}
        <header className="border-b border-primary/5 bg-white/50 backdrop-blur-md flex items-center justify-between px-8 py-5 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-primary">Notifications</h2>
            {newNotificationsCount > 0 && (
              <span className="bg-accent/10 text-primary text-xs font-bold px-2 py-1 rounded-full border border-accent/20">
                {newNotificationsCount} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-plum-light/30 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="bg-accent text-primary font-bold text-sm px-5 py-2 rounded-lg hover:shadow-md transition-all"
            >
              Mark all as read
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Filters */}
            <div className="flex items-center gap-2 p-1.5 bg-plum-light/50 w-fit rounded-xl border border-primary/5">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-primary/60 hover:text-primary hover:bg-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Notification Stream */}
            <div className="flex flex-col gap-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    icon={notification.icon}
                    iconBg={notification.iconBg}
                    title={notification.title}
                    titleColor={notification.titleColor}
                    description={notification.description}
                    time={notification.time}
                    isNew={notification.isNew}
                    actionLabel={notification.actionLabel}
                    onAction={() => handleRetryConnection(notification.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">No notifications found</p>
                </div>
              )}
            </div>

            {/* Pagination / View More */}
            {filteredNotifications.length > 0 && (
              <div className="flex justify-center py-6">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                >
                  Load previous notifications
                  <span>⬇️</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
