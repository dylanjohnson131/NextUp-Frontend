import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { normalizePosition } from '../../../lib/positions';
import { fetchTeamById } from '../../../lib/api';
import withAuth from '../../../hocs/withAuth';

function OpponentDepthChart({ roster }) {
  const positionDisplayMap = {
    QB: 'Quarterback', RB: 'Running Back', WR: 'Wide Receiver', TE: 'Tight End',
    LT: 'Left Tackle', LG: 'Left Guard', C: 'Center', RG: 'Right Guard', RT: 'Right Tackle',
    DE: 'Defensive End', LDT: 'Left Defensive Tackle', RDT: 'Right Defensive Tackle',
    WLB: 'Will Linebacker', MLB: 'Mike Linebacker', SLB: 'Sam Linebacker', CB: 'Cornerback',
    S: 'Safety', P: 'Punter', K: 'Kicker', OL: 'Offensive Lineman', DL: 'Defensive Lineman',
    FS: 'Free Safety', SS: 'Strong Safety', EDGE: 'Edge Rusher', LB: 'Linebacker',
  };
  const offenseCanonical = new Set(['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL']);
  const defenseCanonical = new Set(['DE', 'RDE','LDE','RDT', 'LDT', 'DT','WLB', 'MLB','SLB', 'LB' ,'CB', 'S', 'FS', 'SS', 'DL']);
  const specialTeamsCanonical = new Set(['K', 'P']);
  const groupPlayersByPosition = (players) => {
    const groups = {};
    players.forEach(player => {
      const canonicalPosition = normalizePosition(player.position || 'Unknown');
      if (!groups[canonicalPosition]) groups[canonicalPosition] = [];
      groups[canonicalPosition].push(player);
    });
    return groups;
  };
  const positionGroups = groupPlayersByPosition(roster);
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
  const categorizedPositions = categorizePositions(positionGroups);
  const renderPositionRow = (positionName, players) => {
    const slots = [0, 1, 2, 3].map(i => players[i] || null);
    return (
      <tr key={positionName}>
        <td>{positionDisplayMap[positionName] || positionName}</td>
        {slots.map((player, idx) => (
          <td key={idx} style={{ padding: '0.5rem', color: '#333' }}>
            {player ? player.name : <span style={{ color: '#888' }}>-</span>}
          </td>
        ))}
      </tr>
    );
  };
  return (
    <div style={{ margin: '2rem 0', background: '#222', borderRadius: '10px', padding: '1.5rem' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Opponent Depth Chart</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', background: '#fff', borderRadius: '8px' }}>
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
            {Object.entries(categorizedPositions.defense).map(([position, players]) => renderPositionRow(position, players))}
            {Object.entries(categorizedPositions.specialTeams).map(([position, players]) => renderPositionRow(position, players))}
            {Object.entries(categorizedPositions.other).map(([position, players]) => renderPositionRow(position, players))}
          </tbody>
        </table>
        {Object.keys(positionGroups).length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No depth chart data available.</div>
        )}
      </div>
    </div>
  );
}
function OpponentNotes({ teamId }) {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem(`scoutNotes_${teamId}`);
    if (stored) setNotes(stored);
  }, [teamId]);
  const handleSave = () => {
    localStorage.setItem(`scoutNotes_${teamId}`, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  return (
    <div style={{ margin: '2rem 0', background: '#222', borderRadius: '10px', padding: '1.5rem' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Scouting Notes</h2>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={6}
        style={{ width: '93%', padding: '1rem', borderRadius: '8px', fontSize: '1rem', background: '#222', color: '#fff', border: '1px solid #444', resize: 'vertical' }}
        placeholder="Enter your scouting notes here..."
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

function OpponentOverview() {
  const router = useRouter();
  const { teamId } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchTeamById(teamId)
        .then(data => {
          setTeamData({
            team: {
              name: data.Name || data.name,
              location: data.Location || data.location,
              wins: data.Wins || data.wins || 0,
              losses: data.Losses || data.losses || 0,
              ties: data.Ties || data.ties || 0
            },
            Roster: (data.Players || data.players || []).map(p => ({
              playerId: p.PlayerId || p.playerId,
              name: p.Name || p.name,
              position: p.Position || p.position,
              age: p.Age || p.age,
              jerseyNumber: p.JerseyNumber || p.jerseyNumber
            }))
          });
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load team data');
          setLoading(false);
        });
    }
  }, [teamId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main>
      <div>
        {/* Team Name and Record */}
        <div style={{
          margin: '3.2rem 0 0.5rem 0',
          paddingLeft: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <h1 style={{
            fontSize: '2.3rem',
            margin: 0,
            color: 'var(--primary)',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}>{teamData?.team?.name || 'Team'}</h1>
          <span style={{
            fontSize: '1.15rem',
            color: '#b6c2b7', 
            marginTop: '0.3rem',
            fontWeight: 500,
            letterSpacing: '0.2px',
          }}>
            Record: {teamData?.team?.wins ?? 0}-{teamData?.team?.losses ?? 0}{teamData?.team?.ties ? `-${teamData.team.ties}` : ''}
          </span>
        </div>
        <OpponentDepthChart roster={teamData?.Roster || []} />
        <OpponentNotes teamId={teamId} />
      </div>
    </main>
  );
}

export default withAuth(OpponentOverview, 'Coach');
