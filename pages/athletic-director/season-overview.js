import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchAthleticDirectorTeams, fetchAthleticDirectorGames } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function SeasonOverview() {
  const { user } = useAuth()
  const [seasonData, setSeasonData] = useState({
    teams: [],
    games: [],
    stats: {
      totalTeams: 0,
      totalGames: 0,
      completedGames: 0,
      upcomingGames: 0
    }
  })
  const [selectedSeason, setSelectedSeason] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSeasonData()
  }, [selectedSeason])

  const fetchSeasonData = async () => {
    try {
      setLoading(true)
      
      // Fetch teams and games
      const teams = await fetchAthleticDirectorTeams()
      const allGames = await fetchAthleticDirectorGames()
      
      // Filter games by season
      const seasonGames = allGames.filter(game => game.season === selectedSeason)
      
      // Calculate stats
      const completedGames = seasonGames.filter(game => game.status === 'Completed').length
      const upcomingGames = seasonGames.filter(game => 
        game.status === 'Scheduled' || game.status === 'InProgress'
      ).length

      setSeasonData({
        teams,
        games: seasonGames,
        stats: {
          totalTeams: teams.length,
          totalGames: seasonGames.length,
          completedGames,
          upcomingGames
        }
      })
      setError('')
    } catch (err) {
      setError('Failed to load season data')
    } finally {
      setLoading(false)
    }
  }

  const formatGameDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500/20 text-blue-400'
      case 'InProgress': return 'bg-yellow-500/20 text-yellow-400'
      case 'Completed': return 'bg-green-500/20 text-green-400'
      case 'Cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getTeamRecord = (teamId) => {
    const teamGames = seasonData.games.filter(game => 
      (game.homeTeamId === teamId || game.awayTeamId === teamId) && 
      game.status === 'Completed'
    )
    
    let wins = 0
    let losses = 0
    
    teamGames.forEach(game => {
      // For now, we'll show 0-0 since we don't have score tracking yet
      // This can be enhanced when score functionality is added
    })
    
    return `${wins}-${losses}`
  }

  // Generate season options (current year ± 2 years)
  const currentYear = new Date().getFullYear()
  const seasonOptions = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Season Overview</h1>
            <p className="text-slate-400 text-lg">Comprehensive view of the football season</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-slate-300 font-medium">Season:</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {seasonOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Season Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div key="teams-stat" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Teams</p>
                <p className="text-3xl font-bold text-white mt-2">{seasonData.stats.totalTeams}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div key="total-games-stat" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Games</p>
                <p className="text-3xl font-bold text-white mt-2">{seasonData.stats.totalGames}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>

          <div key="completed-games-stat" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-white mt-2">{seasonData.stats.completedGames}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div key="upcoming-games-stat" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-white mt-2">{seasonData.stats.upcomingGames}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Teams Overview */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-white">Teams ({seasonData.teams.length})</h2>
            </div>
            
            {seasonData.teams.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🏈</div>
                <p className="text-slate-400 mb-4">No teams created yet</p>
                <a
                  href="/athletic-director/teams"
                  className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Teams
                </a>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-slate-700/50">
                  {seasonData.teams.map((team) => (
                    <div key={team.id} className="p-4 hover:bg-slate-700/30 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-white">{team.name}</h3>
                          <p className="text-sm text-slate-400">{team.school}</p>
                          {team.city && team.state && (
                            <p className="text-xs text-slate-500">{team.city}, {team.state}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-300">
                            Record: {getTeamRecord(team.id)}
                          </div>
                          {team.division && (
                            <div className="text-xs text-slate-500">{team.division}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Games */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-white">Upcoming Games</h2>
            </div>
            
            {seasonData.games.filter(game => game.status === 'Scheduled' || game.status === 'InProgress').length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-slate-400 mb-4">No upcoming games scheduled</p>
                <a
                  href="/athletic-director/games"
                  className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Schedule Games
                </a>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-slate-700/50">
                  {seasonData.games
                    .filter(game => game.status === 'Scheduled' || game.status === 'InProgress')
                    .sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate))
                    .slice(0, 10)
                    .map((game) => (
                    <div key={game.id} className="p-4 hover:bg-slate-700/30 transition-colors duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white text-sm">
                              {game.awayTeamName || 'Away Team'} @ {game.homeTeamName || 'Home Team'}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                              {game.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{formatGameDate(game.gameDate)}</p>
                          {game.location && (
                            <p className="text-xs text-slate-500">{game.location}</p>
                          )}
                        </div>
                        {game.week && (
                          <div className="text-xs text-slate-400">
                            Week {game.week}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Season Progress */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Season Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Games Completed</span>
                <span className="text-white">
                  {seasonData.stats.completedGames} / {seasonData.stats.totalGames}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: seasonData.stats.totalGames > 0 
                      ? `${(seasonData.stats.completedGames / seasonData.stats.totalGames) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
            
            {seasonData.stats.totalGames === 0 && (
              <div className="text-center py-4">
                <p className="text-slate-400 mb-4">No games scheduled for {selectedSeason} season</p>
                <a
                  href="/athletic-director/games?action=create"
                  className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Schedule First Game
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Only Athletic Directors can access this page
export default withAuth(SeasonOverview, ['AthleticDirector'])