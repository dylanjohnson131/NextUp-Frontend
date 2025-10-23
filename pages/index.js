import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect authenticated users to their role-specific dashboard
      if (user.role === 'Coach') {
        router.push('/coach/dashboard')
      } else if (user.role === 'Player') {
        router.push('/player/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [loading, isAuthenticated, user, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <main>
        <div>Loading...</div>
      </main>
    )
  }

  // Don't render anything if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  // Show landing page for unauthenticated users
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)' }}>
      <section style={{
        background: 'rgba(20, 30, 50, 0.98)',
        borderRadius: '18px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        padding: '3rem 2.5rem',
        maxWidth: 420,
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--primary, #00e0ff)',
          letterSpacing: '2px',
          marginBottom: '2.5rem',
          textShadow: '0 2px 8px #00e0ff33'
        }}>NextUp</h1>
        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <Link href="/login" legacyBehavior>
            <a style={{
              background: 'var(--primary, #00e0ff)',
              color: '#fff',
              padding: '0.8rem 2.2rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px #00e0ff33',
              transition: 'background 0.2s, color 0.2s'
            }}>Sign In</a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a style={{
              background: 'none',
              color: 'var(--primary, #00e0ff)',
              border: '2px solid var(--primary, #00e0ff)',
              padding: '0.8rem 2.2rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px #00e0ff33',
              transition: 'background 0.2s, color 0.2s'
            }}>Create Account</a>
          </Link>
        </div>
        <div style={{ color: '#7dd3fc', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.5px' }}>
          Manage teams &bull; Track performance &bull; Analyze opponents
        </div>
      </section>
    </main>
  )
}