import { useEffect, useState } from 'react'
import { getCurrentCoach, fetchTeamById } from '../../lib/api'
import { withAuth } from '../../hocs/withAuth'

function MyTeam() {
  const [coach, setCoach] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const coachInfo = await getCurrentCoach()
        setCoach(coachInfo)
        
        // Fetch detailed team data if coach has a team
        if (coachInfo?.team?.teamId) {
          const teamDetails = await fetchTeamById(coachInfo.team.teamId)
          setTeamData(teamDetails)
        }
      } catch (error) {
        console.error('Failed to load team data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTeamData()
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
        <h1 className="text-3xl font-bold text-white mb-6">My Team</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Roster */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Team Roster</h2>
            {teamData?.players && teamData.players.length > 0 ? (
              <div className="space-y-3">
                {teamData.players.map(player => (
                  <div key={player.playerId} className="bg-slate-700 rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">
                          #{player.jerseyNumber} {player.name}
                        </h3>
                        <p className="text-slate-400 text-sm">{player.position}</p>
                        <div className="flex space-x-4 text-xs text-slate-500 mt-1">
                          <span>Age: {player.age}</span>
                          {player.height && <span>Height: {player.height}</span>}
                          {player.weight && <span>Weight: {player.weight} lbs</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="bg-slate-600 text-white px-2 py-1 rounded text-xs hover:bg-slate-500 transition-colors">
                          View Stats
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-slate-700 rounded text-center">
                  <p className="text-slate-400 text-sm">
                    Total Players: {teamData.stats?.totalPlayers || teamData.players.length}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No players on the roster yet.</p>
                <button className="mt-3 bg-cyan-400 text-slate-900 px-4 py-2 rounded font-medium hover:bg-cyan-300 transition-colors">
                  Add Player
                </button>
              </div>
            )}
          </div>
          
          {/* Team Strengths & Weaknesses */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Team Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-green-400 font-medium mb-2">Strengths</h3>
                <p className="text-slate-400 text-sm">Team strengths analysis coming soon...</p>
              </div>
              <div>
                <h3 className="text-red-400 font-medium mb-2">Areas to Improve</h3>
                <p className="text-slate-400 text-sm">Weakness analysis coming soon...</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Performers */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Performers</h2>
          <p className="text-slate-400">Top player statistics coming soon...</p>
        </div>
      </main>
  )
}

export default withAuth(MyTeam, 'Coach')