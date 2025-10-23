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
      <div style={{ minHeight: '100vh', background: 'var(--background-gradient)' }}>
  <div className="main-container" style={{ paddingTop: '9rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Games Management</h1>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-accent"
                style={{ display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 12px #00e0ff33', padding: '12px 24px', borderRadius: 10, fontWeight: 500, fontSize: '1rem', color: '#fff', background: 'var(--accent)', border: 'none', cursor: 'pointer' }}
              >
                <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Schedule Game
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div style={{ marginBottom: 24, padding: 16, background: 'rgba(180,0,0,0.08)', border: '1px solid #a00', borderRadius: 10 }}>
              <p style={{ color: '#e44' }}>{error}</p>
            </div>
          )}

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div style={{ marginBottom: 32, background: 'rgba(30,40,60,0.7)', border: '1px solid #334', borderRadius: 16, padding: 24, backdropFilter: 'blur(2px)' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
                {editingGame ? 'Edit Game' : 'Schedule New Game'}
              </h2>
              {teams.length < 2 && (
                <div style={{ marginBottom: 24, padding: 16, background: 'rgba(180,180,0,0.08)', border: '1px solid #aa0', borderRadius: 10 }}>
                  <p style={{ color: '#e4e400' }}>
                    You need at least 2 teams to schedule a game. 
                    <a href="/athletic-director/teams" style={{ textDecoration: 'underline', marginLeft: 4, color: 'var(--accent)' }}>Create teams first</a>
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Home Team *
                  </label>
                  <select
                    required
                    value={formData.homeTeamId}
                    onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
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
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Away Team *
                  </label>
                  <select
                    required
                    value={formData.awayTeamId}
                    onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
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
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Game Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.gameDate}
                    onChange={(e) => setFormData({ ...formData, gameDate: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Game Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.gameTime}
                    onChange={(e) => setFormData({ ...formData, gameTime: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
                    placeholder="Enter game location"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="17"
                    value={formData.week}
                    onChange={(e) => setFormData({ ...formData, week: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
                    placeholder="Enter week number"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Season *
                  </label>
                  <input
                    type="number"
                    required
                    min="2020"
                    max="2030"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 16, marginTop: 8 }}>
                  <button
                    type="submit"
                    disabled={teams.length < 2}
                    className="btn-accent"
                    style={{ padding: '12px 32px', borderRadius: 10, fontWeight: 500, fontSize: '1rem', color: '#fff', background: 'var(--accent)', border: 'none', cursor: teams.length < 2 ? 'not-allowed' : 'pointer', opacity: teams.length < 2 ? 0.6 : 1 }}
                  >
                    {editingGame ? 'Update Game' : 'Schedule Game'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="btn-secondary"
                    style={{ padding: '12px 32px', borderRadius: 10, fontWeight: 500, fontSize: '1rem', color: '#fff', background: '#334', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Games List */}
          <div style={{ background: 'rgba(30,40,60,0.7)', border: '1px solid #334', borderRadius: 20, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a', overflow: 'hidden', marginBottom: 32, marginTop: 24 }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #334', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px' }}>All Games <span style={{ color: 'var(--accent)' }}>({games.length})</span></h2>
              <input
                type="text"
                placeholder="Filter by team, location, or week..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, padding: '10px 16px', color: '#fff', fontSize: '1rem', width: '100%', maxWidth: 260, marginLeft: 16 }}
              />
            </div>
            {games.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📅</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Games Scheduled</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Schedule your first game to get started</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  disabled={teams.length < 2}
                  className="btn-accent"
                  style={{ padding: '16px 32px', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem', color: '#fff', background: 'var(--accent)', border: 'none', cursor: teams.length < 2 ? 'not-allowed' : 'pointer', opacity: teams.length < 2 ? 0.6 : 1 }}
                >
                  <span style={{ fontSize: '1.5rem', marginRight: 8 }}>+</span> Schedule Game
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, padding: 32 }}>
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
                    <div key={`game-${game.gameId || index}`} style={{ borderRadius: 16, background: 'rgba(20,30,40,0.85)', border: '1px solid #334', boxShadow: '0 2px 12px #00e0ff33', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', transition: 'box-shadow 0.2s' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {game.awayTeam?.name || 'Away Team'} @ {game.homeTeam?.name || 'Home Team'}
                          </h3>
                          <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600, background: game.isCompleted ? 'var(--success-bg)' : 'var(--accent-bg)', color: game.isCompleted ? 'var(--success)' : 'var(--accent)' }}>
                            {game.isCompleted ? 'Completed' : 'Scheduled'}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, fontSize: '0.95rem', marginBottom: 8 }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Date & Time:</span>
                            <p style={{ color: '#fff', fontWeight: 500 }}>{formatGameDate(game.gameDate)}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
                            <p style={{ color: '#fff', fontWeight: 500 }}>{game.location || 'N/A'}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Week:</span>
                            <p style={{ color: '#fff', fontWeight: 500 }}>{game.week !== undefined && game.week !== null ? game.week : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                        <button
                          onClick={() => handleEdit(game)}
                          className="btn-primary"
                          style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 500, fontSize: '0.95rem', color: '#fff', background: 'var(--primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0l1.586 1.586a1 1 0 010 1.414L11 15H9v-2z" /></svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(game.gameId)}
                          className="btn-danger"
                          style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 500, fontSize: '0.95rem', color: '#fff', background: 'var(--danger)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          Delete
                        </button>
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