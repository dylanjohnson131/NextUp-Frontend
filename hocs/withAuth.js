import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

function withAuth(WrappedComponent, requiredRoles = null) {
  return function AuthenticatedComponent(props) {
    const { user, loading, isAuthenticated, isLoggingOut } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !isLoggingOut) {
        if (!isAuthenticated) {
          router.push('/login')
          return
        }

        if (requiredRoles) {
          const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
          if (!allowedRoles.includes(user?.role)) {
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
    }, [loading, isAuthenticated, user, router, isLoggingOut])

    if (loading || isLoggingOut) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )
    }

    if (!isAuthenticated && !isLoggingOut) {
      return null
    }

    if (requiredRoles) {
      const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
      if (!allowedRoles.includes(user?.role)) {
        return null
      }
    }

    return <WrappedComponent {...props} />
  }
}

export function withGuest(WrappedComponent) {
  return function GuestComponent(props) {
    const { user, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && isAuthenticated) {
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

    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )
    }

    if (isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}
export default withAuth