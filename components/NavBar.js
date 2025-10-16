import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getCurrentUser, logout as apiLogout } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    getCurrentUser()
      .then(userData => {
        setUser(userData)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  const handleLogout = async () => {
    try {
      logout() // Call AuthContext logout first (clears state and redirects)
      await apiLogout() // Then call API logout to clear server session
    } catch (err) {
      console.error('Logout failed:', err)
      // Fallback redirect if something goes wrong
      window.location.href = '/'
    }
  }

  if (loading) {
    return (
      <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-cyan-400">NextUp</Link>
          <div className="text-slate-400">Loading...</div>
        </div>
      </nav>
    )
  }

  if (!user || !user.IsAuthenticated) {
    return (
      <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-cyan-400">NextUp</Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white">Login</Link>
            <Link href="/register" className="bg-cyan-400 text-slate-900 px-3 py-1 rounded">Sign Up</Link>
          </div>
        </div>
      </nav>
    )
  }

  // Coach Navigation
  if (user.Role === 'Coach') {
    return (
      <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-cyan-400">NextUp</Link>
          
          <div className="flex items-center gap-6">
            <Link href="/coach/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
            <Link href="/coach/my-team" className="text-slate-300 hover:text-white">My Team</Link>
            <Link href="/coach/schedule" className="text-slate-300 hover:text-white">Schedule</Link>
            <Link href="/coach/game-stats" className="text-slate-300 hover:text-white">Game Stats</Link>
            
            <div className="flex items-center gap-3 ml-6 border-l border-slate-700 pl-6">
              <span className="text-slate-400">Coach {user.Name}</span>
              <button 
                onClick={handleLogout}
                className="text-slate-300 hover:text-white text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Player Navigation
  if (user.Role === 'Player') {
    return (
      <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-cyan-400">NextUp</Link>
          
          <div className="flex items-center gap-6">
            <Link href="/player/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
            <Link href="/player/my-stats" className="text-slate-300 hover:text-white">My Stats</Link>
            <Link href="/player/my-goals" className="text-slate-300 hover:text-white">My Goals</Link>
            <Link href="/player/team-info" className="text-slate-300 hover:text-white">Team Info</Link>
            <Link href="/player/matchup" className="text-slate-300 hover:text-white">Matchup</Link>
            
            <div className="flex items-center gap-3 ml-6 border-l border-slate-700 pl-6">
              <span className="text-slate-400">{user.Name}</span>
              <button 
                onClick={handleLogout}
                className="text-slate-300 hover:text-white text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Default fallback
  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-cyan-400">NextUp</Link>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">{user.Name}</span>
          <button 
            onClick={handleLogout}
            className="text-slate-300 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
