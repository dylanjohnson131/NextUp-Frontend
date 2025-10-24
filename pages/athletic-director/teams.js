import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'
import { fetchAthleticDirectorTeams, createAthleticDirectorTeam, updateAthleticDirectorTeam, deleteAthleticDirectorTeam, fetchCoaches } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function TeamsManagement() {
  const { user } = useAuth()
  const router = useRouter()
  const [teams, setTeams] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    mascot: '',
    location: '',
    city: '',
    state: '',
    division: '',
    conference: '',
    isPublic: true,
    coachId: ''
  })

  useEffect(() => {
    fetchTeams()
    fetchAvailableCoaches()
    if (router.query.action === 'create') {
      setShowCreateForm(true)
    }
  }, [router.query])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const data = await fetchAthleticDirectorTeams()
      if (data && data.length > 0) {
        }
      setTeams(data)
      setError('')
    } catch (err) {
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableCoaches = async () => {
    try {
      const data = await fetchCoaches()
      setCoaches(data || [])
    } catch (err) {
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTeam) {
        await updateAthleticDirectorTeam(editingTeam.teamId, formData)
      } else {
        await createAthleticDirectorTeam(formData)
      }

      setFormData({
        name: '',
        school: '',
        mascot: '',
        location: '',
        city: '',
        state: '',
        division: '',
        conference: '',
        isPublic: true,
        coachId: ''
      })
      setShowCreateForm(false)
      setEditingTeam(null)
      setError('')
      await fetchTeams()
      
      // Clear URL param if present
      if (router.query.action) {
        const url = new URL(window.location)
        url.searchParams.delete('action')
        window.history.replaceState({}, '', url)
      }
    } catch (err) {
      setError(`Failed to ${editingTeam ? 'update' : 'create'} team`)
    }
  }

  const handleEdit = (team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name || '',
      school: team.school || '',
      mascot: team.mascot || '',
      location: team.location || '',
      city: team.city || '',
      state: team.state || '',
      division: team.division || '',
      conference: team.conference || '',
      isPublic: team.isPublic !== undefined ? team.isPublic : true,
      coachId: team.coachId || team.coach?.coachId || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (teamId) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return
    }

    try {
      await deleteAthleticDirectorTeam(teamId)
      await fetchTeams()
      setError('')
    } catch (err) {
      setError('Failed to delete team')
    }
  }

  const cancelForm = () => {
    setShowCreateForm(false)
    setEditingTeam(null)
    setFormData({
      name: '',
      school: '',
      mascot: '',
      location: '',
      city: '',
      state: '',
      division: '',
      conference: '',
      isPublic: true,
      coachId: ''
    })
    if (router.query.action) {
      router.replace('/athletic-director/teams', undefined, { shallow: true })
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
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Teams Management</h1>
              {/* Removed redundant text below header */}
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
                Create Team
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
                {editingTeam ? 'Edit Team' : 'Create New Team'}
              </h2>
              <div style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: '1rem' }}>Fill out all required fields. Assign a coach to enable stat tracking and game management for this team.</div>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem', marginBottom: 0 }}
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    School *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem', marginBottom: 0 }}
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Mascot
                  </label>
                  <input
                    type="text"
                    value={formData.mascot}
                    onChange={(e) => setFormData({ ...formData, mascot: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem', marginBottom: 0 }}
                    placeholder="Enter mascot"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem', marginBottom: 0 }}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem', marginBottom: 0 }}
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Division
                  </label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem', marginBottom: 0 }}
                    placeholder="Enter division"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Conference
                  </label>
                  <input
                    type="text"
                    value={formData.conference}
                    onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem', marginBottom: 0 }}
                    placeholder="Enter conference"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Head Coach *
                  </label>
                  <select
                    value={formData.coachId ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, coachId: value === 'REMOVE' ? null : value });
                    }}
                    style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid #334', borderRadius: 8, color: '#fff', fontSize: '1rem' }}
                  >
                    <option value="">Select a coach...</option>
                    {coaches.map((coach) => (
                      <option key={coach.coachId} value={coach.coachId}>
                        {coach.name} ({coach.email})
                      </option>
                    ))}
                    {editingTeam && editingTeam.coach && (
                      <option value="REMOVE">Remove Coach</option>
                    )}
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2', marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      style={{ marginRight: 8, borderRadius: 4, border: '1px solid #334', background: 'var(--input-bg)', accentColor: 'var(--accent)' }}
                    />
                    Public Team (visible to all users)
                  </label>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 16, marginTop: 8 }}>
                  <button
                    type="submit"
                    className="btn-accent"
                    style={{ padding: '12px 32px', borderRadius: 10, fontWeight: 500, fontSize: '1rem', color: '#fff', background: 'var(--accent)', border: 'none', cursor: 'pointer' }}
                  >
                    {editingTeam ? 'Update Team' : 'Create Team'}
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

          {/* Teams List */}
          <div style={{ background: 'rgba(30,40,60,0.7)', border: '1px solid #334', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #334' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>All Teams ({teams.length})</h2>
            </div>
            {teams.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏈</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Teams Yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Create your first team to get started</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-accent"
                  style={{ padding: '12px 24px', borderRadius: 10, fontWeight: 500, fontSize: '1rem', color: '#fff', background: 'var(--accent)', border: 'none', cursor: 'pointer' }}
                >
                  Create Team
                </button>
              </div>
            ) : (
              <div>
                {teams.map((team, index) => (
                  <div key={`team-${team.id || index}`} style={{ padding: 24, borderBottom: '1px solid #334', transition: 'background 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{team.name}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, fontSize: '0.95rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>School:</span>
                            <p style={{ color: '#fff' }}>{team.school || 'N/A'}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Mascot:</span>
                            <p style={{ color: '#fff' }}>{team.mascot || 'N/A'}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>City, State:</span>
                            <p style={{ color: '#fff' }}>
                              {team.city && team.state ? `${team.city}, ${team.state}` : 
                               team.city ? team.city : 
                               team.state ? team.state : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Division:</span>
                            <p style={{ color: '#fff' }}>{team.division || 'N/A'}</p>
                          </div>
                        </div>
                        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.95rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Head Coach:</span>
                            <p style={{ color: '#fff' }}>{team.coach?.name || 'No coach assigned'}</p>
                          </div>
                          {team.conference && (
                            <div>
                              <span style={{ color: 'var(--text-secondary)' }}>Conference:</span>
                              <p style={{ color: '#fff' }}>{team.conference}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                        <button
                          onClick={() => handleEdit(team)}
                          className="btn-primary"
                          style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 500, fontSize: '0.95rem', color: '#fff', background: 'var(--primary)', border: 'none', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(team.TeamId || team.teamId)}
                          className="btn-danger"
                          style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 500, fontSize: '0.95rem', color: '#fff', background: 'var(--danger)', border: 'none', cursor: 'pointer' }}
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

export default withAuth(TeamsManagement, ['AthleticDirector'])