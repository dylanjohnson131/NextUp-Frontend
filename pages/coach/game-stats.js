import { useEffect, useState } from 'react';
import withAuth from '../../hocs/withAuth';
import { getCurrentCoach, fetchUpcomingGames, fetchTeamById, updatePlayerStats } from '../../lib/api';
import { getStatsForPosition } from '../../lib/positions';

function GameStats() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [stats, setStats] = useState({}); 
  const [existingStats, setExistingStats] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  useEffect(() => {
    const loadCoachAndGames = async () => {
      try {
        const coachInfo = await getCurrentCoach();
        setCoach(coachInfo);
        if (coachInfo?.team?.teamId) {
          const gamesList = await fetchUpcomingGames(coachInfo.team.teamId);
          setGames(gamesList || []);
          const teamDetails = await fetchTeamById(coachInfo.team.teamId);
          setTeamPlayers(teamDetails?.players || []);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    loadCoachAndGames();
  }, []);

  const handleStatChange = (statName, value) => {
    setStats(prev => ({
      ...prev,
      [statName]: value
    }));
  };

  useEffect(() => {
    function toCamelCase(str) {
      return str.charAt(0).toLowerCase() + str.slice(1);
    }
    const fetchStats = async () => {
      if (selectedGame && selectedPlayer) {
        try {
          const { fetchPlayerGameStats } = await import('../../lib/api');
          const gameStats = await fetchPlayerGameStats(selectedGame.gameId, selectedPlayer.playerId);
          const normalizedExistingStats = {};
          if (gameStats) {
            Object.entries(gameStats).forEach(([key, value]) => {
              normalizedExistingStats[toCamelCase(key)] = value;
            });
            setExistingStats(normalizedExistingStats);
            const statFields = getStatsForPosition(selectedPlayer.position);
            const normalizedStats = {};
            statFields.forEach(field => {
              normalizedStats[field] = normalizedExistingStats[field] ?? '';
            });
            setStats(normalizedStats);
          } else {
            setExistingStats(null);
            setStats({});
          }
        } catch {
          setExistingStats(null);
          setStats({});
        }
      } else {
        setExistingStats(null);
        setStats({});
      }
    };
    fetchStats();
  }, [selectedGame, selectedPlayer]);

  const handleSaveStats = async () => {
    if (!selectedGame || !selectedPlayer) return;
    setSaving(true);
    setSaveError("");
    const statFields = getStatsForPosition(selectedPlayer.position);
    const { toPascalCase } = await import('../../lib/positions');
    const payload = {};
    statFields.forEach(field => {
      payload[toPascalCase(field)] = stats[field] === undefined || stats[field] === "" ? 0 : Number(stats[field]);
    });
    try {
      await updatePlayerStats(selectedGame.gameId, selectedPlayer.playerId, payload);
      setSaveError("");
      setSaving(false);
      setSelectedPlayer(null);
      setSelectedGame(null);
      setStats({});
      setExistingStats(null);
      setSaveSuccessMessage("Stats successfully saved.");
    } catch (err) {
      setSaveError("Stats failed to save.");
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: '900px', margin: '9rem auto 0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.2rem', letterSpacing: '0.5px' }}>Game Stats</h1>
      {saveSuccessMessage && (
        <div style={{ color: 'limegreen', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.2rem' }}>{saveSuccessMessage}</div>
      )}
      <div style={{ background: '#222', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.2rem' }}>Update Player Stats</h2>
        {loading ? (
          <div style={{ color: '#b6c2b7', fontSize: '1.1rem' }}>Loading...</div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="game-select" style={{ color: '#b6c2b7', fontWeight: 600, marginRight: '1rem' }}>Select Game:</label>
              <select
                id="game-select"
                value={selectedGame?.gameId ? String(selectedGame.gameId) : ''}
                onChange={e => {
                  const game = games.find(g => String(g.gameId) === e.target.value);
                  setSelectedGame(game || null);
                }}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #444', background: '#282c34', color: '#fff', fontWeight: 600 }}
              >
                <option value="">-- Select --</option>
                {games.map(game => (
                  <option key={game.gameId} value={String(game.gameId)}>
                    {typeof game.opponentName === 'string' ? game.opponentName : (game.opponent?.name || 'Opponent')}
                    {game.opponent?.location ? ` (${game.opponent.location})` : ''} - {game.gameDate ? new Date(game.gameDate).toLocaleDateString() : 'Date'}
                  </option>
                ))}
              </select>
            </div>
            {selectedGame && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="player-select" style={{ color: '#b6c2b7', fontWeight: 600, marginRight: '1rem' }}>Select Player:</label>
                <select
                  id="player-select"
                  value={selectedPlayer?.playerId || ''}
                  onChange={e => {
                    const player = teamPlayers.find(p => String(p.playerId) === e.target.value);
                    setSelectedPlayer(player || null);
                    setStats({});
                  }}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #444', background: '#282c34', color: '#fff', fontWeight: 600 }}
                >
                  <option value="">-- Select Player --</option>
                  {teamPlayers.map(player => (
                    <option key={player.playerId} value={player.playerId}>{player.name} ({player.position})</option>
                  ))}
                </select>
              </div>
            )}
            {selectedGame && selectedPlayer && (
              <div style={{ background: '#282c34', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#b6c2b7', marginBottom: '1rem' }}>Update Stats for {selectedPlayer.name} ({selectedPlayer.position})</h3>
                {existingStats && (
                  <div style={{ marginBottom: '1rem', color: '#b6c2b7', fontSize: '1rem', background: '#222', borderRadius: '8px', padding: '1rem' }}>
                    <strong>Current Stats:</strong>
                    <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                      {getStatsForPosition(selectedPlayer.position).map(statName => {
                        // Normalize statName to camelCase
                        const camelStatName = statName.charAt(0).toLowerCase() + statName.slice(1);
                        let value = existingStats[camelStatName];
                        if (typeof value !== 'number') value = 0;
                        return (
                          <li key={camelStatName}>
                            {camelStatName.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}: {value}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <form
                  onSubmit={e => { e.preventDefault(); handleSaveStats(); }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}
                >
                  {existingStats && typeof existingStats === 'object' ? (
                    getStatsForPosition(selectedPlayer.position)
                      .filter(statName => statName !== 'completionPercentage')
                      .map(statName => (
                        <div key={statName} style={{ marginBottom: '1rem', minWidth: '200px' }}>
                          <label style={{ color: '#b6c2b7', fontWeight: 600, marginRight: '0.5rem' }}>{statName.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</label>
                          <input
                            type="number"
                            value={stats[statName] || ''}
                            onChange={e => handleStatChange(statName, e.target.value)}
                            style={{ width: '90px', padding: '0.4rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }}
                          />
                        </div>
                      ))
                  ) : (
                    <div style={{ color: '#b6c2b7', fontStyle: 'italic', marginBottom: '1rem' }}>
                      No stats recorded for this player in this game yet.
                    </div>
                  )}
                  {/* Optionally show calculated completion percentage as read-only */}
                  {existingStats && typeof existingStats === 'object' && typeof existingStats.completionPercentage !== 'undefined' && (
                    <div style={{ marginBottom: '1rem', color: '#b6c2b7' }}>
                      <strong>Completion Percentage:</strong> {existingStats.completionPercentage || 0}%
                    </div>
                  )}
                  <div style={{ width: '100%' }}>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{ marginTop: '1.5rem', padding: '0.7rem 1.5rem', background: 'var(--primary)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {saving ? 'Saving...' : 'Save Stats'}
                    </button>
                    {saveError && (
                      <div style={{ color: 'red', marginTop: '0.7rem', fontWeight: 600 }}>{saveError}</div>
                    )}
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default withAuth(GameStats, 'Coach');