import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser, getCurrentPlayer, fetchPlayers } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function PlayerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userInfo, currentPlayer] = await Promise.all([
          getCurrentUser(),
          getCurrentPlayer()
        ])

        setUser(userInfo)
        setPlayerData(currentPlayer)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Player Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user.Name} Track your progress and team performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Quick Stats */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>

            {playerData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Position:</span>
                  <span className="text-white text-right">{playerData.position && playerData.position.trim() !== '' ? playerData.position : 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Jersey #:</span>
                  <span className="text-white text-right">{playerData.jerseyNumber ? playerData.jerseyNumber : 'Not assigned'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Age:</span>
                  <span className="text-white text-right">{playerData.age ? playerData.age : 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Team:</span>
                  <span className="text-white text-right">{playerData.team?.name || 'No team'}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Player data not found</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/player/my-stats')}
                className="w-full bg-cyan-400 text-slate-900 px-4 py-3 rounded font-medium hover:bg-cyan-300 transition-colors"
              >
                View My Stats
              </button>
              <button 
                onClick={() => router.push('/player/my-goals')}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded font-medium hover:bg-slate-600 transition-colors"
              >
                Update Goals
              </button>
              <button 
                onClick={() => router.push('/player/team-info')}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded font-medium hover:bg-slate-600 transition-colors"
              >
                View Team Info
              </button>
            </div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Performance</h2>
          <div className="bg-slate-700 rounded p-4 text-center">
            <p className="text-slate-400">Performance tracking coming soon...</p>
            <p className="text-slate-500 text-sm mt-2">Stats will be displayed here once games are recorded</p>
          </div>
        </div>

        {/* Next Game */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Next Game</h2>
          <div className="bg-slate-700 rounded p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">vs. Storm Riders</p>
                <p className="text-slate-400 text-sm">Oct 12, 2025 - 3:00 PM</p>
              </div>
              <button className="bg-cyan-400 text-slate-900 px-3 py-1 rounded text-sm hover:bg-cyan-300">
                Scout Opponent
              </button>
            </div>
          </div>
        </div>
      </main>
  )
}

export default withAuth(PlayerDashboard, 'Player')