import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import withAuth from '../../hocs/withAuth'
import { getCurrentUser, getCurrentPlayer, fetchUpcomingGames, fetchPlayerStats } from '../../lib/api'

function PlayerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [nextGame, setNextGame] = useState(null)
  const [opponent, setOpponent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userInfo, currentPlayer] = await Promise.all([
          getCurrentUser().catch(() => null),
          getCurrentPlayer().catch(() => null),
        ])

        setUser(userInfo)
        setPlayerData(currentPlayer)

        if (currentPlayer?.playerId) {
          fetchPlayerStats(currentPlayer.playerId).catch(() => null)
        }

        if (currentPlayer?.team?.teamId) {
          try {
            const upcomingGames = await fetchUpcomingGames(currentPlayer.team.teamId)
            if (upcomingGames && upcomingGames.length > 0) {
              const game = upcomingGames[0]
              setNextGame(game)
              const myTeamId = currentPlayer.team.teamId
              let opp = null
              if (game.homeTeam?.homeTeamId === myTeamId) {
                opp = game.awayTeam
              } else if (game.awayTeam?.awayTeamId === myTeamId) {
                opp = game.homeTeam
              }
              setOpponent(opp)
            }
          } catch {
            // no upcoming games
          }
        }
      } catch {
        // handled per-call above
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-gradient)', paddingTop: 'var(--navbar-height)' }}>
        <div style={{ color: '#b6c2d1', fontSize: '1.2rem' }}>Loading...</div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background-gradient)', paddingTop: 'calc(var(--navbar-height) + 2rem)', paddingBottom: '3rem' }}>
      <section style={{ maxWidth: 950, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', marginBottom: '0.4rem' }}>
            Player Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Player'}!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Profile Card */}
          <div style={{ background: 'var(--card)', borderRadius: '16px', border: '1px solid rgba(0,224,255,0.08)', padding: '1.75rem 1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Your Profile</h2>
            {playerData ? (
              <div style={{ display: 'grid', rowGap: '0.9rem' }}>
                {[
                  ['Position', playerData.position?.trim() || 'Not set'],
                  ['Jersey #', playerData.jerseyNumber ?? 'Not assigned'],
                  ['Age', playerData.age ?? 'Not set'],
                  ['Team', playerData.team?.name || 'No team'],
                  ['Height', playerData.height || 'Not set'],
                  ['Weight', playerData.weight ? `${playerData.weight} lbs` : 'Not set'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{label}</span>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)' }}>Profile data unavailable</p>
            )}
          </div>

          {/* Next Game Card */}
          <div style={{ background: 'var(--card)', borderRadius: '16px', border: '1px solid rgba(0,224,255,0.08)', padding: '1.75rem 1.5rem' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Game</h2>
            <div style={{ background: '#162032', borderRadius: '10px', padding: '1.2rem 1rem' }}>
              {nextGame ? (
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                    vs. {opponent?.name || opponent?.Name || 'TBD'}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    {nextGame.gameDate ? new Date(nextGame.gameDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    }) : 'Date TBD'}
                  </p>
                  {nextGame.location && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{nextGame.location}</p>
                  )}
                  <button
                    onClick={() => router.push('/player/matchup')}
                    style={{ marginTop: '1rem', background: 'var(--primary)', color: '#0a192f', fontWeight: 700, fontSize: '0.9rem', padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  >
                    Scout Opponent
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <p style={{ color: 'var(--muted)' }}>No upcoming games scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ background: 'var(--card)', borderRadius: '16px', border: '1px solid rgba(0,224,255,0.08)', padding: '1.75rem 1.5rem' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { href: '/player/my-stats', label: 'My Stats' },
              { href: '/player/my-goals', label: 'My Goals' },
              { href: '/player/team-info', label: 'Team Info' },
              { href: '/player/matchup', label: 'Matchup' },
            ].map(({ href, label }) => (
              <button
                key={href}
                onClick={() => router.push(href)}
                style={{ background: '#162032', border: '1px solid rgba(0,224,255,0.12)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default withAuth(PlayerDashboard, 'Player')
