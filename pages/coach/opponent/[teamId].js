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
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading team overview...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <RoleNavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => router.back()}
              className="mt-4 bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button 
              onClick={() => router.back()}
              className="text-cyan-400 hover:text-cyan-300 mb-2 flex items-center gap-2"
            >
              ← Back to Schedule
            </button>
            <h1 className="text-3xl font-bold text-white">{teamData?.team?.name || 'Team Overview'}</h1>
            <p className="text-slate-400">{teamData?.team?.location}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Overall Record</p>
            <p className="text-2xl font-bold text-white">
              {teamData?.team?.wins || 0}-{teamData?.team?.losses || 0}-{teamData?.team?.ties || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Roster */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Team Roster</h2>
              {teamData?.Roster && teamData.Roster.length > 0 ? (
                <div className="space-y-3">
                  {teamData.Roster.map(player => (
                    <div key={player.playerId} className="flex justify-between items-center p-3 bg-slate-700 rounded">
                      <div>
                        <p className="text-white font-medium">{player.name}</p>
                        <p className="text-slate-400 text-sm">{player.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 text-sm">Age: {player.age}</p>
                        <p className="text-slate-400 text-xs">#{player.jerseyNumber || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No roster information available</p>
              )}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Team Analysis</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Key Strengths
                  </h3>
                  {teamData?.analysis?.strengths && teamData.analysis.strengths.length > 0 ? (
                    <ul className="space-y-1">
                      {teamData.analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-slate-300 text-sm">• {strength}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 text-sm">No strength analysis available</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Weaknesses
                  </h3>
                  {teamData?.analysis?.weaknesses && teamData.analysis.weaknesses.length > 0 ? (
                    <ul className="space-y-1">
                      {teamData.analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-slate-300 text-sm">• {weakness}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 text-sm">No weakness analysis available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Top Performers</h2>
              {teamData?.topPerformers && teamData.topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {teamData.topPerformers.map((player, index) => (
                    <div key={player.playerId} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-cyan-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-slate-400 text-sm">{player.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-medium">{player.stat}</p>
                        <p className="text-slate-400 text-xs">{player.statType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No performance data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="mt-6 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Performance</h2>
          {teamData?.recentGames && teamData.recentGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamData.recentGames.map((game, index) => (
                <div key={index} className="bg-slate-700 rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-300 text-sm">{game.date}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      game.result === 'W' ? 'bg-green-900 text-green-300' :
                      game.result === 'L' ? 'bg-red-900 text-red-300' :
                      'bg-gray-900 text-gray-300'
                    }`}>
                      {game.result}
                    </span>
                  </div>
                  <p className="text-white font-medium">vs {game.opponent}</p>
                  <p className="text-slate-400 text-sm">Score: {game.score}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No recent game data available</p>
          )}
        </div>
      </main>
  )
}

export default withAuth(OpponentOverview, 'Coach')