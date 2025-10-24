import { useState, useEffect } from 'react'
import { registerPlayer, registerCoach, fetchTeams } from '../lib/api'
import { withGuest } from '../hocs/withAuth'

function Register() {
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
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
          TeamId: parseInt(teamId),
          Position: position || null,
          Age: age ? parseInt(age) : null,
          Height: height || null,
          Weight: weight ? parseInt(weight) : null,
          JerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null
        }
        res = await registerPlayer(playerData)
      } else {
        const coachData = {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
          ExperienceYears: experienceYears ? parseInt(experienceYears) : null,
          Specialty: specialty || null,
          Certification: certification || null,
          Bio: bio || null
        }
        res = await registerCoach(coachData)
      }

      // Log the response for debugging
      console.log('Registration response:', res);
      // Accept any response with a user or player object, or a message containing 'registered'
      const success =
        (res && (res.Message?.toLowerCase().includes('registered') || res.message?.toLowerCase().includes('registered')))
        || (res && (res.User || res.Player));
      if (success) {
        if (userType === 'coach') {
          window.location.href = '/coach/dashboard';
        } else {
          window.location.href = '/player/dashboard';
        }
      } else {
        setError(res?.error || 'Registration failed');
      }
    } catch (err) {
      // Try to get a more specific error message
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || 'Registration failed');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)', paddingTop: '7rem' }}>
      <section style={{
        background: 'rgba(20, 30, 50, 0.98)',
        borderRadius: '18px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        padding: '2.5rem 2rem',
        maxWidth: 440,
        width: '100%',
        textAlign: 'center',
        border: '1.5px solid var(--primary, #00e0ff)'
      }}>
        {/* Logo removed as requested */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--primary, #00e0ff)',
          letterSpacing: '1px',
          marginBottom: '1.5rem',
          textShadow: '0 2px 8px #00e0ff33'
        }}>Create Account</h1>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>I want to register as a:</label>
          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setUserType('player')}
              style={{
                padding: '0.7rem 2.2rem',
                borderRadius: '10px',
                background: userType === 'player' ? 'var(--primary, #00e0ff)' : '#1e293b',
                color: userType === 'player' ? '#1e293b' : '#b6c2d1',
                fontWeight: 700,
                fontSize: '1.05rem',
                border: userType === 'player' ? 'none' : '1.5px solid #283e51',
                boxShadow: userType === 'player' ? '0 2px 8px #00e0ff33' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s'
              }}
            >Player</button>
            <button
              type="button"
              onClick={() => setUserType('coach')}
              style={{
                padding: '0.7rem 2.2rem',
                borderRadius: '10px',
                background: userType === 'coach' ? 'var(--primary, #00e0ff)' : '#1e293b',
                color: userType === 'coach' ? '#1e293b' : '#b6c2d1',
                fontWeight: 700,
                fontSize: '1.05rem',
                border: userType === 'coach' ? 'none' : '1.5px solid #283e51',
                boxShadow: userType === 'coach' ? '0 2px 8px #00e0ff33' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s'
              }}
            >Coach</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          {/* Common Fields */}
          <div>
            <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>First Name *</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{
                width: '93%',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#fff',
                border: '1.5px solid #283e51',
                fontSize: '1rem',
                marginBottom: '1.2rem',
                outline: 'none',
                boxShadow: '0 1px 4px #00e0ff11',
                transition: 'border 0.2s'
              }}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Last Name *</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={{
                width: '93%',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#fff',
                border: '1.5px solid #283e51',
                fontSize: '1rem',
                marginBottom: '1.2rem',
                outline: 'none',
                boxShadow: '0 1px 4px #00e0ff11',
                transition: 'border 0.2s'
              }}
              autoComplete="family-name"
            />
          </div>
          <div>
            <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '93%',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#fff',
                border: '1.5px solid #283e51',
                fontSize: '1rem',
                marginBottom: '1.2rem',
                outline: 'none',
                boxShadow: '0 1px 4px #00e0ff11',
                transition: 'border 0.2s'
              }}
              autoComplete="email"
            />
          </div>
          <div>
            <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '93%',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#fff',
                border: '1.5px solid #283e51',
                fontSize: '1rem',
                marginBottom: '1.2rem',
                outline: 'none',
                boxShadow: '0 1px 4px #00e0ff11',
                transition: 'border 0.2s'
              }}
              autoComplete="new-password"
            />
          </div>
          {/* Player Specific Fields */}
          {userType === 'player' && (
            <>
              <div>
                <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Team *</label>
                <select
                  required
                  value={teamId}
                  onChange={e => setTeamId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '8px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1.5px solid #283e51',
                    fontSize: '1rem',
                    marginBottom: '1.2rem',
                    outline: 'none',
                    boxShadow: '0 1px 4px #00e0ff11',
                    transition: 'border 0.2s'
                  }}
                >
                  <option key="select-team" value="">Select a team</option>
                  {teams && teams.length > 0 ? (
                    teams.map(team => (
                      <option key={team.teamId} value={team.teamId}>
                        {team.name} - {team.location}
                      </option>
                    ))
                  ) : (
                    <option key="no-teams" value="" disabled>No teams available</option>
                  )}
                </select>
              </div>
              <div>
                <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Position</label>
                <input
                  type="text"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  placeholder="e.g., Forward, Guard, etc."
                  style={{
                    width: '93%',
                    padding: '0.7rem 1rem',
                    borderRadius: '8px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1.5px solid #283e51',
                    fontSize: '1rem',
                    marginBottom: '1.2rem',
                    outline: 'none',
                    boxShadow: '0 1px 4px #00e0ff11',
                    transition: 'border 0.2s'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1.2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    style={{
                      width: '87%',
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      background: '#1e293b',
                      color: '#fff',
                      border: '1.5px solid #283e51',
                      fontSize: '1rem',
                      marginBottom: '1.2rem',
                      outline: 'none',
                      boxShadow: '0 1px 4px #00e0ff11',
                      transition: 'border 0.2s'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Jersey #</label>
                  <input
                    type="number"
                    value={jerseyNumber}
                    onChange={e => setJerseyNumber(e.target.value)}
                    style={{
                      width: '85%',
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      background: '#1e293b',
                      color: '#fff',
                      border: '1.5px solid #283e51',
                      fontSize: '1rem',
                      marginBottom: '1.2rem',
                      outline: 'none',
                      boxShadow: '0 1px 4px #00e0ff11',
                      transition: 'border 0.2s'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder={'e.g., 6\'2"'}
                    style={{
                      width: '87%',
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      background: '#1e293b',
                      color: '#fff',
                      border: '1.5px solid #283e51',
                      fontSize: '1rem',
                      marginBottom: '1.2rem',
                      outline: 'none',
                      boxShadow: '0 1px 4px #00e0ff11',
                      transition: 'border 0.2s'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Weight (lbs)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    style={{
                      width: '85%',
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      background: '#1e293b',
                      color: '#fff',
                      border: '1.5px solid #283e51',
                      fontSize: '1rem',
                      marginBottom: '1.2rem',
                      outline: 'none',
                      boxShadow: '0 1px 4px #00e0ff11',
                      transition: 'border 0.2s'
                    }}
                  />
                </div>
              </div>
            </>
          )}
          {/* Coach Specific Fields */}
          {userType === 'coach' && (
            <>
              <div>
                <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Years of Experience</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={e => setExperienceYears(e.target.value)}
                  style={{
                    width: '93%',
                    padding: '0.7rem 1rem',
                    borderRadius: '8px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1.5px solid #283e51',
                    fontSize: '1rem',
                    marginBottom: '1.2rem',
                    outline: 'none',
                    boxShadow: '0 1px 4px #00e0ff11',
                    transition: 'border 0.2s'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  placeholder="e.g., Offensive Strategy, Defense"
                  style={{
                    width: '93%',
                    padding: '0.7rem 1rem',
                    borderRadius: '8px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1.5px solid #283e51',
                    fontSize: '1rem',
                    marginBottom: '1.2rem',
                    outline: 'none',
                    boxShadow: '0 1px 4px #00e0ff11',
                    transition: 'border 0.2s'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Certification</label>
                <input
                  type="text"
                  value={certification}
                  onChange={e => setCertification(e.target.value)}
                  placeholder="e.g., Level 3 Coach"
                  style={{
                    width: '93%',
                    padding: '0.7rem 1rem',
                    borderRadius: '8px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1.5px solid #283e51',
                    fontSize: '1rem',
                    marginBottom: '1.2rem',
                    outline: 'none',
                    boxShadow: '0 1px 4px #00e0ff11',
                    transition: 'border 0.2s'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block' }}>Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  style={{
                    width: '93%',
                    padding: '0.7rem 1rem',
                    borderRadius: '8px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1.5px solid #283e51',
                    fontSize: '1rem',
                    marginBottom: '1.2rem',
                    outline: 'none',
                    boxShadow: '0 1px 4px #00e0ff11',
                    transition: 'border 0.2s'
                  }}
                />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'var(--primary, #00e0ff)',
              color: '#1e293b',
              fontWeight: 700,
              fontSize: '1.1rem',
              padding: '0.8rem 0',
              borderRadius: '10px',
              border: 'none',
              boxShadow: '0 2px 8px #00e0ff33',
              marginTop: '0.5rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >{loading ? 'Creating Account...' : `Register as ${userType === 'player' ? 'Player' : 'Coach'}`}</button>
          {error && <p style={{ color: '#f87171', marginTop: '1rem', fontWeight: 600 }}>{error}</p>}
        </form>
        <div style={{ marginTop: '1.5rem', color: '#b6c2d1', fontSize: '1rem' }}>
          <p>Already have an account?{' '}
            <a href="/login" style={{ color: 'var(--primary, #00e0ff)', fontWeight: 700, textDecoration: 'underline', marginLeft: 4 }}>Sign in</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default withGuest(Register)