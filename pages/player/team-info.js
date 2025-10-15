import { useState, useEffect } from 'react'
import { withAuth } from '../../hocs/withAuth'
import { fetchMyTeam } from '../../lib/api'

function TeamInfo() {
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTeamInfo()
  }, [])

  const loadTeamInfo = async () => {
    try {
      setLoading(true)
      const teamData = await fetchMyTeam()
      setTeam(teamData)
    } catch (err) {
      console.error('Error loading team info:', err)
      setError('Failed to load team information')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-white text-center">Loading team information...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Team Info</h1>
      
      {team && (
        <>
          {/* Team Header */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{team.name}</h2>
            <p className="text-slate-400 mb-4">{team.location}</p>
            
            {team.coach && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Head Coach</h3>
                <div className="bg-slate-700 rounded p-4">
                  <p className="text-white font-medium">{team.coach.name}</p>
                  {team.coach.specialty && (
                    <p className="text-slate-400 text-sm">Specialty: {team.coach.specialty}</p>
                  )}
                  {team.coach.experienceYears > 0 && (
                    <p className="text-slate-400 text-sm">Experience: {team.coach.experienceYears} years</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Team Roster */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Team Roster</h2>
              
              {team.players && team.players.length > 0 ? (
                <div className="space-y-3">
                  {team.players.map((player) => (
                    <div key={player.playerId} className="bg-slate-700 rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{player.name}</h3>
                          <p className="text-slate-400 text-sm">{player.position}</p>
                          {player.age && (
                            <p className="text-slate-500 text-xs">Age: {player.age}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {player.jerseyNumber && (
                            <div className="bg-cyan-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              #{player.jerseyNumber}
                            </div>
                          )}
                          {player.height && player.weight && (
                            <p className="text-slate-500 text-xs mt-1">
                              {player.height}, {player.weight} lbs
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No players found in roster.</p>
              )}
            </div>
            
            {/* Team Stats */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Team Stats</h2>
              
              {team.stats && (
                <div className="space-y-4">
                  <div className="bg-slate-700 rounded p-4">
                    <h3 className="text-cyan-400 font-medium mb-2">Roster Size</h3>
                    <p className="text-white text-2xl font-bold">{team.stats.totalPlayers}</p>
                    <p className="text-slate-400 text-sm">Total Players</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded p-4">
                      <h3 className="text-green-400 font-medium mb-2">Home Games</h3>
                      <p className="text-white text-xl font-bold">{team.stats.homeGames}</p>
                    </div>
                    
                    <div className="bg-slate-700 rounded p-4">
                      <h3 className="text-blue-400 font-medium mb-2">Away Games</h3>
                      <p className="text-white text-xl font-bold">{team.stats.awayGames}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Team Analysis Placeholder */}
          <div className="mt-8 bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Team Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-green-400 font-medium mb-2">Team Strengths</h3>
                <p className="text-slate-400 text-sm">Detailed team strengths analysis coming soon...</p>
              </div>
              <div>
                <h3 className="text-red-400 font-medium mb-2">Areas to Improve</h3>
                <p className="text-slate-400 text-sm">Team improvement opportunities analysis coming soon...</p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

export default withAuth(TeamInfo, 'Player')