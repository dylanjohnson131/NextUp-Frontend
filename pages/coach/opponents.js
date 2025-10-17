import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchTeams, getCurrentCoach } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function BrowseOpponents() {
  const router = useRouter()
  const [teams, setTeams] = useState([])
  const [coach, setCoach] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, coachInfo] = await Promise.all([
          fetchTeams(),
          getCurrentCoach()
        ])
        setTeams(teamsData)
        setCoach(coachInfo)
      } catch (error) {
        } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Filter out the coach's own team from the opponents list
  const opponentTeams = teams.filter(team => 
    coach?.Team ? team.TeamId !== coach.Team.TeamId : true
  )

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Opponents</h1>
        <p className="text-slate-400">Scout other teams and analyze their performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opponentTeams.map(team => (
          <div key={team.TeamId} className="bg-slate-800 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">{team.Name}</h3>
              <p className="text-slate-400 text-sm mb-1">{team.Location}</p>
              <p className="text-slate-400 text-sm">{team.PlayerCount} Players</p>
            </div>
            
            {team.Coach && (
              <div className="mb-4 p-3 bg-slate-700 rounded">
                <h4 className="text-white font-medium mb-1">Coach</h4>
                <p className="text-slate-400 text-sm">{team.Coach.Name}</p>
                {team.Coach.ExperienceYears > 0 && (
                  <p className="text-slate-400 text-xs">{team.Coach.ExperienceYears} years experience</p>
                )}
                {team.Coach.Specialty && (
                  <p className="text-slate-400 text-xs">Specialty: {team.Coach.Specialty}</p>
                )}
              </div>
            )}

            <div className="flex space-x-2">
              <button 
                onClick={() => router.push(`/coach/opponent/${team.TeamId}`)}
                className="flex-1 bg-cyan-400 text-slate-900 px-4 py-2 rounded text-sm font-medium hover:bg-cyan-300 transition-colors"
              >
                Scout Team
              </button>
              <button 
                className="flex-1 bg-slate-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-600 transition-colors"
                disabled
              >
                Schedule Game
              </button>
            </div>
          </div>
        ))}
      </div>

      {opponentTeams.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-slate-400 mb-4">No opponent teams available for scouting.</p>
            <button 
              onClick={() => router.push('/coach/dashboard')}
              className="bg-cyan-400 text-slate-900 px-6 py-2 rounded font-medium hover:bg-cyan-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default withAuth(BrowseOpponents, 'Coach')