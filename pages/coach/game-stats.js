import withAuth from '../../hocs/withAuth'

function GameStats() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', letterSpacing: '0.5px' }}>Game Stats</h1>
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.2rem' }}>Live Game Statistics</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.5rem', minWidth: '280px', flex: '1 1 280px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.15rem', marginBottom: '0.7rem' }}>Current Game</h3>
            <p style={{ color: '#b6c2b7', fontSize: '1.05rem', margin: 0 }}>No active game</p>
          </div>
          <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.5rem', minWidth: '280px', flex: '1 1 280px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.15rem', marginBottom: '0.7rem' }}>Quick Stats Entry</h3>
            <p style={{ color: '#b6c2b7', fontSize: '1.05rem', margin: 0 }}>Real-time player statistics tracking interface coming soon...</p>
          </div>
        </div>
        <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', textAlign: 'center', color: '#b6c2b7', fontSize: '1.1rem' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Info:</span> Live game statistics tracking features will allow you to update player stats in real-time during games.
        </div>
      </div>
    </main>
  )
}

export default withAuth(GameStats, 'Coach')