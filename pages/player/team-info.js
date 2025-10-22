
import { useState, useEffect } from 'react';
import withAuth from '../../hocs/withAuth';
import { fetchMyTeam } from '../../lib/api';
import { groupPlayersByPosition, categorizePositions } from '../../lib/positions';

function TeamInfo() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('offense');

  useEffect(() => {
    async function loadTeamInfo() {
      try {
        const data = await fetchMyTeam();
        setTeam(data);
      } catch (err) {
        setError('Failed to load team info.');
      } finally {
        setLoading(false);
      }
    }
    loadTeamInfo();
  }, []);

  // Helper for rendering position rows
  function renderPositionRow(position, players) {
    return (
      <tr key={position}>
        <td style={{ fontWeight: 600, color: '#00e0ff' }}>{position}</td>
        {[0, 1, 2, 3].map(i => (
          <td key={i} style={{ color: 'var(--text)', fontWeight: 500 }}>
            {players[i] ? players[i].name : '-'}
          </td>
        ))}
      </tr>
    );
  }

  const positionGroups = team?.players ? groupPlayersByPosition(team.players) : {};
  const categorizedPositions = categorizePositions(positionGroups);

  if (loading) {
    return (
      <main className="container" style={{ maxWidth: 700, margin: '7rem auto 4rem auto', padding: '2.5rem 2rem', background: 'var(--card)', borderRadius: 16, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a' }}>
        <div style={{ color: 'var(--text)', fontSize: '1.2rem', textAlign: 'center' }}>Loading team information...</div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="container" style={{ maxWidth: 700, margin: '7rem auto 4rem auto', padding: '2.5rem 2rem', background: 'var(--card)', borderRadius: 16, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a' }}>
        <div style={{ background: '#ff4d4f22', color: '#ff4d4f', borderRadius: 8, padding: '0.7rem 1rem', marginBottom: 18, textAlign: 'center', position: 'relative' }}>{error}</div>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 700, margin: '7rem auto 4rem auto', padding: '2.5rem 2rem', background: 'var(--card)', borderRadius: 16, boxShadow: '0 4px 24px #00e0ff22, 0 1.5px 8px #000a' }}>
      <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '2.2rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent', textAlign: 'center', letterSpacing: '2px', textShadow: '0 1px 2px #222, 0 0 10px #283e5133' }}>Team Info</h1>
      {team && (
        <>
          {/* Team Header */}
          <div style={{ background: '#181f2a', borderRadius: 12, boxShadow: '0 2px 12px #00e0ff22', padding: '1.5rem 1.2rem', marginBottom: 32 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent', letterSpacing: '1px', textShadow: '0 1px 2px #222, 0 0 10px #283e5133' }}>{team.name}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginTop: 6 }}>{team.location}</p>
            {team.coach && (
              <div style={{ marginTop: 18 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Head Coach</h3>
                <div style={{ background: '#222', borderRadius: 8, padding: '1rem', color: 'var(--text)' }}>
                  <p style={{ fontWeight: 600 }}>{team.coach.name}</p>
                  {team.coach.specialty && (<p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Specialty: {team.coach.specialty}</p>)}
                  {team.coach.experienceYears > 0 && (<p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Experience: {team.coach.experienceYears} years</p>)}
                </div>
              </div>
            )}
          </div>
          {/* Team Stats */}
          {team.stats && (
            <div style={{ background: '#181f2a', borderRadius: 12, boxShadow: '0 2px 12px #00e0ff22', padding: '1.5rem 1.2rem', marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Team Stats</h2>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#222', borderRadius: 8, padding: '1rem', minWidth: 120, textAlign: 'center', flex: 1 }}>
                  <h3 style={{ color: '#00e0ff', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Roster Size</h3>
                  <p style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 700 }}>{team.stats.totalPlayers}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Total Players</p>
                </div>
                <div style={{ background: '#222', borderRadius: 8, padding: '1rem', minWidth: 120, textAlign: 'center', flex: 1 }}>
                  <h3 style={{ color: '#00e0ff', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Home Games</h3>
                  <p style={{ color: 'var(--text)', fontSize: '1.3rem', fontWeight: 700 }}>{team.stats.homeGames}</p>
                </div>
                <div style={{ background: '#222', borderRadius: 8, padding: '1rem', minWidth: 120, textAlign: 'center', flex: 1 }}>
                  <h3 style={{ color: '#00e0ff', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Away Games</h3>
                  <p style={{ color: 'var(--text)', fontSize: '1.3rem', fontWeight: 700 }}>{team.stats.awayGames}</p>
                </div>
              </div>
            </div>
          )}
          {/* Depth Chart Section */}
          <div style={{ background: '#181f2a', borderRadius: 12, boxShadow: '0 2px 12px #00e0ff22', padding: '1.5rem 1.2rem', marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Team Depth Chart</h2>
            {/* Tab Navigation */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #333' }}>
              <nav style={{ display: 'flex', gap: '2rem' }}>
                <button
                  onClick={() => setActiveTab('offense')}
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'offense' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'offense' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, fontSize: '1rem', padding: '0.7rem 0', cursor: 'pointer', transition: 'color 0.2s, border-bottom 0.2s' }}
                >Offense</button>
                <button
                  onClick={() => setActiveTab('defense')}
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'defense' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'defense' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, fontSize: '1rem', padding: '0.7rem 0', cursor: 'pointer', transition: 'color 0.2s, border-bottom 0.2s' }}
                >Defense</button>
                <button
                  onClick={() => setActiveTab('special')}
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'special' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'special' ? 'var(--primary)' : 'var(--muted)', fontWeight: 600, fontSize: '1rem', padding: '0.7rem 0', cursor: 'pointer', transition: 'color 0.2s, border-bottom 0.2s' }}
                >Special Teams</button>
              </nav>
            </div>
            {/* Depth Chart Content */}
            <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
              {activeTab === 'offense' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', background: '#181f2a', borderRadius: '8px', marginBottom: '1rem' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>POS</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>STARTER</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>2ND</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>3RD</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>4TH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(categorizedPositions.offense).map(([position, players]) => renderPositionRow(position, players))}
                    </tbody>
                  </table>
                  {Object.keys(categorizedPositions.offense).length === 0 && (<div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No offensive players on the roster yet.</div>)}
                </div>
              )}
              {activeTab === 'defense' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', background: '#181f2a', borderRadius: '8px', marginBottom: '1rem' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>POS</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>STARTER</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>2ND</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>3RD</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>4TH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(categorizedPositions.defense).map(([position, players]) => renderPositionRow(position, players))}
                    </tbody>
                  </table>
                  {Object.keys(categorizedPositions.defense).length === 0 && (<div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No defensive players on the roster yet.</div>)}
                </div>
              )}
              {activeTab === 'special' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', background: '#181f2a', borderRadius: '8px', marginBottom: '1rem' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>POS</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>STARTER</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>2ND</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>3RD</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--text)' }}>4TH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(categorizedPositions.specialTeams).map(([position, players]) => renderPositionRow(position, players))}
                    </tbody>
                  </table>
                  {Object.keys(categorizedPositions.specialTeams).length === 0 && (<div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No special teams players on the roster yet.</div>)}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default withAuth(TeamInfo);