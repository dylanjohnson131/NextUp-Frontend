import { useState, useEffect } from 'react'
import withAuth from '../../hocs/withAuth'
import { fetchMyGoals, createPlayerGoal, updatePlayerGoal, deletePlayerGoal, getCurrentPlayer } from '../../lib/api'

function MyGoals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [formData, setFormData] = useState({
    goalType: '',
    targetValue: '',
    currentValue: '',
    season: ''
  })

  // Load goals and player info on component mount
  useEffect(() => {
    loadPlayerAndGoals()
  }, [])

  const loadPlayerAndGoals = async () => {
    try {
      setLoading(true)
      const player = await getCurrentPlayer()
      setCurrentPlayer(player)
      await loadGoals()
    } catch (err) {
      console.error('Error loading player data:', err)
      setError('Failed to load player information')
      setLoading(false)
    }
  }

  const loadGoals = async () => {
    try {
      setLoading(true)
      const data = await fetchMyGoals()
      setGoals(data || [])
    } catch (err) {
      console.error('Error loading goals:', err)
      setError('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      goalType: '',
      targetValue: '',
      currentValue: '',
      season: ''
    })
    setEditingGoal(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentPlayer) {
      setError('Player information not loaded')
      return
    }
    
    try {
      const goalData = {
        ...formData,
        targetValue: parseInt(formData.targetValue) || 0,
        currentValue: parseInt(formData.currentValue) || 0
      }

      if (editingGoal) {
        await updatePlayerGoal(editingGoal.playerGoalId, goalData)
      } else {
        // Add playerId for new goals
        goalData.playerId = currentPlayer.playerId
        await createPlayerGoal(goalData)
      }

      await loadGoals()
      resetForm()
    } catch (err) {
      console.error('Error saving goal:', err)
      setError(`Failed to ${editingGoal ? 'update' : 'create'} goal`)
    }
  }

  const handleEdit = (goal) => {
    setFormData({
      goalType: goal.goalType || '',
      targetValue: goal.targetValue?.toString() || '',
      currentValue: goal.currentValue?.toString() || '',
      season: goal.season || ''
    })
    setEditingGoal(goal)
    setShowForm(true)
  }

  const handleDelete = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      await deletePlayerGoal(goalId)
      await loadGoals()
    } catch (err) {
      console.error('Error deleting goal:', err)
      setError('Failed to delete goal')
    }
  }

  const calculateProgress = (current, target) => {
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-white text-center">Loading goals...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Goals</h1>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="float-right text-red-300 hover:text-red-100"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="mb-6">
        <button 
          onClick={() => setShowForm(true)}
          className="bg-cyan-400 text-slate-900 px-4 py-2 rounded font-medium hover:bg-cyan-300"
        >
          + Create New Goal
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Goal Type</label>
              <input
                type="text"
                value={formData.goalType}
                onChange={(e) => setFormData({...formData, goalType: e.target.value})}
                className="w-full p-3 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-400"
                placeholder="e.g., Rushing Yards, Touchdowns, Tackles"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Target Value</label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                  className="w-full p-3 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-400"
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Current Value</label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  className="w-full p-3 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Season</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                className="w-full p-3 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-400"
                placeholder="2024"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-cyan-400 text-slate-900 px-6 py-2 rounded font-medium hover:bg-cyan-300"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-600 text-white px-6 py-2 rounded font-medium hover:bg-slate-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Goals</h2>
        
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No goals created yet.</p>
            <p className="text-slate-500 text-sm mt-1">Click "Create New Goal" to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentValue, goal.targetValue)
              
              return (
                <div key={goal.playerGoalId} className="bg-slate-700 rounded p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{goal.goalType}</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {goal.currentValue} / {goal.targetValue} 
                        {goal.season && ` (${goal.season})`}
                      </p>
                      <div className="mt-2">
                        <div className="bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-cyan-400 h-2 rounded-full transition-all" 
                            style={{width: `${progress}%`}}
                          ></div>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">{progress.toFixed(1)}% Complete</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleEdit(goal)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm px-2 py-1"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(goal.playerGoalId)}
                        className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default withAuth(MyGoals, 'Player')