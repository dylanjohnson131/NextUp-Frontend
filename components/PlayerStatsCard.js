import React from 'react';
import { normalizePosition, getStatsForPosition } from '../lib/positions';

const formatStatLabel = (key) => {
  const map = {
    passingYards: 'YDS',
    passingTDs: 'TD',
    touchdowns: 'TD',
    interceptions: 'INT',
    qbr: 'QBR',
    completionPercentage: 'CMP%',
    completions: 'CMP',
    passingAttempts: 'ATT',
    rushingYards: 'RUSH YDS',
    rushingTDs: 'RUSH TD',
    receivingYards: 'REC YDS',
    receivingTDs: 'REC TD',
    tackles: 'TACK',
    sacks: 'SACKS',
  };
  return map[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
};

const PlayerStatsCard = ({ player }) => {
  const canonicalPosition = normalizePosition(player.position);
  const statKeys = getStatsForPosition(canonicalPosition);
  const summaryStats = statKeys.slice(0, 4);


  function toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
  const normalizedStats = {};
  if (player.stats) {
    Object.entries(player.stats).forEach(([key, value]) => {
      normalizedStats[toCamelCase(key)] = value;
    });
  }

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 14,
      boxShadow: '0 2px 16px #00e0ff22, 0 1.5px 8px #000a',
      padding: '2rem',
      maxWidth: 600,
      margin: '0 auto',
      marginTop: '1.5rem',
      color: 'var(--text)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1.5px solid #1e293b',
        paddingBottom: '1.2rem',
        marginBottom: '1.2rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            margin: 0,
            background: 'var(--text-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            letterSpacing: '1px',
            textShadow: '0 1px 2px #222, 0 0 10px #283e5133'
          }}>{player.name}</h2>
          <div style={{ color: 'var(--muted)', fontSize: '1rem', marginTop: 6 }}>
            {player.team?.name && <span>{player.team.name} • </span>}
            #{player.jerseyNumber} • {canonicalPosition}
          </div>
        </div>
        <div style={{ textAlign: 'right', marginLeft: 24 }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>HT/WT</div>
          <div style={{ fontWeight: 600 }}>{player.height || '--'} / {player.weight ? `${player.weight} lbs` : '--'}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 4 }}>AGE</div>
          <div style={{ fontWeight: 600 }}>{player.age || '--'}</div>
        </div>
      </div>
      {/* Stat Summary Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: 'linear-gradient(90deg, #111827 60%, #00e0ff22 100%)',
        borderRadius: 10,
        padding: '1.2rem 1rem',
        marginBottom: '1.2rem',
        boxShadow: '0 2px 8px #00e0ff22'
      }}>
        {summaryStats.map((stat) => (
          <div key={stat} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00e0ff', textShadow: '0 1px 8px #00e0ff33' }}>
              {normalizedStats[stat] !== undefined ? normalizedStats[stat] : '--'}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: 4 }}>{formatStatLabel(stat)}</div>
          </div>
        ))}
      </div>
      {/* Full Stat List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1.1rem'
      }}>
        {statKeys.map((stat) => (
          <div key={stat} style={{
            background: 'linear-gradient(180deg, #1e293b 80%, #00e0ff11 100%)',
            borderRadius: 8,
            padding: '1rem',
            textAlign: 'center',
            boxShadow: '0 1px 6px #00e0ff22'
          }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>
              {normalizedStats[stat] !== undefined ? normalizedStats[stat] : '--'}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 4 }}>{formatStatLabel(stat)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStatsCard;
