
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import withAuth from '../../hocs/withAuth'

import PlayerPerformanceChart from '../../components/PlayerPerformanceChart'
import { getCurrentUser, getCurrentPlayer, fetchUpcomingGames } from '../../lib/api'

function PlayerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [nextGame, setNextGame] = useState(null)
  const [opponent, setOpponent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Player dashboard useEffect running');
    // Debug: log userInfo after fetching, and log errors
    const logUserInfo = (userInfo) => {
      if (userInfo) {
        console.log('Fetched userInfo:', userInfo);
      } else {
        console.warn('No userInfo returned from getCurrentUser');
      }
    }
    const loadData = async () => {
      try {
        let userInfo = null;
        let currentPlayer = null;
        try {
          userInfo = await getCurrentUser();
        } catch (err) {
          console.error('Error fetching userInfo:', err);
        }
        try {
          currentPlayer = await getCurrentPlayer();
        } catch (err) {
          console.error('Error fetching currentPlayer:', err);
        }

        logUserInfo(userInfo);
        setUser(userInfo)
        setPlayerData(currentPlayer)
        console.log('Current player:', currentPlayer);
        console.log('Current player team:', currentPlayer?.team);
        console.log('Current player teamId:', currentPlayer?.team?.teamId);

        // Fetch next game if player has a team
        if (currentPlayer?.team?.teamId) {
          try {
            const upcomingGames = await fetchUpcomingGames(currentPlayer.team.teamId)
            console.log('Upcoming games:', upcomingGames);
            if (upcomingGames && upcomingGames.length > 0) {
              const game = upcomingGames[0];
              console.log('Next game:', game);
              setNextGame(game);
              // Determine opponent based on backend's HomeTeamId/AwayTeamId and HomeTeam/AwayTeam
              const myTeamId = currentPlayer.team.teamId;
              let opp = null;
              // Backend returns HomeTeam and AwayTeam with homeTeamId/awayTeamId (lowercase in JSON)
              if (game.homeTeam?.homeTeamId === myTeamId) {
                opp = game.awayTeam;
              } else if (game.awayTeam?.awayTeamId === myTeamId) {
                opp = game.homeTeam;
              }
              console.log('Opponent:', opp);
              setOpponent(opp);
            }
          } catch (error) {
            console.error('Error fetching upcoming games:', error);
          }
        }
      } catch (error) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Player Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Player'} Track your progress and team performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Quick Stats */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>

            {playerData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Position:</span>
                  <span className="text-white text-right">{playerData.position && playerData.position.trim() !== '' ? playerData.position : 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Jersey #:</span>
                  <span className="text-white text-right">{playerData.jerseyNumber ? playerData.jerseyNumber : 'Not assigned'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Age:</span>
                  <span className="text-white text-right">{playerData.age ? playerData.age : 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Team:</span>
                  <span className="text-white text-right">{playerData.team?.name || 'No team'}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Player data not found</p>
            )}
          </div>
        </div>

        {/* Recent Performance */}
        <div className="mt-8">
          <PlayerPerformanceChart
            data={[
              { label: 'Game 1', grade: 75 },
              { label: 'Game 2', grade: 80 },
              { label: 'Game 3', grade: 85 },
              { label: 'Game 4', grade: 90 },
              { label: 'Game 5', grade: 88 },
            ]}
          />
        </div>

        {/* Next Game */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Next Game</h2>
          <div className="bg-slate-700 rounded p-4">
            {nextGame ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    vs. {opponent?.name || opponent?.Name || 'TBD'}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {nextGame.gameDate ? new Date(nextGame.gameDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'Date TBD'} - {nextGame.gameTime || 'Time TBD'}
                  </p>
                  {nextGame.location && (
                    <p className="text-slate-500 text-sm">{nextGame.location}</p>
                  )}
                </div>
                <button
                  onClick={() => router.push('/player/matchup')}
                  className="bg-cyan-400 text-slate-900 px-3 py-1 rounded text-sm hover:bg-cyan-300"
                >
                  Scout Opponent
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-slate-400">No upcoming games scheduled</p>
                <p className="text-slate-500 text-sm mt-1">Check back later for game updates</p>
              </div>
            )}
          </div>
        </div>
      </main>
  )
}

export default withAuth(PlayerDashboard, 'Player')