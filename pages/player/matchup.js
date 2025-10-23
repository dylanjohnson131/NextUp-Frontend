import { useState, useEffect } from 'react'
import { getCurrentPlayer, fetchUpcomingGames, fetchTeamById } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function Matchup() {
  const [nextGame, setNextGame] = useState(null)
  const [opponent, setOpponent] = useState(null)
  const [opponentRoster, setOpponentRoster] = useState([])
  const [loading, setLoading] = useState(true)
  const [rosterLoading, setRosterLoading] = useState(false)

  useEffect(() => {
    const loadMatchupData = async () => {
      try {
        const currentPlayer = await getCurrentPlayer()
        // Fetch next game if player has a team
        if (currentPlayer?.team?.teamId) {
          try {
            const upcomingGames = await fetchUpcomingGames(currentPlayer.team.teamId)
            if (upcomingGames && upcomingGames.length > 0) {
              const game = upcomingGames[0];
              setNextGame(game);
              // Determine opponent based on backend's homeTeam/awayTeam and homeTeamId/awayTeamId
              const myTeamId = currentPlayer.team.teamId;
              let opp = null;
              if (game.homeTeam?.homeTeamId === myTeamId) {
                opp = game.awayTeam;
              } else if (game.awayTeam?.awayTeamId === myTeamId) {
                opp = game.homeTeam;
              }
              setOpponent(opp);
              // Debug: log opponent object
              console.log('Opponent:', opp);
              // Use awayTeamId or homeTeamId for opponent team
              const oppTeamId = opp?.awayTeamId || opp?.homeTeamId;
              console.log('Opponent teamId used for API call:', oppTeamId);
              if (oppTeamId) {
                setRosterLoading(true);
                try {
                  const teamData = await fetchTeamById(oppTeamId);
                  console.log('Opponent teamData:', teamData);
                  setOpponentRoster(teamData?.players || []);
                } catch (err) {
                  console.error('Error fetching opponent teamData:', err);
                  setOpponentRoster([]);
                } finally {
                  setRosterLoading(false);
                }
              } else {
                console.warn('No valid teamId found for opponent.');
              }
            }
          } catch (error) {}
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    loadMatchupData()
  }, [])
  // Helper to group roster by position
  const { groupPlayersByPosition, categorizePositions } = require('../../lib/positions');
  const grouped = groupPlayersByPosition(opponentRoster);
  const categorized = categorizePositions(grouped);

  return (
    <main className="container" style={{ maxWidth: 900, margin: '6rem auto', padding: '2rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)', borderRadius: 12 }}>
      <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '2.2rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent', textAlign: 'center', letterSpacing: '2px', textShadow: '0 1px 2px #222, 0 0 10px #283e5133' }}>Next Matchup</h1>
      <div style={{ background: 'var(--card)', borderRadius: 16, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a', padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--text)' }}>Upcoming Game</h2>
        <div style={{ background: '#181f2a', borderRadius: 10, padding: '1.2rem 1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading game information...</div>
          ) : nextGame && opponent ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1.3rem', marginBottom: 6 }}>
                vs. {opponent?.name || opponent?.Name || 'TBD'}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: 2 }}>
                {nextGame.gameDate ? new Date(nextGame.gameDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Date TBD'} - {nextGame.gameTime || 'Time TBD'}
              </p>
              {nextGame.location && (
                <p style={{ color: 'var(--muted)', fontSize: '1rem', marginTop: 4 }}>{nextGame.location}</p>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
              <p>No upcoming games scheduled</p>
              <p style={{ fontSize: '1rem', marginTop: 4 }}>Check back later for matchup details</p>
            </div>
          )}
        </div>
      </div>
      <div style={{ background: 'var(--card)', borderRadius: 16, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a', padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--text)' }}>Opponent Analysis</h2>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 18 }}>Upcoming Opponent Depth Chart</h3>
          {rosterLoading ? (
            <div style={{ color: 'var(--muted)' }}>Loading depth chart...</div>
          ) : opponentRoster.length === 0 ? (
            <div style={{ color: 'var(--muted)' }}>No roster data available for opponent.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Offense */}
              <section style={{ background: '#181f2a', borderRadius: 12, boxShadow: '0 2px 12px #00e0ff22', padding: '1.5rem 1.2rem', marginBottom: 0 }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#79dcb9', marginBottom: 18, letterSpacing: '1px', borderBottom: '2px solid #283e51', paddingBottom: 8 }}>Offense</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
                  {Object.entries(categorized.offense).map(([pos, players]) => (
                    <div key={pos} style={{ background: 'linear-gradient(180deg, #1e293b 80%, #00e0ff11 100%)', borderRadius: 10, padding: '1rem', boxShadow: '0 1px 8px #00e0ff22' }}>
                      <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8, fontSize: '1.1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #222', paddingBottom: 4 }}>{pos}</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {players.map((player) => (
                          <li key={player.playerId} style={{ color: 'var(--text)', fontSize: '1rem', marginBottom: 6, textAlign: 'center' }}>
                            <span style={{ fontWeight: 600 }}>{player.name || `${player.firstName} ${player.lastName}`}</span><br />
                            <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>#{player.jerseyNumber} {player.height ? `• ${player.height}` : ''} {player.weight ? `• ${player.weight} lbs` : ''}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
              {/* Defense */}
              <section style={{ background: '#181f2a', borderRadius: 12, boxShadow: '0 2px 12px #00e0ff22', padding: '1.5rem 1.2rem', marginBottom: 0 }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4faaff', marginBottom: 18, letterSpacing: '1px', borderBottom: '2px solid #283e51', paddingBottom: 8 }}>Defense</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
                  {Object.entries(categorized.defense).map(([pos, players]) => (
                    <div key={pos} style={{ background: 'linear-gradient(180deg, #1e293b 80%, #00e0ff11 100%)', borderRadius: 10, padding: '1rem', boxShadow: '0 1px 8px #00e0ff22' }}>
                      <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8, fontSize: '1.1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #222', paddingBottom: 4 }}>{pos}</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {players.map((player) => (
                          <li key={player.playerId} style={{ color: 'var(--text)', fontSize: '1rem', marginBottom: 6, textAlign: 'center' }}>
                            <span style={{ fontWeight: 600 }}>{player.name || `${player.firstName} ${player.lastName}`}</span><br />
                            <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>#{player.jerseyNumber} {player.height ? `• ${player.height}` : ''} {player.weight ? `• ${player.weight} lbs` : ''}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
              {/* Special Teams */}
              <section style={{ background: '#181f2a', borderRadius: 12, boxShadow: '0 2px 12px #00e0ff22', padding: '1.5rem 1.2rem', marginBottom: 0 }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffe43f', marginBottom: 18, letterSpacing: '1px', borderBottom: '2px solid #283e51', paddingBottom: 8 }}>Special Teams</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
                  {Object.entries(categorized.specialTeams).map(([pos, players]) => (
                    <div key={pos} style={{ background: 'linear-gradient(180deg, #1e293b 80%, #00e0ff11 100%)', borderRadius: 10, padding: '1rem', boxShadow: '0 1px 8px #00e0ff22' }}>
                      <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8, fontSize: '1.1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #222', paddingBottom: 4 }}>{pos}</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {players.map((player) => (
                          <li key={player.playerId} style={{ color: 'var(--text)', fontSize: '1rem', marginBottom: 6, textAlign: 'center' }}>
                            <span style={{ fontWeight: 600 }}>{player.name || `${player.firstName} ${player.lastName}`}</span><br />
                            <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>#{player.jerseyNumber} {player.height ? `• ${player.height}` : ''} {player.weight ? `• ${player.weight} lbs` : ''}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default withAuth(Matchup, 'Player')