import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'
import { fetchAthleticDirectorTeams, createAthleticDirectorTeam, updateAthleticDirectorTeam, deleteAthleticDirectorTeam } from '../../lib/api'
import withAuth from '../../hocs/withAuth'

function TeamsManagement() {
  const { user } = useAuth()
  const router = useRouter()
  const [teams, setTeams] = useState([])
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
    coachId: null
  })

  useEffect(() => {
    fetchTeams()
    // Check if we should show create form from URL params
    if (router.query.action === 'create') {
      setShowCreateForm(true)
    }
  }, [router.query])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const data = await fetchAthleticDirectorTeams()
      setTeams(data)
      setError('')
    } catch (err) {
      console.error('Teams fetch error:', err)
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTeam) {
        // Use the correct property name (lowercase teamId)
        await updateAthleticDirectorTeam(editingTeam.teamId, formData)
      } else {
        await createAthleticDirectorTeam(formData)
      }

      // Reset form and refetch teams
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
        coachId: null
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
      console.error('Submit error:', err)
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
      coachId: team.coachId || null
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
      console.error('Delete error:', err)
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
      coachId: null
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Teams Management</h1>
            <p className="text-slate-400 text-lg">Create and manage football teams</p>
          </div>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Team
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
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  School *
                </label>
                <input
                  type="text"
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter school name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mascot
                </label>
                <input
                  type="text"
                  value={formData.mascot}
                  onChange={(e) => setFormData({ ...formData, mascot: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter mascot"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Division
                </label>
                <input
                  type="text"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter division"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Conference
                </label>
                <input
                  type="text"
                  value={formData.conference}
                  onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter conference"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="mr-2 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  Public Team (visible to all users)
                </label>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {editingTeam ? 'Update Team' : 'Create Team'}
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

        {/* Teams List */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-white">All Teams ({teams.length})</h2>
          </div>
          
          {teams.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🏈</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
              <p className="text-slate-400 mb-6">Create your first team to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Create Team
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {teams.map((team, index) => (
                <div key={`team-${team.id || index}`} className="p-6 hover:bg-slate-700/30 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">School:</span>
                          <p className="text-white">{team.school || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Mascot:</span>
                          <p className="text-white">{team.mascot || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">City, State:</span>
                          <p className="text-white">
                            {team.city && team.state ? `${team.city}, ${team.state}` : 
                             team.city ? team.city : 
                             team.state ? team.state : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400">Division:</span>
                          <p className="text-white">{team.division || 'N/A'}</p>
                        </div>
                      </div>
                      {team.conference && (
                        <div className="mt-2">
                          <span className="text-slate-400 text-sm">Conference:</span>
                          <p className="text-white text-sm">{team.conference}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(team)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team.TeamId || team.teamId)}
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
export default withAuth(TeamsManagement, ['AthleticDirector'])