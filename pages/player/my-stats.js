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
      <main className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text)', fontSize: '1.2rem', textAlign: 'center' }}>Loading your stats...</div>
      </main>
    );
  }

  if (error || !player) {
    return (
      <main className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#ff4d4f', fontSize: '1.2rem', textAlign: 'center' }}>{error || 'Player not found'}</div>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 700, margin: '4rem auto', padding: '2.5rem 2rem', background: 'var(--card)', borderRadius: 16, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a' }}>
      <h1 style={{
        fontSize: '2.6rem',
        fontWeight: 800,
        marginBottom: '2.2rem',
        background: 'var(--text-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        textAlign: 'center',
        letterSpacing: '2px',
        textShadow: '0 1px 2px #222, 0 0 10px #283e5133'
      }}>My Stats</h1>
      <PlayerStatsCard player={player} />
    </main>
  );
}

export default withAuth(MyStats, 'Player')