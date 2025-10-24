import { useEffect, useState } from 'react'
import { getCurrentCoach, fetchTeamById } from '../../lib/api'
import { normalizePosition, getStatsForPosition } from '../../lib/positions'
import withAuth from '../../hocs/withAuth'
import Link from 'next/link'

function CoachNotes() {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('coachNotes');
    if (stored) setNotes(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem('coachNotes', notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="mt-8 bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Coach Notes</h2>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={6}
        style={{ width: '93%', padding: '1rem', borderRadius: '8px', fontSize: '1rem', background: '#222', color: '#fff', border: '1px solid #444', resize: 'vertical' }}
        placeholder="Enter your notes here..."
      />
      <button
        onClick={handleSave}
        style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: 'var(--primary)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Save Notes
      </button>
      {saved && <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>Notes saved!</span>}
    </div>
  );
}



function DepthChart() {
  const [coach, setCoach] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('offense')

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const coachInfo = await getCurrentCoach()
        setCoach(coachInfo)
        
        if (coachInfo?.team?.teamId) {
          const teamDetails = await fetchTeamById(coachInfo.team.teamId)
          setTeamData(teamDetails)
        }
      } catch (error) {
        } finally {
        setLoading(false)
      }
    }
    
    loadTeamData()
  }, [])

  const groupPlayersByPosition = (players) => {
    const groups = {}
    players?.forEach(player => {
      const canonicalPosition = normalizePosition(player.position || 'Unknown')
      if (!groups[canonicalPosition]) {
        groups[canonicalPosition] = []
      }
      groups[canonicalPosition].push(player)
    })
    return groups
  }

  const offenseCanonical = new Set(['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL'])
  const defenseCanonical = new Set(['DE', 'RDE','LDE','RDT', 'LDT', 'DT','WLB', 'MLB','SLB', 'LB' ,'CB', 'S', 'FS', 'SS', 'DL'])
  const specialTeamsCanonical = new Set(['K', 'P'])

  const categorizePositions = (positionGroups) => {
    const offense = {}
    const defense = {}
    const specialTeams = {}
    const other = {}

    Object.entries(positionGroups).forEach(([canonicalPosition, players]) => {
      if (offenseCanonical.has(canonicalPosition)) {
        offense[canonicalPosition] = players
      } else if (defenseCanonical.has(canonicalPosition)) {
        defense[canonicalPosition] = players
      } else if (specialTeamsCanonical.has(canonicalPosition)) {
        specialTeams[canonicalPosition] = players
      } else {
        other[canonicalPosition] = players
      }
    })

    return { offense, defense, specialTeams, other }
  }

  const positionGroups = teamData?.players ? groupPlayersByPosition(teamData.players) : {}
  const categorizedPositions = categorizePositions(positionGroups)

  const renderPositionRow = (positionName, players) => {
    const slots = [0, 1, 2, 3].map(i => players[i] || null);
    return (
      <tr key={positionName}>
        <td className="fon">{positionName}</td>
        {slots.map((player, idx) => (
          <td key={idx} className="border px-2 py-1 whitespace-nowrap">
            {player ? (
              <Link href={`/coach/player/${player.playerId}`} className="text-cyan-700 dark:text-cyan-400 font-medium hover:underline">
                {player.name}
              </Link>
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </td>
        ))}
      </tr>
    );
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', letterSpacing: '0.5px' }}>Depth Chart</h1>
      {coach?.team && (
        <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.7rem' }}>{coach.team.name}</h2>
          <p style={{ color: '#b6c2b7', fontSize: '1.05rem', marginBottom: 0 }}>{coach.team.location}</p>
        </div>
      )}
      {/* Tab Navigation */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #333' }}>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <button
            onClick={() => setActiveTab('offense')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'offense' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'offense' ? 'var(--primary)' : '#b6c2b7',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.7rem 0',
              cursor: 'pointer',
              transition: 'color 0.2s, border-bottom 0.2s',
            }}
          >
            Offense
          </button>
          <button
            onClick={() => setActiveTab('defense')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'defense' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'defense' ? 'var(--primary)' : '#b6c2b7',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.7rem 0',
              cursor: 'pointer',
              transition: 'color 0.2s, border-bottom 0.2s',
            }}
          >
            Defense
          </button>
          <button
            onClick={() => setActiveTab('special')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'special' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'special' ? 'var(--primary)' : '#b6c2b7',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.7rem 0',
              cursor: 'pointer',
              transition: 'color 0.2s, border-bottom 0.2s',
            }}
          >
            Special Teams
          </button>
        </nav>
      </div>
      {/* Depth Chart Content */}
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        {activeTab === 'offense' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', background: '#fff', borderRadius: '8px', marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>POS</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>STARTER</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>2ND</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>3RD</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>4TH</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorizedPositions.offense).map(([position, players]) => renderPositionRow(position, players))}
              </tbody>
            </table>
            {Object.keys(categorizedPositions.offense).length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No offensive players on the roster yet.</div>
            )}
          </div>
        )}
        {activeTab === 'defense' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', background: '#fff', borderRadius: '8px', marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>POS</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>STARTER</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>2ND</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>3RD</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>4TH</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorizedPositions.defense).map(([position, players]) => renderPositionRow(position, players))}
              </tbody>
            </table>
            {Object.keys(categorizedPositions.defense).length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No defensive players on the roster yet.</div>
            )}
          </div>
        )}
        {activeTab === 'special' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', background: '#fff', borderRadius: '8px', marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>POS</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>STARTER</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>2ND</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>3RD</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>4TH</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorizedPositions.specialTeams).map(([position, players]) => renderPositionRow(position, players))}
              </tbody>
            </table>
            {Object.keys(categorizedPositions.specialTeams).length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No special teams players on the roster yet.</div>
            )}
          </div>
        )}
      </div>
      {/* Coach Notes Section */}
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <CoachNotes />
      </div>
    </main>
  )
}

export default withAuth(DepthChart, 'Coach')