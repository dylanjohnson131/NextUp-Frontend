import { useEffect, useState } from 'react'
import withAuth from '../../hocs/withAuth'
import PlayerStatsCard from '../../components/PlayerStatsCard'
import { fetchPlayerStats, getCurrentPlayer } from '../../lib/api'

function MyStats() {
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        setLoading(true)
  const playerData = await getCurrentPlayer()
        const stats = await fetchPlayerStats(playerData.playerId).catch(() => null)
        setPlayer({ ...playerData, stats })
      } catch (err) {
        console.error('Player info error:', err)
        setError('Failed to load your player information')
      } finally {
        setLoading(false)
      }
    }
    loadPlayer()
  }, [])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-white">Loading your stats...</div>
      </main>
    )
  }

  if (error || !player) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">{error || 'Player not found'}</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Stats</h1>
      <PlayerStatsCard player={player} />
    </main>
  )
}

export default withAuth(MyStats, 'Player')