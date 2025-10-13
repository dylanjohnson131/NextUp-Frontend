import { useState, useEffect } from 'react'
import { registerPlayer, registerCoach, fetchTeams } from '../lib/api'

export default function Register() {
  const [userType, setUserType] = useState('player')
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Common fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Player specific fields
  const [teamId, setTeamId] = useState('')
  const [position, setPosition] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')
  
  // Coach specific fields
  const [experienceYears, setExperienceYears] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [certification, setCertification] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (userType === 'player') {
      fetchTeams().then(t => setTeams(t || [])).catch(() => setTeams([]))
    }
  }, [userType])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let res
      if (userType === 'player') {
        const playerData = {
          firstName,
          lastName,
          email,
          password,
          teamId: parseInt(teamId),
          position: position || null,
          age: age ? parseInt(age) : null,
          height: height || null,
          weight: weight ? parseInt(weight) : null,
          jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null
        }
        res = await registerPlayer(playerData)
      } else {
        const coachData = {
          firstName,
          lastName,
          email,
          password,
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          specialty: specialty || null,
          certification: certification || null,
          bio: bio || null
        }
        res = await registerCoach(coachData)
      }

      if (res && (res.message === 'Player registered and signed in.' || res.message === 'Coach registered and signed in.')) {
        window.location.href = '/dashboard'
      } else {
        setError('Registration failed')
      }
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>Create Account</h1>
      
      <div className="mt-4">
        <label className="block mb-2">I want to register as a:</label>
        <div className="flex gap-4 mb-6">
          <button 
            type="button"
            onClick={() => setUserType('player')}
            className={`px-4 py-2 rounded ${userType === 'player' ? 'bg-cyan-400 text-slate-900' : 'bg-slate-700 text-white'}`}
          >
            Player
          </button>
          <button 
            type="button"
            onClick={() => setUserType('coach')}
            className={`px-4 py-2 rounded ${userType === 'coach' ? 'bg-cyan-400 text-slate-900' : 'bg-slate-700 text-white'}`}
          >
            Coach
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Common Fields */}
        <div>
          <label className="block">First Name *</label>
          <input 
            type="text" 
            required
            value={firstName} 
            onChange={e => setFirstName(e.target.value)} 
            className="w-full p-2 rounded bg-slate-800" 
          />
        </div>
        
        <div>
          <label className="block">Last Name *</label>
          <input 
            type="text" 
            required
            value={lastName} 
            onChange={e => setLastName(e.target.value)} 
            className="w-full p-2 rounded bg-slate-800" 
          />
        </div>
        
        <div>
          <label className="block">Email *</label>
          <input 
            type="email" 
            required
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-2 rounded bg-slate-800" 
          />
        </div>
        
        <div>
          <label className="block">Password *</label>
          <input 
            type="password" 
            required
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-2 rounded bg-slate-800" 
          />
        </div>

        {/* Player Specific Fields */}
        {userType === 'player' && (
          <>
            <div>
              <label className="block">Team *</label>
              <select 
                required
                value={teamId} 
                onChange={e => setTeamId(e.target.value)} 
                className="w-full p-2 rounded bg-slate-800"
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.TeamId} value={team.TeamId}>
                    {team.Name} - {team.Location}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block">Position</label>
              <input 
                type="text" 
                value={position} 
                onChange={e => setPosition(e.target.value)} 
                placeholder="e.g., Forward, Guard, etc."
                className="w-full p-2 rounded bg-slate-800" 
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block">Age</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={e => setAge(e.target.value)} 
                  className="w-full p-2 rounded bg-slate-800" 
                />
              </div>
              <div className="flex-1">
                <label className="block">Jersey #</label>
                <input 
                  type="number" 
                  value={jerseyNumber} 
                  onChange={e => setJerseyNumber(e.target.value)} 
                  className="w-full p-2 rounded bg-slate-800" 
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block">Height</label>
                <input 
                  type="text" 
                  value={height} 
                  onChange={e => setHeight(e.target.value)} 
                  placeholder="e.g., 6'2&quot;"
                  className="w-full p-2 rounded bg-slate-800" 
                />
              </div>
              <div className="flex-1">
                <label className="block">Weight (lbs)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={e => setWeight(e.target.value)} 
                  className="w-full p-2 rounded bg-slate-800" 
                />
              </div>
            </div>
          </>
        )}

        {/* Coach Specific Fields */}
        {userType === 'coach' && (
          <>
            <div>
              <label className="block">Years of Experience</label>
              <input 
                type="number" 
                value={experienceYears} 
                onChange={e => setExperienceYears(e.target.value)} 
                className="w-full p-2 rounded bg-slate-800" 
              />
            </div>
            
            <div>
              <label className="block">Specialty</label>
              <input 
                type="text" 
                value={specialty} 
                onChange={e => setSpecialty(e.target.value)} 
                placeholder="e.g., Offensive Strategy, Defense"
                className="w-full p-2 rounded bg-slate-800" 
              />
            </div>
            
            <div>
              <label className="block">Certification</label>
              <input 
                type="text" 
                value={certification} 
                onChange={e => setCertification(e.target.value)} 
                placeholder="e.g., Level 3 Coach"
                className="w-full p-2 rounded bg-slate-800" 
              />
            </div>
            
            <div>
              <label className="block">Bio</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full p-2 rounded bg-slate-800" 
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-cyan-400 text-slate-900 px-4 py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : `Register as ${userType === 'player' ? 'Player' : 'Coach'}`}
        </button>
        
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>

      <div className="mt-6">
        <p>Already have an account? <a href="/login" className="text-cyan-400 hover:underline">Sign in</a></p>
      </div>
    </main>
  )
}