import Link from 'next/link'

export default function Home() {
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
        <img src="/nextup-logo.png" alt="NextUp Logo" style={{ width: 220, marginBottom: '-0.5rem', filter: 'drop-shadow(0 2px 8px #00e0ff33)' }} />
        <h1 style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--primary, #00e0ff)',
          letterSpacing: '1.5px',
          marginTop: '1.2rem',
          marginBottom: '0.5rem',
        }}>Rise To The Elite.</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2.2rem' }}>
          Manage teams &bull; Track performance &bull; Analyze opponents
        </p>
        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
          <Link href="/login" style={{
            background: 'var(--primary, #00e0ff)',
            color: '#0a192f',
            padding: '0.8rem 2.2rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 2px 8px #00e0ff33',
          }}>Sign In</Link>
          <Link href="/register" style={{
            background: 'none',
            color: 'var(--primary, #00e0ff)',
            border: '2px solid var(--primary, #00e0ff)',
            padding: '0.8rem 2.2rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1.1rem',
            textDecoration: 'none',
          }}>Register</Link>
        </div>
      </section>
    </main>
  )
}
