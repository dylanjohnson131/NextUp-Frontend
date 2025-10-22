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
      <main className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text)', fontSize: '1.2rem', textAlign: 'center' }}>Loading your goals...</div>
      </main>
    );
  }

  return (
  <main className="container" style={{ maxWidth: 700, margin: '7rem auto 4rem auto', padding: '2.5rem 2rem', paddingTop: '2.5rem', background: 'var(--card)', borderRadius: 16, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a' }}>
      <h1 style={{
        fontSize: '2.6rem',
        fontWeight: 800,
        marginBottom: '2.2rem',
        background: 'var(--text-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        textAlign: 'center',
        letterSpacing: '2px',
        textShadow: '0 1px 2px #222, 0 0 10px #283e5133'
      }}>My Goals</h1>
      {error && (
        <div style={{ background: '#ff4d4f22', color: '#ff4d4f', borderRadius: 8, padding: '0.7rem 1rem', marginBottom: 18, textAlign: 'center', position: 'relative' }}>
          {error}
          <button onClick={() => setError(null)} style={{ position: 'absolute', right: 12, top: 8, background: 'none', border: 'none', color: '#ff4d4f', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>
      )}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button onClick={() => setShowForm(true)} style={{
          background: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.7rem 1.4rem',
          fontWeight: 600,
          fontSize: '1.1rem',
          boxShadow: '0 2px 8px #00e0ff22',
          cursor: 'pointer',
          letterSpacing: '1px'
        }}>
          + Create New Goal
        </button>
      </div>
      {/* Goal Form */}
      {showForm && (
        <div style={{ background: '#111827', borderRadius: 12, boxShadow: '0 2px 12px #00e0ff22', padding: '1.5rem 1.2rem', marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.1rem' }}>
            <div>
              <label style={{ color: 'var(--muted)', fontWeight: 500 }}>Goal Type</label>
              <input
                type="text"
                value={formData.goalType}
                onChange={(e) => setFormData({...formData, goalType: e.target.value})}
                placeholder="e.g., Rushing Yards, Touchdowns, Tackles"
                required
                style={{ width: '100%', padding: '0.7rem', borderRadius: 7, border: '1px solid #222', background: '#181f2a', color: 'var(--text)', fontSize: '1rem', marginTop: 4 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'var(--muted)', fontWeight: 500 }}>Target Value</label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                  placeholder="100"
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: 7, border: '1px solid #222', background: '#181f2a', color: 'var(--text)', fontSize: '1rem', marginTop: 4 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'var(--muted)', fontWeight: 500 }}>Current Value</label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  placeholder="0"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: 7, border: '1px solid #222', background: '#181f2a', color: 'var(--text)', fontSize: '1rem', marginTop: 4 }}
                />
              </div>
            </div>
            <div>
              <label style={{ color: 'var(--muted)', fontWeight: 500 }}>Season</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                placeholder="2024"
                style={{ width: '100%', padding: '0.7rem', borderRadius: 7, border: '1px solid #222', background: '#181f2a', color: 'var(--text)', fontSize: '1rem', marginTop: 4 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
              <button type="submit" style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem 1.4rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 2px 8px #00e0ff22',
                cursor: 'pointer',
                letterSpacing: '1px'
              }}>{editingGoal ? 'Update Goal' : 'Create Goal'}</button>
              <button type="button" onClick={resetForm} style={{
                background: '#222',
                color: 'var(--text)',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem 1.4rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                letterSpacing: '1px'
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 18, color: 'var(--text)', textAlign: 'center' }}>Your Goals</h2>
        {goals.length === 0 ? (
          <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 24 }}>
            <p>No goals created yet.</p>
            <p>Click "Create New Goal" to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentValue, goal.targetValue);
              return (
                <div key={goal.playerGoalId} style={{
                  background: 'linear-gradient(180deg, #1e293b 80%, #00e0ff11 100%)',
                  borderRadius: 12,
                  boxShadow: '0 1px 8px #00e0ff22',
                  padding: '1.5rem 1.2rem',
                  color: 'var(--text)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.7rem',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#00e0ff', textShadow: '0 1px 8px #00e0ff33' }}>{goal.goalType}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: '4px 0 0 0' }}>
                        {goal.currentValue} / {goal.targetValue}
                        {goal.season && ` (${goal.season})`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(goal)} style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.4rem 1rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        letterSpacing: '1px'
                      }}>Edit</button>
                      <button onClick={() => handleDelete(goal.playerGoalId)} style={{
                        background: '#ff4d4f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.4rem 1rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        letterSpacing: '1px'
                      }}>Delete</button>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ background: '#222', borderRadius: 6, height: 14, width: '100%', overflow: 'hidden', boxShadow: '0 1px 4px #00e0ff22' }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #00e0ff 0%, #00e0ff88 100%)',
                        borderRadius: 6,
                        transition: 'width 0.4s'
                      }}></div>
                    </div>
                    <p style={{ color: '#00e0ff', fontWeight: 600, fontSize: '1rem', marginTop: 4, textAlign: 'right' }}>{progress.toFixed(1)}% Complete</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default withAuth(MyGoals, 'Player')