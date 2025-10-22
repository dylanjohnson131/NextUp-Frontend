import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentCoach, fetchUpcomingGames } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function Schedule() {
  const router = useRouter()
  const [coach, setCoach] = useState(null)
  const [upcomingGames, setUpcomingGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const coachInfo = await getCurrentCoach()
        setCoach(coachInfo)
        
        // Fetch upcoming games if coach has a team
        if (coachInfo?.team?.teamId) {
          try {
            const gamesData = await fetchUpcomingGames(coachInfo.team.teamId)
            setUpcomingGames(gamesData || [])
          } catch (error) {
            setUpcomingGames([])
          }
        }
      } catch (error) {
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
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', letterSpacing: '0.5px' }}>Schedule</h1>
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.2rem' }}>Upcoming Matchups</h2>
        {upcomingGames.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {upcomingGames.map((game, index) => (
              <div key={game.gameId || index} style={{ background: '#282c34', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}>
                <div>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.15rem', margin: 0 }}>
                    {game.isHome ? 'vs.' : '@'} {game.opponent?.name || 'TBD'}
                  </p>
                  <p style={{ color: '#b6c2b7', fontSize: '1rem', margin: '0.2rem 0 0 0' }}>
                    {new Date(game.gameDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} - {new Date(game.gameDate).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  <p style={{ color: '#b6c2b7', fontSize: '0.98rem', margin: '0.15rem 0 0 0' }}>
                    {game.isHome ? 'Home Game' : 'Away Game'}
                  </p>
                  {game.location && (
                    <p style={{ color: '#b6c2b7', fontSize: '0.92rem', margin: '0.15rem 0 0 0' }}>Location: {game.location}</p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/coach/opponent/${game.opponent?.teamId}`)}
                  style={{ background: 'var(--primary)', color: '#fff', padding: '0.7rem 1.3rem', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: game.opponent?.teamId ? 'pointer' : 'not-allowed', opacity: game.opponent?.teamId ? 1 : 0.6, transition: 'background 0.2s' }}
                  disabled={!game.opponent?.teamId}
                >
                  Scout Team
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', color: '#b6c2b7', fontSize: '1.1rem' }}>
            No upcoming games scheduled
          </div>
        )}
      </div>
    </main>
  )
}

export default withAuth(Schedule, 'Coach')