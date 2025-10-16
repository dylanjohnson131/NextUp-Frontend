import { useEffect, useState } from 'react'
import { getCurrentCoach, fetchTeamById } from '../../lib/api'
import { withAuth } from '../../hocs/withAuth'
import Link from 'next/link'

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

  if (!coach?.team) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Team</h1>
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <p className="text-slate-400">You are not currently assigned to a team.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Team</h1>
      
      {/* Team Overview */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">{coach.team.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Location</h3>
            <p className="text-slate-300">{coach.team.location || 'Not specified'}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Season</h3>
            <p className="text-slate-300">{coach.team.season || 'Current'}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Total Players</h3>
            <p className="text-slate-300">{teamData?.players?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Link href="/coach/depth-chart" className="bg-cyan-600 hover:bg-cyan-700 rounded-lg p-6 text-center transition-colors">
          <h3 className="text-xl font-semibold text-white mb-2">Depth Chart</h3>
          <p className="text-cyan-100">View and manage player positions</p>
        </Link>
        
        <Link href="/coach/schedule" className="bg-green-600 hover:bg-green-700 rounded-lg p-6 text-center transition-colors">
          <h3 className="text-xl font-semibold text-white mb-2">Schedule</h3>
          <p className="text-green-100">View upcoming games and results</p>
        </Link>
        
        <Link href="/coach/game-stats" className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 text-center transition-colors">
          <h3 className="text-xl font-semibold text-white mb-2">Game Stats</h3>
          <p className="text-purple-100">Track player and team statistics</p>
        </Link>
      </div>

      {/* Recent Players */}
      {teamData?.players && teamData.players.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamData.players.slice(0, 6).map(player => (
              <div key={player.playerId} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white">#{player.jerseyNumber} {player.name}</h3>
                  <span className="text-xs bg-slate-600 px-2 py-1 rounded text-slate-300">
                    {player.position || 'No Position'}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  Age: {player.age}
                  {player.height && ` • ${player.height}`}
                  {player.weight && ` • ${player.weight}lbs`}
                </div>
              </div>
            ))}
          </div>
          {teamData.players.length > 6 && (
            <div className="mt-4 text-center">
              <Link href="/coach/depth-chart" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                View all {teamData.players.length} players →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {(!teamData?.players || teamData.players.length === 0) && (
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">No Players Yet</h2>
          <p className="text-slate-400 mb-4">Your team roster is empty. Players will appear here once they're added to your team.</p>
          <Link href="/coach/depth-chart" className="inline-block bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-white transition-colors">
            Manage Roster
          </Link>
        </div>
      )}
    </main>
  )
}

export default withAuth(MyTeam, 'Coach')