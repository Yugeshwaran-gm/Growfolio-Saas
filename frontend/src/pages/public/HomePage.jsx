import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function HomePage() {
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
    </div>
  )
}
