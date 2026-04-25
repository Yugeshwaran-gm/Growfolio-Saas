import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, PublicRoute, AdminRoute } from './ProtectedRoute'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import SetNewPassword from '../pages/auth/SetNewPassword'

// Public Pages
import HomePage from '../pages/public/HomePage'
import PublicPortfolio from '../pages/public/PublicPortfolio'
import NotFoundPage from '../pages/public/NotFoundPage'

// User Pages
import DashboardPage from '../pages/user/DashboardPage'
import ProjectsPage from '../pages/user/ProjectsPage'
import SkillsPage from '../pages/user/SkillsPage'
import ArticlesPage from '../pages/user/ArticlesPage'
import ArticleDetailPage from '../pages/user/ArticleDetailPage'
import ProfilePage from '../pages/user/ProfilePage'
import ProfileManagementPage from '../pages/user/ProfileManagementPage'
import AnalyticsDashboard from '../pages/user/AnalyticsDashboard'
import AccountSettingsPage from '../pages/user/AccountSettingsPage'
import NotificationsPage from '../pages/user/NotificationsPage'
import ApiIntegration from '../pages/user/ApiIntegration'

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import UsersPage from '../pages/admin/UsersPage'
import UserManagementPage from '../pages/admin/UserManagementPage'
import AdminReportsLogsPage from '../pages/admin/AdminReportsLogsPage'
import AdminContentPage from '../pages/admin/AdminContentPage'
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/portfolio/:username" element={<PublicPortfolio />} />
      
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/set-new-password"
        element={
          <PublicRoute>
            <SetNewPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <SetNewPassword />
          </PublicRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/skills"
        element={
          <ProtectedRoute>
            <SkillsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/articles"
        element={
          <ProtectedRoute>
            <ArticlesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/articles/:id"
        element={
          <ProtectedRoute>
            <ArticleDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile-management"
        element={
          <ProtectedRoute>
            <ProfileManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/account-settings"
        element={
          <ProtectedRoute>
            <AccountSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <AccountSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/integrations"
        element={
          <ProtectedRoute>
            <ApiIntegration />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <AdminRoute>
            <UserManagementPage />
          </AdminRoute>
        }

      />
      <Route
        path="/admin/reports-logs"
        element={
          <AdminRoute>
            <AdminReportsLogsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <AdminRoute>
            <AdminContentPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalyticsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettingsPage />
          </AdminRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
