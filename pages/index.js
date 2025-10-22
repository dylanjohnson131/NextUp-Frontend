import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect authenticated users to their role-specific dashboard
      if (user.role === 'Coach') {
        router.push('/coach/dashboard')
      } else if (user.role === 'Player') {
        router.push('/player/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [loading, isAuthenticated, user, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <main>
        <div>Loading...</div>
      </main>
    )
  }

  // Don't render anything if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  // Show landing page for unauthenticated users
  return (
    <main>
      <div>
        <h1>NextUp</h1>
        <p>
          Elevate your game with professional sports team management
        </p>

        <div>
          <Link href="/login">Sign In</Link>
          <Link href="/register">Create Account</Link>
        </div>

        <div>
          <p>Manage teams • Track performance • Analyze opponents</p>
        </div>
      </div>
    </main>
  )
}