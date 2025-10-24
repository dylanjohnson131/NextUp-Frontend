import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import withAuth from '../../../hocs/withAuth'
import PlayerStatsCard from '../../../components/PlayerStatsCard'
import { fetchPlayerById, fetchPlayerStats } from '../../../lib/api'
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

  const aggregateStats = (statsArr) => {
    if (!Array.isArray(statsArr) || statsArr.length === 0) return {};
    const result = {};
    statsArr.forEach(game => {
      Object.entries(game).forEach(([key, value]) => {
        if (typeof value === 'number') {
          result[key] = (result[key] || 0) + value;
        }
      });
    });
    // Optionally, handle averages for percentage fields here
    return result;
  };

  const loadPlayerData = async () => {
    try {
      setLoading(true)
      const [playerData, playerStats] = await Promise.all([
        fetchPlayerById(playerId),
        fetchPlayerStats(playerId).catch(() => null)
      ])
      // Aggregate stats array into a summary object
      const summaryStats = aggregateStats(playerStats);
      setPlayer({ ...playerData, stats: summaryStats })
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
              &larr; Back to Depth Chart
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/coach/depth-chart" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
          &larr; Back to Depth Chart
      </Link>
      <PlayerStatsCard player={player} />
    </main>
  )
}

export default withAuth(PlayerStats, 'Coach')