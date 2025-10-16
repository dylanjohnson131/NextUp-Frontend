import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchPlayerStats, fetchPlayerById } from '../../../lib/api'
import withAuth from '../../../hocs/withAuth'
import Link from 'next/link'

function PlayerStats() {
  const router = useRouter()
  const { playerId } = router.query
  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (playerId) {
      loadPlayerData()
    }
  }, [playerId])

  const loadPlayerData = async () => {
    try {
      setLoading(true)
      const [playerData, playerStats] = await Promise.all([
        fetchPlayerById(playerId),
        fetchPlayerStats(playerId).catch(() => null) // Stats might not exist
      ])
      
      setPlayer(playerData)
      setStats(playerStats)
    } catch (error) {
      console.error('Failed to load player data:', error)
      setError('Failed to load player information')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-white">Loading player stats...</div>
        </div>
      </main>
    )
  }

  if (error || !player) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error || 'Player not found'}</div>
          <Link href="/coach/depth-chart" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Depth Chart
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/coach/depth-chart" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
          ← Back to Depth Chart
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Player Stats</h1>
        <p className="text-slate-400">Detailed performance metrics and information</p>
      </div>

      {/* Player Info Card */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              #{player.jerseyNumber} {player.name}
            </h2>
            <div className="flex flex-wrap gap-4 text-slate-300">
              <span className="bg-slate-700 px-3 py-1 rounded">
                {player.position || 'No Position'}
              </span>
              <span>Age: {player.age}</span>
              {player.height && <span>Height: {player.height}</span>}
              {player.weight && <span>Weight: {player.weight} lbs</span>}
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-right">
              <div className="text-sm text-slate-400">Team</div>
              <div className="text-white font-medium">{player.team?.name || 'No Team'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Statistics */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Game Statistics</h3>
          {stats ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Games Played</span>
                <span className="text-white font-medium">{stats.gamesPlayed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Points</span>
                <span className="text-white font-medium">{stats.totalPoints || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Points/Game</span>
                <span className="text-white font-medium">
                  {stats.gamesPlayed > 0 ? (stats.totalPoints / stats.gamesPlayed).toFixed(1) : '0.0'}
                </span>
              </div>
              {stats.assists !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Assists</span>
                  <span className="text-white font-medium">{stats.assists}</span>
                </div>
              )}
              {stats.rebounds !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Rebounds</span>
                  <span className="text-white font-medium">{stats.rebounds}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No game statistics available yet</p>
              <p className="text-slate-500 text-sm mt-2">Stats will appear after games are played</p>
            </div>
          )}
        </div>

        {/* Season Performance */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Season Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Season Status</span>
              <span className="text-green-400 font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Position Rank</span>
              <span className="text-white font-medium">Starter</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Minutes Played</span>
              <span className="text-white font-medium">{stats?.minutesPlayed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Injury Status</span>
              <span className="text-green-400 font-medium">Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Games</h3>
        <div className="text-center py-8">
          <p className="text-slate-400">Recent game performance coming soon</p>
          <p className="text-slate-500 text-sm mt-2">Individual game breakdowns will be available here</p>
        </div>
      </div>

      {/* Player Goals */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Player Goals</h3>
        <div className="text-center py-8">
          <p className="text-slate-400">Player goals and objectives coming soon</p>
          <p className="text-slate-500 text-sm mt-2">Personal development goals will be displayed here</p>
        </div>
      </div>
    </main>
  )
}

export default withAuth(PlayerStats, 'Coach')