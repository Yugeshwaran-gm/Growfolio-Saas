import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button variant="primary">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
