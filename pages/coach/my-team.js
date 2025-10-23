import { useEffect, useState } from 'react'
import { getCurrentCoach, fetchTeamById } from '../../lib/api'
import withAuth from '../../hocs/withAuth'
import Link from 'next/link'

function MyTeam() {
  const [coach, setCoach] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('offense');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const coachInfo = await getCurrentCoach();
        setCoach(coachInfo);
        if (coachInfo?.team?.teamId) {
          const teamDetails = await fetchTeamById(coachInfo.team.teamId);
          setTeamData(teamDetails);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadTeamData();
    // Load coach notes from localStorage
    const stored = localStorage.getItem('coachNotes');
    if (stored) setNotes(stored);
  }, []);

  if (loading) {
    // Coach notes effect
    const stored = localStorage.getItem('coachNotes');
    if (stored) setNotes(stored);
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#b6c2d1', fontSize: '1.2rem', textAlign: 'center' }}>Loading...</div>
      </main>
    )
  }

  if (!coach?.team) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>My Team</h1>
        <div style={{ background: '#222', borderRadius: '14px', padding: '2rem 1.5rem', textAlign: 'center', color: '#b6c2b7', fontSize: '1.15rem' }}>
          You are not currently assigned to a team.
        </div>
      </main>
    )
  }

  // Depth chart logic (from depth-chart.js)
  const groupPlayersByPosition = (players) => {
    const groups = {};
    players?.forEach(player => {
      const canonicalPosition = player.position ? player.position.toUpperCase().replace(/\s+/g, '') : 'Unknown';
      if (!groups[canonicalPosition]) groups[canonicalPosition] = [];
      groups[canonicalPosition].push(player);
    });
    return groups;
  };
  const offenseCanonical = new Set(['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL']);
  const defenseCanonical = new Set(['DE', 'RDE','LDE','RDT', 'LDT', 'DT','WLB', 'MLB','SLB', 'LB' ,'CB', 'S', 'FS', 'SS', 'DL']);
  const specialTeamsCanonical = new Set(['K', 'P']);
  const categorizePositions = (positionGroups) => {
    const offense = {}, defense = {}, specialTeams = {}, other = {};
    Object.entries(positionGroups).forEach(([pos, players]) => {
      if (offenseCanonical.has(pos)) offense[pos] = players;
      else if (defenseCanonical.has(pos)) defense[pos] = players;
      else if (specialTeamsCanonical.has(pos)) specialTeams[pos] = players;
      else other[pos] = players;
    });
    return { offense, defense, specialTeams, other };
  };
  const positionGroups = teamData?.players ? groupPlayersByPosition(teamData.players) : {};
  const categorizedPositions = categorizePositions(positionGroups);
  const renderPositionRow = (positionName, players) => {
    const slots = [0, 1, 2, 3].map(i => players[i] || null);
    return (
      <tr key={positionName}>
        <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{positionName}</td>
        {slots.map((player, idx) => (
          <td key={idx} style={{ padding: '0.5rem', color: '#333' }}>
            {player ? player.name : <span style={{ color: '#888' }}>-</span>}
          </td>
        ))}
      </tr>
    );
  };
  // Coach notes logic
  const handleSave = () => {
    localStorage.setItem('coachNotes', notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  return (
  <main style={{ maxWidth: '900px', margin: '9rem auto 0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', letterSpacing: '0.5px' }}>My Team</h1>
      {/* Team Overview */}
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.2rem' }}>{coach.team.name}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', minWidth: '180px', flex: '1 1 180px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#b6c2b7', marginBottom: '0.5rem' }}>Location</h3>
            <p style={{ color: '#eaeaea', fontSize: '1rem', margin: 0 }}>{coach.team.location || 'Not specified'}</p>
          </div>
          <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', minWidth: '180px', flex: '1 1 180px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#b6c2b7', marginBottom: '0.5rem' }}>Season</h3>
            <p style={{ color: '#eaeaea', fontSize: '1rem', margin: 0 }}>{coach.team.season || 'Current'}</p>
          </div>
          <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.2rem', minWidth: '180px', flex: '1 1 180px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#b6c2b7', marginBottom: '0.5rem' }}>Total Players</h3>
            <p style={{ color: '#eaeaea', fontSize: '1rem', margin: 0 }}>{teamData?.players?.length || 0}</p>
          </div>
        </div>
      </div>
      {/* Depth Chart Section */}
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.2rem' }}>Depth Chart</h2>
        {/* Tab Navigation */}
        <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid #333' }}>
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
        {/* Depth Chart Table */}
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
              {activeTab === 'offense' && Object.entries(categorizedPositions.offense).map(([position, players]) => renderPositionRow(position, players))}
              {activeTab === 'defense' && Object.entries(categorizedPositions.defense).map(([position, players]) => renderPositionRow(position, players))}
              {activeTab === 'special' && Object.entries(categorizedPositions.specialTeams).map(([position, players]) => renderPositionRow(position, players))}
            </tbody>
          </table>
          {activeTab === 'offense' && Object.keys(categorizedPositions.offense).length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No offensive players on the roster yet.</div>
          )}
          {activeTab === 'defense' && Object.keys(categorizedPositions.defense).length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No defensive players on the roster yet.</div>
          )}
          {activeTab === 'special' && Object.keys(categorizedPositions.specialTeams).length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No special teams players on the roster yet.</div>
          )}
        </div>
      </div>
      {/* Coach Notes Section */}
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>Coach Notes</h2>
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
      {/* Empty State */}
      {(!teamData?.players || teamData.players.length === 0) && (
        <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.7rem' }}>No Players Yet</h2>
          <p style={{ color: '#b6c2b7', fontSize: '1rem', marginBottom: '1.2rem' }}>Your team roster is empty. Players will appear here once they're added to your team.</p>
          <a href="/coach/depth-chart" style={{
            display: 'inline-block',
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: '8px',
            padding: '0.7rem 1.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--accent)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--primary)'}>
            Manage Roster
          </a>
        </div>
      )}
    </main>
  )
}

export default withAuth(MyTeam, 'Coach')