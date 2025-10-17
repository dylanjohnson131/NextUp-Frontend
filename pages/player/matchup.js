import { useState, useEffect } from 'react'
import { getCurrentPlayer, fetchUpcomingGames } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function Matchup() {
  const [nextGame, setNextGame] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMatchupData = async () => {
      try {
        const currentPlayer = await getCurrentPlayer()
        
        // Fetch next game if player has a team
        if (currentPlayer?.team?.teamId) {
          try {
            const upcomingGames = await fetchUpcomingGames(currentPlayer.team.teamId)
            if (upcomingGames && upcomingGames.length > 0) {
              setNextGame(upcomingGames[0]) // Get the next upcoming game
            }
          } catch (error) {
            }
        }
      } catch (error) {
        } finally {
        setLoading(false)
      }
    }
    
    loadMatchupData()
  }, [])
  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Next Matchup</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Game</h2>
          <div className="bg-slate-700 rounded p-4">
            {loading ? (
              <div className="text-center">
                <p className="text-slate-400">Loading game information...</p>
              </div>
            ) : nextGame ? (
              <div className="text-center">
                <p className="text-white font-medium text-lg">
                  vs. {nextGame.awayTeam?.name || 'TBD'}
                </p>
                <p className="text-slate-400">
                  {nextGame.gameDate ? new Date(nextGame.gameDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short', 
                    day: 'numeric'
                  }) : 'Date TBD'} - {nextGame.gameTime || 'Time TBD'}
                </p>
                {nextGame.location && (
                  <p className="text-slate-500 text-sm mt-1">{nextGame.location}</p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-slate-400">No upcoming games scheduled</p>
                <p className="text-slate-500 text-sm mt-1">Check back later for matchup details</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Opponent Strengths */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Opponent Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-green-400 font-medium mb-2">Their Strengths</h3>
                <p className="text-slate-400 text-sm">Opponent strengths scouting coming soon...</p>
              </div>
              <div>
                <h3 className="text-red-400 font-medium mb-2">Their Weaknesses</h3>
                <p className="text-slate-400 text-sm">Opponent weaknesses analysis coming soon...</p>
              </div>
            </div>
          </div>
          
          {/* Opponent Top Performers */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Their Top Performers</h2>
            <p className="text-slate-400">Opponent key players and statistics coming soon...</p>
          </div>
        </div>
        
        {/* Game Overview */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Game Overview</h2>
          <p className="text-slate-400">
            Comprehensive matchup analysis and scouting report features coming soon...
          </p>
        </div>
      </main>
  )
}

export default withAuth(Matchup, 'Player')