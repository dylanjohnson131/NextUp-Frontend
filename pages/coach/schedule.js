import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentCoach, fetchUpcomingGames } from '../../lib/api'
import { withAuth } from '../../hocs/withAuth'

function Schedule() {
  const router = useRouter()
  const [coach, setCoach] = useState(null)
  const [upcomingGames, setUpcomingGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const coachInfo = await getCurrentCoach()
        setCoach(coachInfo)
        
        // Fetch upcoming games if coach has a team
        if (coachInfo?.Team?.TeamId) {
          try {
            const gamesData = await fetchUpcomingGames(coachInfo.Team.TeamId)
            setUpcomingGames(gamesData || [])
          } catch (error) {
            console.error('Failed to load upcoming games:', error)
            setUpcomingGames([])
          }
        }
      } catch (error) {
        console.error('Failed to load coach data:', error)
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
        <h1 className="text-3xl font-bold text-white mb-6">Schedule</h1>
        
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Matchups</h2>
          
          <div className="space-y-4">
            {upcomingGames.length > 0 ? (
              upcomingGames.map((game) => (
                <div key={game.GameId} className="bg-slate-700 rounded p-4">
                  <div className="flex justify-between items-center">
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
                      <p className="text-slate-500 text-xs">
                        {game.IsHome ? 'Home Game' : 'Away Game'}
                      </p>
                      {game.Location && (
                        <p className="text-slate-500 text-xs">
                          Location: {game.Location}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => router.push(`/coach/opponent/${game.Opponent.TeamId}`)}
                      className="bg-cyan-400 text-slate-900 px-3 py-1 rounded text-sm hover:bg-cyan-300 transition-colors"
                    >
                      View Team Stats
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-700 rounded p-4 text-center">
                <p className="text-slate-400">No upcoming games scheduled</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-slate-700 rounded">
            <p className="text-slate-400 text-center">
              Read-only schedule view with opponent analysis features coming soon...
            </p>
          </div>
        </div>
      </main>
  )
}

export default withAuth(Schedule, 'Coach')