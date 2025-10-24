import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser, getCurrentCoach, fetchTeams, fetchUpcomingGames } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function CoachDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [coach, setCoach] = useState(null)
  const [teams, setTeams] = useState([])
  const [upcomingGames, setUpcomingGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userInfo, coachInfo, teamsData] = await Promise.all([
          getCurrentUser(),
          getCurrentCoach(),
          fetchTeams()
        ])
        setUser(userInfo)
        setCoach(coachInfo)
        setTeams(teamsData || [])
        
        if (coachInfo && coachInfo.team) {
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
    <main className="container mx-auto px-4 py-8">
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Coach Dashboard</h1>
            <p style={{ color: '#b6c2b7', fontSize: '1.1rem', marginBottom: 0 }}>Welcome back! Here's an overview of your teams and recent activity.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {/* My Teams Section */}
            <div style={{ flex: '1 1 340px', background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', minWidth: '300px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.2rem' }}>My Teams</h2>
              {coach?.team ? (
                <div 
                  onClick={() => router.push('/coach/depth-chart')}
                  style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', transition: 'background 0.2s', marginBottom: '0.5rem' }}
                  onMouseOver={e => e.currentTarget.style.background = '#2a3440'}
                  onMouseOut={e => e.currentTarget.style.background = '#282c34'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1.15rem', margin: 0 }}>
                        {coach.team.name}
                        <span style={{ color: '#b6c2b7', fontWeight: 400, fontSize: '1rem' }}> (2025-2026)</span>
                      </h3>
                      <p style={{ color: '#b6c2b7', fontSize: '0.98rem', margin: '0.2rem 0 0 0' }}>{coach.team.location}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.98rem', fontWeight: 500 }}>
                        Click to manage →
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', textAlign: 'center', color: '#b6c2b7', fontSize: '1rem' }}>
                  No team assigned yet
                </div>
              )}
            </div>
            {/* Upcoming Games */}
            <div style={{ flex: '1 1 340px', background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', minWidth: '300px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.2rem' }}>Upcoming Games</h2>
              {upcomingGames.length > 0 ? (
                upcomingGames.slice(0, 2).map((game, index) => (
                  <div key={game.gameId || index} style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                    <div>
                      <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.08rem', margin: 0 }}>
                        {game.isHome ? 'vs.' : '@'} {game.opponent?.name || 'TBD'}
                      </p>
                      <p style={{ color: '#b6c2b7', fontSize: '0.98rem', margin: '0.2rem 0 0 0' }}>
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
                      {game.location && (
                        <p style={{ color: '#b6c2b7', fontSize: '0.92rem', margin: '0.15rem 0 0 0' }}>{game.location}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => router.push(`/coach/opponent/${game.opponent?.teamId}`)}
                      style={{ background: 'var(--primary)', color: '#fff', padding: '0.5rem 1.1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.98rem', border: 'none', cursor: game.opponent?.teamId ? 'pointer' : 'not-allowed', opacity: game.opponent?.teamId ? 1 : 0.6, transition: 'background 0.2s' }}
                      disabled={!game.opponent?.teamId}
                    >
                      Scout Team
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', textAlign: 'center', color: '#b6c2b7', fontSize: '1rem' }}>
                  No upcoming games scheduled
                </div>
              )}
            </div>
          </div>
        </main>
      </main>
  )
}

export default withAuth(CoachDashboard, 'Coach')