import React from 'react';
import { normalizePosition, getStatsForPosition } from '../lib/positions';

// Helper to format stat labels (e.g., 'passingYards' => 'PASS YDS')
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
    // Add more as needed
  };
  return map[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
};

const PlayerStatsCard = ({ player }) => {
  const canonicalPosition = normalizePosition(player.position);
  const statKeys = getStatsForPosition(canonicalPosition);
  // Pick 3-5 key stats for summary bar (customize per position as needed)
  const summaryStats = statKeys.slice(0, 4);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
          <div className="text-gray-600 text-sm mt-1">
            {player.team?.name && <span>{player.team.name} • </span>}
            #{player.jerseyNumber} • {canonicalPosition}
          </div>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-xs text-gray-500">HT/WT</div>
          <div className="font-semibold text-gray-800">{player.height || '--'} / {player.weight ? `${player.weight} lbs` : '--'}</div>
          <div className="text-xs text-gray-500 mt-1">AGE</div>
          <div className="font-semibold text-gray-800">{player.age || '--'}</div>
        </div>
      </div>
      {/* Stat Summary Bar */}
      <div className="flex justify-between bg-slate-100 rounded p-4 mb-4">
        {summaryStats.map((stat) => (
          <div key={stat} className="flex-1 text-center">
            <div className="text-xl font-bold text-cyan-700">
              {player.stats && player.stats[stat] !== undefined ? player.stats[stat] : '--'}
            </div>
            <div className="text-xs text-gray-500 mt-1">{formatStatLabel(stat)}</div>
          </div>
        ))}
      </div>
      {/* Full Stat List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statKeys.map((stat) => (
          <div key={stat} className="bg-slate-50 rounded p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">
              {player.stats && player.stats[stat] !== undefined ? player.stats[stat] : '--'}
            </div>
            <div className="text-xs text-gray-500 mt-1">{formatStatLabel(stat)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStatsCard;
