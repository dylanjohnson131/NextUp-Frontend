import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'
import { fetchAthleticDirectorGames, fetchAthleticDirectorTeams, createAthleticDirectorGame, updateAthleticDirectorGame, deleteAthleticDirectorGame } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function GamesManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    gameDate: '',
    gameTime: '',
    location: '',
    week: '',
    season: new Date().getFullYear(),
    status: 'Scheduled'
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchGames()
    fetchTeams()
    // Check if we should show create form from URL params
    if (router.query.action === 'create') {
      setShowCreateForm(true)
    }
  }, [router.query])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const data = await fetchAthleticDirectorGames()
      setGames(data)
      setError('')
    } catch (err) {
      setError('Failed to load games')
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const data = await fetchAthleticDirectorTeams()
      setTeams(data)
    } catch (err) {
      setError('Failed to load teams')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.homeTeamId || !formData.awayTeamId) {
      setError('Please select both home and away teams')
      return
    }
    
    if (formData.homeTeamId === formData.awayTeamId) {
      setError('Home team and away team cannot be the same')
      return
    }

    if (!formData.gameDate || !formData.gameTime) {
      setError('Please select game date and time')
      return
    }

    try {
      // Combine date and time into a single DateTime object in local time, then convert to UTC ISO string
      const localDateTime = new Date(`${formData.gameDate}T${formData.gameTime}`);
      const gameDateTime = localDateTime.toISOString();

      // Convert to integers and validate
      const homeTeamId = parseInt(formData.homeTeamId);
      const awayTeamId = parseInt(formData.awayTeamId);
      const season = parseInt(formData.season);

      if (isNaN(homeTeamId) || isNaN(awayTeamId) || isNaN(season)) {
        setError(`Invalid values - homeTeamId: ${homeTeamId}, awayTeamId: ${awayTeamId}, season: ${season}`);
        return;
      }

      const submitData = {
        homeTeamId,
        awayTeamId,
        gameDate: gameDateTime,
        location: formData.location,
        season: season.toString(),
        Week: formData.week === '' ? null : parseInt(formData.week),
        status: formData.status,
        HomeScore: formData.homeScore ? parseInt(formData.homeScore) : null,
        AwayScore: formData.awayScore ? parseInt(formData.awayScore) : null
      };
      console.log('Submitting game update:', submitData);

      if (editingGame) {
        await updateAthleticDirectorGame(editingGame.gameId, submitData)
      } else {
        await createAthleticDirectorGame(submitData)
      }

      // Reset form and refetch games
      setFormData({
        homeTeamId: '',
        awayTeamId: '',
        gameDate: '',
        gameTime: '',
        location: '',
        week: '',
        season: new Date().getFullYear(),
        status: 'Scheduled'
      })
      setShowCreateForm(false)
      setEditingGame(null)
      setError('')
      await fetchGames()
      
      // Clear URL param if present
      if (router.query.action) {
        router.replace('/athletic-director/games', undefined, { shallow: true })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (game) => {
    setEditingGame(game)
    
    // Convert gameDate back to separate date and time fields
    const gameDate = new Date(game.gameDate)
    const dateString = gameDate.toISOString().split('T')[0]
    const timeString = gameDate.toTimeString().slice(0, 5)
    
    setFormData({
      homeTeamId: game.homeTeam?.teamId?.toString() || '',
      awayTeamId: game.awayTeam?.teamId?.toString() || '',
      gameDate: dateString,
      gameTime: timeString,
      location: game.location || '',
      week: (game.week !== undefined && game.week !== null) ? game.week.toString() : '',
      season: game.season || new Date().getFullYear(),
      status: game.isCompleted ? 'Completed' : 'Scheduled'
    });
    setShowCreateForm(true)
  }

  const handleDelete = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/athletic-directors/games/${gameId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete game' }))
        throw new Error(errorData.error || 'Failed to delete game')
      }

      await fetchGames()
    } catch (err) {
      setError(err.message || 'Failed to delete game')
    }
  }

  const cancelForm = () => {
    setShowCreateForm(false)
    setEditingGame(null)
    setFormData({
      homeTeamId: '',
      awayTeamId: '',
      gameDate: '',
      gameTime: '',
      location: '',
      week: '',
      season: new Date().getFullYear(),
      status: 'Scheduled'
    })
    setError('')
    if (router.query.action) {
      router.replace('/athletic-director/games', undefined, { shallow: true })
    }
  }

  const formatGameDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
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
            <h1 className="text-4xl font-bold text-white mb-2">Games Management</h1>
          </div>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg"
              style={{ boxShadow: '0 2px 12px #00e0ff33' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Schedule Game
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingGame ? 'Edit Game' : 'Schedule New Game'}
            </h2>
            
            {teams.length < 2 && (
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <p className="text-yellow-400">
                  You need at least 2 teams to schedule a game. 
                  <a href="/athletic-director/teams" className="underline ml-1">Create teams first</a>
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Home Team *
                </label>
                <select
                  required
                  value={formData.homeTeamId}
                  onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Select Home Team</option>
                  {teams.map((team, index) => (
                    <option key={team.teamId || `home-team-${index}`} value={team.teamId}>
                      {team.name} ({team.school || team.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Away Team *
                </label>
                <select
                  required
                  value={formData.awayTeamId}
                  onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Select Away Team</option>
                  {teams.map((team, index) => (
                    <option key={team.teamId || `away-team-${index}`} value={team.teamId} disabled={team.teamId && team.teamId.toString() === formData.homeTeamId}>
                      {team.name} ({team.school || team.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Game Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.gameDate}
                  onChange={(e) => setFormData({ ...formData, gameDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Game Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.gameTime}
                  onChange={(e) => setFormData({ ...formData, gameTime: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter game location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Week
                </label>
                <input
                  type="number"
                  min="1"
                  max="17"
                  value={formData.week}
                  onChange={(e) => setFormData({ ...formData, week: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter week number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Season *
                </label>
                <input
                  type="number"
                  required
                  min="2020"
                  max="2030"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={teams.length < 2}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {editingGame ? 'Update Game' : 'Schedule Game'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Games List */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-white">All Games ({games.length})</h2>
            <input
              type="text"
              placeholder="Filter by team, location, or week..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ marginTop: 12, width: '100%', maxWidth: 350, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
            />
          </div>
          {games.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Games Scheduled</h3>
              <p className="text-slate-400 mb-6">Schedule your first game to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                disabled={teams.length < 2}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                {teams.length < 2 ? 'Create Teams First' : 'Schedule Game'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {games
                .filter(game => {
                  const search = filter.toLowerCase();
                  return (
                    (game.awayTeam?.name && game.awayTeam.name.toLowerCase().includes(search)) ||
                    (game.homeTeam?.name && game.homeTeam.name.toLowerCase().includes(search)) ||
                    (game.location && game.location.toLowerCase().includes(search)) ||
                    (game.week && game.week.toString().includes(search))
                  );
                })
                .map((game, index) => (
                  <div key={`game-${game.gameId || index}`} className="p-6 hover:bg-slate-700/30 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">
                            {game.awayTeam?.name || 'Away Team'} @ {game.homeTeam?.name || 'Home Team'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.isCompleted ? 'Completed' : 'Scheduled')}`}>
                            {game.isCompleted ? 'Completed' : 'Scheduled'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Date & Time:</span>
                            <p className="text-white">{formatGameDate(game.gameDate)}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Location:</span>
                            <p className="text-white">{game.location || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Week:</span>
                            <p className="text-white">{game.week !== undefined && game.week !== null ? game.week : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(game)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(game.gameId)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Only Athletic Directors can access this page
export default withAuth(GamesManagement, ['AthleticDirector'])