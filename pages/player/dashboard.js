import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import withAuth from '../../hocs/withAuth'
import { getCurrentUser, getCurrentPlayer, fetchUpcomingGames } from '../../lib/api'

function PlayerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [playerStats, setPlayerStats] = useState([])
  const [nextGame, setNextGame] = useState(null)
  const [opponent, setOpponent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const logUserInfo = (userInfo) => {
      if (userInfo) {
        console.log('Fetched userInfo:', userInfo);
      } else {
        console.warn('No userInfo returned from getCurrentUser');
      }
    }
    const loadData = async () => {
      try {
        let userInfo = null;
        let currentPlayer = null;
        try {
          userInfo = await getCurrentUser();
        } catch (err) {
          console.error('Error fetching userInfo:', err);
        }
        try {
          currentPlayer = await getCurrentPlayer();
        } catch (err) {
          console.error('Error fetching currentPlayer:', err);
        }

        logUserInfo(userInfo);
        setUser(userInfo)
        setPlayerData(currentPlayer)
        // Fetch player stats if we have a playerId
        if (currentPlayer?.playerId) {
          try {
            const stats = await import('../../lib/api').then(api => api.fetchPlayerStats(currentPlayer.playerId));
            setPlayerStats(stats || []);
          } catch (err) {
            console.error('Error fetching player stats:', err);
          }
        }
        // Fetch next game if player has a team
        if (currentPlayer?.team?.teamId) {
          try {
            const upcomingGames = await fetchUpcomingGames(currentPlayer.team.teamId)
            if (upcomingGames && upcomingGames.length > 0) {
              const game = upcomingGames[0];
              setNextGame(game);
              const myTeamId = currentPlayer.team.teamId;
              let opp = null;
              if (game.homeTeam?.homeTeamId === myTeamId) {
                opp = game.awayTeam;
              } else if (game.awayTeam?.awayTeamId === myTeamId) {
                opp = game.homeTeam;
              }
              setOpponent(opp);
            }
          } catch (error) {
            console.error('Error fetching upcoming games:', error);
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
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)', paddingTop: '9rem' }}>
        <div style={{ color: '#b6c2d1', fontSize: '1.2rem' }}>Loading...</div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)', paddingTop: '9rem', paddingBottom: '3rem' }}>
      <section style={{ maxWidth: 950, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary, #00e0ff)', letterSpacing: '2px', marginBottom: '0.5rem', textShadow: '0 2px 12px #00e0ff33' }}>Player Dashboard</h1>
          <p style={{ color: '#b6c2d1', fontSize: '1.15rem', fontWeight: 500 }}>
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Player'}! Track your progress and team performance.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.2rem' }}>
          {/* Player Quick Stats - flush with Next Game card */}
          <div style={{ background: 'var(--card, #222)', borderRadius: '16px', boxShadow: '0 2px 16px #00e0ff11', padding: '2rem 1.5rem', marginBottom: '0', width: '190%' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary, #00e0ff)', marginBottom: '1.2rem' }}>Your Profile</h2>
            {playerData ? (
              <div style={{ display: 'grid', rowGap: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#b6c2d1' }}>Position:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{playerData.position && playerData.position.trim() !== '' ? playerData.position : 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#b6c2d1' }}>Jersey #:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{playerData.jerseyNumber ? playerData.jerseyNumber : 'Not assigned'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#b6c2d1' }}>Age:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{playerData.age ? playerData.age : 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#b6c2d1' }}>Team:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{playerData.team?.name || 'No team'}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: '#b6c2d1' }}>Player data not found</p>
            )}
          </div>
          {/* Recent Performance Chart removed as requested */}
        </div>
        {/* Next Game */}
        <div style={{ background: 'var(--card, #222)', borderRadius: '16px', boxShadow: '0 2px 16px #00e0ff11', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary, #00e0ff)', marginBottom: '1.2rem' }}>Next Game</h2>
          <div style={{ background: '#1e293b', borderRadius: '10px', padding: '1.2rem 1rem' }}>
            {nextGame ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.08rem' }}>
                    vs. {opponent?.name || opponent?.Name || 'TBD'}
                  </p>
                  <p style={{ color: '#b6c2d1', fontSize: '1rem' }}>
                    {nextGame.gameDate ? new Date(nextGame.gameDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'Date TBD'} - {nextGame.gameTime || 'Time TBD'}
                  </p>
                  {nextGame.location && (
                    <p style={{ color: '#7dd3fc', fontSize: '0.98rem' }}>{nextGame.location}</p>
                  )}
                </div>
                <button
                  onClick={() => router.push('/player/matchup')}
                  style={{ background: 'var(--primary, #00e0ff)', color: '#1e293b', fontWeight: 700, fontSize: '1rem', padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px #00e0ff33', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
                >
                  Scout Opponent
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#b6c2d1' }}>No upcoming games scheduled</p>
                <p style={{ color: '#7dd3fc', fontSize: '0.98rem', marginTop: '0.7rem' }}>Check back later for game updates</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default withAuth(PlayerDashboard, 'Player')