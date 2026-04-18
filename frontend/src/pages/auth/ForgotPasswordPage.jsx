import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Alert } from '../../components/ui/States'
import { authService } from '../../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await authService.requestPasswordReset(email)
      setMessage('Check your email for password reset instructions.')
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request password reset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">Reset Password</h1>
        <p className="text-center text-slate-600 mb-6">Enter your email to reset your password</p>

        {message && <Alert type="success" message={message} className="mb-4" />}
        {error && <Alert type="error" message={error} className="mb-4" />}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : null}

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-primary-500 hover:text-primary-600">
            Back to Sign In
          </Link>
        </div>
      </Card>
    </AuthLayout>
  )
}
