import { useState, useEffect } from 'react';
import { fetchAthleticDirectorGames } from '../../lib/api';
import withAuth from '../../hocs/withAuth';

function groupGamesByWeek(games) {
  const weeks = {};
  games.forEach(game => {
    const week = game.week || 'Unscheduled';
    if (!weeks[week]) weeks[week] = [];
    weeks[week].push(game);
  });
  return weeks;
}

function SchedulePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAthleticDirectorGames()
      .then(data => {
        setGames(data || []);
        setError('');
      })
      .catch(() => setError('Failed to load games'))
      .finally(() => setLoading(false));
  }, []);

  const weeks = groupGamesByWeek(games);
  const sortedWeeks = Object.keys(weeks).sort((a, b) => {
    if (a === 'Unscheduled') return 1;
    if (b === 'Unscheduled') return -1;
    return parseInt(a) - parseInt(b);
  });

  return (
    <div className="ad-dashboard-bg">
      <div className="ad-dashboard-container">
  <h1 className="ad-dashboard-title">Season Schedule</h1>
  {/* Removed redundant text below header */}
        {loading ? (
          <div className="ad-dashboard-loading-spinner" />
        ) : error ? (
          <div className="ad-dashboard-error">{error}</div>
        ) : (
          <div>
            {sortedWeeks.map(week => (
              <div key={week} style={{ marginBottom: 32 }}>
                <h2 style={{ color: '#38bdf8', fontSize: '1.3rem', marginBottom: 12 }}>Week {week}</h2>
                <div style={{ background: 'rgba(30,41,59,0.85)', borderRadius: 10, padding: 16 }}>
                  {weeks[week].length === 0 ? (
                    <div style={{ color: '#b8c6db' }}>No games scheduled.</div>
                  ) : (
                    weeks[week].map(game => (
                      <div key={game.gameId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, color: '#fff', borderBottom: '1px solid #334155', paddingBottom: 8 }}>
                        <span>
                          {game.awayTeam?.name || 'Away Team'} @ {game.homeTeam?.name || 'Home Team'}
                        </span>
                        <span style={{ color: '#b8c6db', fontSize: '0.95rem' }}>{new Date(game.gameDate).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(SchedulePage, ['AthleticDirector']);
