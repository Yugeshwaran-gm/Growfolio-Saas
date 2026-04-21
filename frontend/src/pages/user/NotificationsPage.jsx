import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { notificationService } from '../../services/notificationService'

// Notification Item Component
function NotificationItem({ notification, onMarkRead }) {
  const isUnread = !notification.is_read

  const iconMap = {
    integration: '🔗',
    system: 'ℹ️',
    recruiter: '🔍',
    milestone: '📊',
    default: '🔔',
  }

  const badgeMap = {
    integration: 'bg-red-50',
    system: 'bg-plum-light',
    recruiter: 'bg-plum-light',
    milestone: 'bg-plum-light',
  }

  const titleColor = isUnread ? 'text-primary' : 'text-slate-700'

  return (
    <div className={`group relative flex items-start gap-5 rounded-xl border border-primary/5 bg-white p-5 shadow-sm transition-all hover:shadow-md ${isUnread ? 'hover:border-accent/20' : 'opacity-80'}`}>
      <div className="absolute top-5 right-5 flex items-center gap-3">
        <span className="text-[11px] font-medium text-slate-400">
          {new Date(notification.created_at).toLocaleString()}
        </span>
        {isUnread ? (
          <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
        ) : (
          <div className="h-2.5 w-2.5 rounded-full bg-primary/20" />
        )}
      </div>

      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${badgeMap[notification.notification_type] || 'bg-plum-light'}`}>
        <span className="text-2xl">{iconMap[notification.notification_type] || iconMap.default}</span>
      </div>

      <div className="flex flex-1 flex-col pr-20">
        <h4 className={`${titleColor} text-base font-bold`}>{notification.title}</h4>
        <p className="mb-3 text-sm text-slate-500">{notification.message}</p>
        {isUnread && (
          <button
            type="button"
            onClick={onMarkRead}
            className="w-fit rounded-lg bg-accent px-4 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-accent/90"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update notification.')
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-primary/5 bg-white/50 px-8 py-5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-primary">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-accent/10 text-primary text-xs font-bold px-2 py-1 rounded-full border border-accent/20">
                {unreadCount} New
              </span>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="mx-auto max-w-4xl space-y-6">
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10">
                <Loading message="Loading notifications..." />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <ErrorState message={error} onRetry={loadNotifications} />
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <EmptyState message="No notifications available." />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={() => handleMarkRead(notification.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
