import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

export function withAuth(WrappedComponent, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    const { user, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push('/login')
          return
        }

        // Check role if specified
        if (requiredRole && user?.role !== requiredRole) {
          // Redirect to appropriate dashboard based on user role
          if (user?.role === 'Coach') {
            router.push('/coach/dashboard')
          } else if (user?.role === 'Player') {
            router.push('/player/dashboard')
          } else {
            router.push('/dashboard')
          }
          return
        }
      }
    }, [loading, isAuthenticated, user, router])

    // Show loading while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )
    }

    // Don't render the component if not authenticated
    if (!isAuthenticated) {
      return null
    }

    // Don't render if role is required but doesn't match
    if (requiredRole && user?.role !== requiredRole) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

// Helper function for pages that should redirect authenticated users
export function withGuest(WrappedComponent) {
  return function GuestComponent(props) {
    const { user, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && isAuthenticated) {
        // Redirect to appropriate dashboard based on user role
        if (user?.role === 'Coach') {
          router.push('/coach/dashboard')
        } else if (user?.role === 'Player') {
          router.push('/player/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    }, [loading, isAuthenticated, user, router])

    // Show loading while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )
    }

    // Don't render if authenticated (will redirect)
    if (isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}