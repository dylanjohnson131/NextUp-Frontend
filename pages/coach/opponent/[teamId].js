import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import RoleNavBar from '../../../components/RoleNavBar'
import { fetchTeamById } from '../../../lib/api'
import withAuth from '../../../hocs/withAuth'

function OpponentOverview() {
  const router = useRouter()
  const { teamId } = router.query
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (teamId) {
      fetchTeamById(teamId)
        .then(data => {
          // Map API response to expected frontend structure
          setTeamData({
            team: {
              name: data.Name || data.name,
              location: data.Location || data.location,
              wins: data.Wins || data.wins || 0,
              losses: data.Losses || data.losses || 0,
              ties: data.Ties || data.ties || 0
            },
            Roster: (data.Players || data.players || []).map(p => ({
              playerId: p.PlayerId || p.playerId,
              name: p.Name || p.name,
              position: p.Position || p.position,
              age: p.Age || p.age,
              jerseyNumber: p.JerseyNumber || p.jerseyNumber
            }))
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching team data:', err);
          setError('Failed to load team data');
          setLoading(false);
        });
    }
  }, [teamId]);

  if (loading) {
    return (
      <div>
        <RoleNavBar />
        <main>
          <div>
            <div></div>
            <p>Loading team overview...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <RoleNavBar />
        <main>
          <div>
            <p>{error}</p>
            <button onClick={() => router.back()}>
              Go Back
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <main>
        {/* Header */}
        <div>
          <div>
            <button onClick={() => router.back()}>
              ← Back to Schedule
            </button>
            <h1>{teamData?.team?.name || 'Team Overview'}</h1>
            <p>{teamData?.team?.location}</p>
          </div>
          <div>
            <p>Overall Record</p>
            <p>
              {teamData?.team?.wins || 0}-{teamData?.team?.losses || 0}-{teamData?.team?.ties || 0}
            </p>
          </div>
        </div>

        <div>
          {/* Team Roster */}
          <div>
            <div>
              <h2>Team Roster</h2>
              {teamData?.Roster && teamData.Roster.length > 0 ? (
                <div>
                  {teamData.Roster.map(player => (
                    <div key={player.playerId}>
                      <div>
                        <p>{player.name}</p>
                        <p>{player.position}</p>
                      </div>
                      <div>
                        <p>Age: {player.age}</p>
                        <p>#{player.jerseyNumber || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No roster information available</p>
              )}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div>
            <div>
              <h2>Team Analysis</h2>
              <div>
                <div>
                  <h3>
                    <span></span>
                    Key Strengths
                  </h3>
                  {teamData?.analysis?.strengths && teamData.analysis.strengths.length > 0 ? (
                    <ul>
                      {teamData.analysis.strengths.map((strength, index) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No strength analysis available</p>
                  )}
                </div>
                <div>
                  <h3>
                    <span></span>
                    Weaknesses
                  </h3>
                  {teamData?.analysis?.weaknesses && teamData.analysis.weaknesses.length > 0 ? (
                    <ul>
                      {teamData.analysis.weaknesses.map((weakness, index) => (
                        <li key={index}>• {weakness}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No weakness analysis available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div>
              <h2>Top Performers</h2>
              {teamData?.topPerformers && teamData.topPerformers.length > 0 ? (
                <div>
                  {teamData.topPerformers.map((player, index) => (
                    <div key={player.playerId}>
                      <div>
                        <div>
                          <div>{index + 1}</div>
                        </div>
                        <div>
                          <p>{player.name}</p>
                          <p>{player.position}</p>
                        </div>
                      </div>
                      <div>
                        <p>{player.stat}</p>
                        <p>{player.statType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No performance data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Games */}
        <div>
          <h2>Recent Performance</h2>
          {teamData?.recentGames && teamData.recentGames.length > 0 ? (
            <div>
              {teamData.recentGames.map((game, index) => (
                <div key={index}>
                  <div>
                    <p>{game.date}</p>
                    <span>{game.result}</span>
                  </div>
                  <p>vs {game.opponent}</p>
                  <p>Score: {game.score}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent game data available</p>
          )}
        </div>
      </main>
  )
}

export default withAuth(OpponentOverview, 'Coach')