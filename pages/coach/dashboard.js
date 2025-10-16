import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser, getCurrentCoach, fetchTeams, fetchUpcomingGames } from '../../lib/api'
import { withAuth } from '../../hocs/withAuth'

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
        
        // Fetch upcoming games if coach has a team
        if (coachInfo?.team?.teamId) {
          try {
            const gamesData = await fetchUpcomingGames(coachInfo.team.teamId)
            setUpcomingGames(gamesData || [])
          } catch (error) {
            console.error('Failed to load upcoming games:', error)
            setUpcomingGames([])
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Coach Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's an overview of your teams and recent activity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Teams Section */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">My Teams</h2>
            <div className="space-y-4">
              {coach?.team ? (
                <div 
                  onClick={() => router.push('/coach/my-team')}
                  className="bg-slate-700 rounded p-4 cursor-pointer hover:bg-slate-600 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">
                        {coach.team.name}
                        <span className="text-slate-400 font-normal"> (2025-2026)</span>
                      </h3>
                      <p className="text-slate-400 text-sm">{coach.team.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-cyan-400 text-sm">
                        Click to manage →
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700 rounded p-4 text-center">
                  <p className="text-slate-400">No team assigned yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/coach/depth-chart')}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded font-medium hover:bg-purple-700 transition-colors"
              >
                Manage Depth Chart
              </button>
              <button 
                onClick={() => router.push('/coach/game-stats')}
                className="w-full bg-cyan-400 text-slate-900 px-4 py-3 rounded font-medium hover:bg-cyan-300 transition-colors"
              >
                Record Game Stats
              </button>
              <button 
                onClick={() => router.push('/coach/my-team')}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded font-medium hover:bg-slate-600 transition-colors"
              >
                View Team Performance
              </button>
              <button 
                onClick={() => router.push('/coach/opponents')}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded font-medium hover:bg-slate-600 transition-colors"
              >
                Browse Opponents
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Games */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Games</h2>
          <div className="space-y-3">
            {upcomingGames.length > 0 ? (
              upcomingGames.slice(0, 2).map((game) => (
                <div key={game.GameId} className="bg-slate-700 rounded p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">
                      {game.IsHome ? 'vs.' : '@'} {game.Opponent.Name}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {new Date(game.GameDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} - {new Date(game.GameDate).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    {game.Location && (
                      <p className="text-slate-400 text-xs">{game.Location}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => router.push(`/coach/opponent/${game.Opponent.TeamId}`)}
                    className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-500 transition-colors"
                  >
                    Scout Team
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-slate-700 rounded p-4 text-center">
                <p className="text-slate-400">No upcoming games scheduled</p>
              </div>
            )}
          </div>
        </div>
      </main>
  )
}

export default withAuth(CoachDashboard, 'Coach')