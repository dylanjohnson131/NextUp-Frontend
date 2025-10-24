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
          if (router.pathname !== '/login') {
            router.push('/login')
          }
          return
        }

        if (requiredRoles) {
          const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
          if (!allowedRoles.includes(user?.role)) {
            let destination = '/dashboard';
            if (user?.role === 'Coach') destination = '/coach/dashboard';
            else if (user?.role === 'Player') destination = '/player/dashboard';
            else if (user?.role === 'AthleticDirector') destination = '/athletic-director/dashboard';
            if (router.pathname !== destination) {
              router.push(destination);
            }
            return;
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
        let destination = '/dashboard';
        if (user?.role === 'Coach') destination = '/coach/dashboard';
        else if (user?.role === 'Player') destination = '/player/dashboard';
        else if (user?.role === 'AthleticDirector') destination = '/athletic-director/dashboard';
        if (router.pathname !== destination) {
          router.push(destination);
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