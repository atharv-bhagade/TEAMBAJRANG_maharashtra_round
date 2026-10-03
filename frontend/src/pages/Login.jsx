import { Navigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import LoginForm from '../features/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { isAuthenticated, reAuthRequired } = useAuth()
  if (isAuthenticated && !reAuthRequired) return <Navigate to="/drop" replace />

  return (
    <PageContainer narrow>
      <div className="mx-auto max-w-md">
        <Card className="fd-fade-up">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
            {reAuthRequired ? 'Please sign in again to continue.' : 'Welcome to Fair Drop'}
          </h1>
          <p className="mt-2 mb-6 text-slate-600">
            {reAuthRequired
              ? 'For security, please sign in again.'
              : 'Sign in to join the drop with your account.'}
          </p>
          <LoginForm />
        </Card>
      </div>
    </PageContainer>
  )
}
