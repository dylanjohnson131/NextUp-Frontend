import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

function withAuth(WrappedComponent, requiredRoles = null) {
  return function AuthenticatedComponent(props) {
    const { user, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push('/login')
          return
        }

        // Check role if specified - now supports array of roles
        if (requiredRoles) {
          const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
          if (!allowedRoles.includes(user?.role)) {
            // Redirect to appropriate dashboard based on user role
            if (user?.role === 'Coach') {
              router.push('/coach/dashboard')
            } else if (user?.role === 'Player') {
              router.push('/player/dashboard')
            } else if (user?.role === 'AthleticDirector') {
              router.push('/athletic-director/dashboard')
            } else {
              router.push('/dashboard')
            }
            return
          }
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
    if (requiredRoles) {
      const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
      if (!allowedRoles.includes(user?.role)) {
        return null
      }
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
        } else if (user?.role === 'AthleticDirector') {
          router.push('/athletic-director/dashboard')
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

// Make withAuth the default export
export default withAuth