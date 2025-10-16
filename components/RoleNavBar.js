import Link from 'next/link'
import { logout as apiLogout } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function RoleNavBar() {
  const { user, loading, isAuthenticated, logout } = useAuth()

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
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              NextUp
            </Link>
            <div className="text-slate-400 animate-pulse">Loading...</div>
          </div>
        </div>
      </nav>
    )
  }

  if (!isAuthenticated) {
    return (
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              NextUp
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-lg shadow-cyan-500/25"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Coach Navigation
  if (user.role === 'Coach') {
    return (
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              NextUp
            </Link>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/coach/dashboard" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/coach/depth-chart" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Depth Chart
              </Link>
              <Link 
                href="/coach/schedule" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Schedule
              </Link>
              <Link 
                href="/coach/game-stats" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Game Stats
              </Link>
              
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-slate-700">
                <span className="text-slate-400 font-medium">Coach {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 border border-slate-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Player Navigation  
  if (user.role === 'Player') {
    return (
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              NextUp
            </Link>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/player/dashboard" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/player/my-stats" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                My Stats
              </Link>
              <Link 
                href="/player/my-goals" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                My Goals
              </Link>
              <Link 
                href="/player/team-info" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                My Team
              </Link>
              <Link 
                href="/player/matchup" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Matchup
              </Link>
              
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-slate-700">
                <span className="text-slate-400 font-medium">{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 border border-slate-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Athletic Director Navigation
  if (user.role === 'AthleticDirector') {
    return (
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              NextUp
            </Link>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/athletic-director/dashboard" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/athletic-director/teams" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Teams
              </Link>
              <Link 
                href="/athletic-director/games" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Games
              </Link>
              <Link 
                href="/athletic-director/season" 
                className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Season Overview
              </Link>
              
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-slate-700">
                <span className="text-slate-400 font-medium">Athletic Director {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 border border-slate-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Default fallback
  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
            NextUp
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-medium">{user.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 border border-slate-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}