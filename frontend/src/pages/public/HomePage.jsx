import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { Loading } from '../../components/ui/Loading'
import { analyticsService } from '../../services/analyticsService'

export default function HomePage() {
  const [profiles, setProfiles] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [profilesError, setProfilesError] = useState('')

  const loadProfiles = async () => {
    setLoadingProfiles(true)
    setProfilesError('')

    try {
      const data = await analyticsService.getExploreProfiles({ ordering: 'views' })
      const profileList = Array.isArray(data) ? data : data?.results || []
      setProfiles(profileList.slice(0, 3))
    } catch (err) {
      setProfilesError(err.response?.data?.detail || 'Failed to load featured profiles.')
    } finally {
      setLoadingProfiles(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container-custom h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-500">
            GrowFolio
          </Link>
          <div className="space-x-4">
            <Link to="/login" className="text-slate-600 hover:text-slate-900">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Build Your Professional Portfolio
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Showcase your projects, skills, and growth journey. Connect with opportunities and grow your career.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg" className="mb-4">
              Start for Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-custom py-20 grid md:grid-cols-3 gap-8">
        <div className="card-base p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-primary-500 text-2xl">📁</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Portfolio Projects</h3>
          <p className="text-slate-600">Showcase your best work with detailed project descriptions and links.</p>
        </div>

        <div className="card-base p-6">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-accent-500 text-2xl">⭐</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Skills Tracking</h3>
          <p className="text-slate-600">Track and display your technical skills with proficiency levels.</p>
        </div>

        <div className="card-base p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-primary-500 text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Share Articles</h3>
          <p className="text-slate-600">Write and share articles about your learnings and experiences.</p>
        </div>
      </div>

      {/* Explore Section */}
      <div className="container-custom pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Explore Top Portfolios</h2>
          <p className="mt-2 text-slate-600">Trending creator profiles based on portfolio views.</p>
        </div>

        {loadingProfiles ? (
          <div className="card-base p-8">
            <Loading message="Loading featured profiles..." />
          </div>
        ) : profilesError ? (
          <div className="card-base p-8">
            <ErrorState message={profilesError} onRetry={loadProfiles} />
          </div>
        ) : profiles.length === 0 ? (
          <div className="card-base p-8">
            <EmptyState message="No public portfolios found yet." />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {profiles.map((profile) => (
              <article key={profile.username} className="card-base p-6">
                <div className="mb-4 flex items-center gap-3">
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={`${profile.full_name || profile.username} profile`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">
                      {(profile.full_name || profile.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900">{profile.full_name || profile.username}</h3>
                    <p className="text-sm text-slate-500">@{profile.username}</p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-slate-600">{profile.bio || 'No bio available.'}</p>

                <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{Number(profile.projects_count || 0)} projects</span>
                  <span>{Number(profile.portfolio_views || 0).toLocaleString()} views</span>
                </div>

                <Link to={profile.portfolio_url || `/portfolio/${profile.username}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    View Portfolio
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
