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
      setError('Failed to delete goal')
    }
  }

  const calculateProgress = (current, target) => {
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return (
      <main>
        <div>Loading goals...</div>
      </main>
    )
  }

  return (
    <main>
      <h1>My Goals</h1>
      {error && (
        <div>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      <div>
        <button onClick={() => setShowForm(true)}>
          + Create New Goal
        </button>
      </div>
      {/* Goal Form */}
      {showForm && (
        <div>
          <h2>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Goal Type</label>
              <input
                type="text"
                value={formData.goalType}
                onChange={(e) => setFormData({...formData, goalType: e.target.value})}
                placeholder="e.g., Rushing Yards, Touchdowns, Tackles"
                required
              />
            </div>
            <div>
              <div>
                <label>Target Value</label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <label>Current Value</label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label>Season</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                placeholder="2024"
              />
            </div>
            <div>
              <button type="submit">
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div>
        <h2>Your Goals</h2>
        {goals.length === 0 ? (
          <div>
            <p>No goals created yet.</p>
            <p>Click "Create New Goal" to get started!</p>
          </div>
        ) : (
          <div>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentValue, goal.targetValue)
              return (
                <div key={goal.playerGoalId}>
                  <div>
                    <div>
                      <h3>{goal.goalType}</h3>
                      <p>
                        {goal.currentValue} / {goal.targetValue} 
                        {goal.season && ` (${goal.season})`}
                      </p>
                      <div>
                        <div>
                          <div style={{width: `${progress}%`}}></div>
                        </div>
                        <p>{progress.toFixed(1)}% Complete</p>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => handleEdit(goal)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(goal.playerGoalId)}>
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