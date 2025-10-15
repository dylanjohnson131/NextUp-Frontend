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
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  // Don't render anything if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  // Show landing page for unauthenticated users
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h1 className="text-6xl font-bold text-white mb-6">NextUp</h1>
        <p className="text-xl text-slate-400 mb-12">
          Elevate your game with professional sports team management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link 
            href="/login" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg shadow-cyan-500/25"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 border border-slate-600"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 text-slate-500">
          <p>Manage teams • Track performance • Analyze opponents</p>
        </div>
      </div>
    </main>
  )
}