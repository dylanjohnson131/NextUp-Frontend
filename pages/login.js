import { useState } from 'react'
import { useRouter } from 'next/router'
import { login, getCurrentUser } from '../lib/api'
import { withGuest } from '../hocs/withAuth'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const router = useRouter()
  const { login: setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await login({ email, password })
      
      if (res && (res.message === 'Logged in successfully' || res.success)) {
        const userInfo = await getCurrentUser()
        setUser(userInfo) 
        
        if (userInfo && userInfo.role === 'Coach') {
          router.push('/coach/dashboard')
        } else if (userInfo && userInfo.role === 'Player') {
          router.push('/player/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)', paddingTop: '5.5rem' }}>
      <section style={{
        background: 'rgba(20, 30, 50, 0.98)',
        borderRadius: '22px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
        padding: '2.2rem 1.2rem',
        maxWidth: 410,
        width: '100%',
        textAlign: 'center',
        border: '2px solid var(--primary, #00e0ff)',
        position: 'relative',
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: 'var(--primary, #00e0ff)',
          letterSpacing: '1.5px',
          marginBottom: '1.7rem',
          textShadow: '0 2px 12px #00e0ff33'
        }}>Log in</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.7rem', textAlign: 'left' }}>
          <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '1.05rem' }}>Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '93%',
              padding: '0.8rem 0.7rem',
              borderRadius: '10px',
              background: '#1e293b',
              color: '#fff',
              border: '1.5px solid #283e51',
              fontSize: '1.08rem',
              marginBottom: '1.1rem',
              outline: 'none',
              boxShadow: '0 1px 4px #00e0ff11',
              transition: 'border 0.2s'
            }}
            autoComplete="email"
          />
          <label style={{ color: '#b6c2d1', fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '1.05rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '93%',
              padding: '0.8rem 0.7rem',
              borderRadius: '10px',
              background: '#1e293b',
              color: '#fff',
              border: '1.5px solid #283e51',
              fontSize: '1.08rem',
              marginBottom: '1.1rem',
              outline: 'none',
              boxShadow: '0 1px 4px #00e0ff11',
              transition: 'border 0.2s'
            }}
            autoComplete="current-password"
          />
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'var(--primary, #00e0ff)',
              color: '#1e293b',
              fontWeight: 700,
              fontSize: '1.13rem',
              padding: '0.9rem 0',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 12px #00e0ff33',
              marginTop: '0.7rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s'
            }}
          >Log in</button>
          {error && <p style={{ color: '#f87171', marginTop: '1.1rem', fontWeight: 600 }}>{error}</p>}
        </form>
        <div style={{ marginTop: '1.7rem', color: '#b6c2d1', fontSize: '1.05rem' }}>
          <p>Don't have an account?{' '}
            <a href="/register" style={{ color: 'var(--primary, #00e0ff)', fontWeight: 700, textDecoration: 'underline', marginLeft: 4 }}>Create one</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default withGuest(Login)
