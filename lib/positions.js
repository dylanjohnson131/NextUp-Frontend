export const positionNormalizationMap = {
  'Quarterback': 'QB',
  'QB': 'QB',
  'Running Back': 'RB',
  'RB': 'RB',
  'Wide Receiver': 'WR',
  'WR': 'WR',
  'Tight End': 'TE',
  'TE': 'TE',
  'Left Tackle': 'LT',
  'LT': 'LT',
  'Left Guard': 'LG',
  'LG': 'LG',
  'Center': 'C',
  'C': 'C',
  'Right Guard': 'RG',
  'RG': 'RG',
  'Right Tackle': 'RT',
  'RT': 'RT',
  'Defensive End': 'DE',
  'DE': 'DE',
  'EDGE': 'DE',
  'Left Defensive Tackle': 'LDT',
  'LDT': 'LDT',
  'Right Defensive Tackle': 'RDT',
  'RDT': 'RDT',
  'Will Linebacker': 'WLB',
  'WLB': 'WLB',
  'Mike Linebacker': 'MLB',
  'MLB': 'MLB',
  'Sam Linebacker': 'SLM',
  'SLB': 'SLB',
  'Cornerback': 'CB',
  'CB': 'CB',
  'Safety': 'S',
  'S': 'S',
  'Punter': 'P',
  'P' : 'P',
  'Kicker' : 'K',
  'K' : 'K',
};

export const positionStatsMap = {
  QB: ['completions', 'passingAttempts', 'completionPercentage', 'yardsPerPassAttempt', 'touchdowns', 'interceptions', 'longestPass', 'sacked', 'rushingYards', 'penalties'],
  RB: ['rushingAttempts', 'rushingYards', 'yardsPerRushAttempt','rushingTDs', 'receptions','longestRushing','receivingYards', 'fumbles', 'penalties'],
  WR: ['receptions', 'targets','yardsPerReception','receivingYards', 'receivingTDs', 'longestReception','fumbles', 'penalties'],
  TE: ['receptions', 'receivingYards', 'receivingTDs', 'targets','yardsPerReception','longestReception', 'fumbles', 'penalties'],
  LT: ['sacksAllowed', 'pancakeBlocks', 'snapsPlayed', 'penalties'],
  RT: ['sacksAllowed', 'pancakeBlocks', 'snapsPlayed', 'penalties'],
  C: ['cleanSnaps', 'totalSnaps', 'snapAccuracy', 'pancakeBlocks', 'sacksAllowed', 'snapsPlayed', 'penalties'],
  LG: ['pancakeBlocks', 'sacksAllowed', 'snapsPlayed', 'penalties'],
  RG: ['pancakeBlocks', 'sacksAllowed', 'snapsPlayed', 'penalties'],
  DE: ['sacks', 'tacklesForLoss', 'pressures', 'totalTackles', 'forcedFumbles', 'penalties'],
  LDT: ['sacks', 'tacklesForLoss', 'pressures', 'totalTackles', 'forcedFumbles', 'penalties'],
  RDT: ['sacks', 'tacklesForLoss', 'pressures', 'totalTackles', 'forcedFumbles', 'penalties'],
  WLB: ['tackles', 'tacklesForLoss', 'sacks', 'interceptions', 'penalties'],
  MLB: ['tackles', 'tacklesForLoss', 'sacks', 'interceptions', 'penalties'],
  SLB: ['tackles', 'tacklesForLoss', 'sacks', 'interceptions', 'penalties'],
  CB: ['tackles', 'interceptions', 'passBreakups', 'forcedFumbles', 'interceptionReturnYards', 'interceptionReturnTouchDown', 'penalties'],
  S: ['tackles', 'interceptions', 'passBreakups', 'forcedFumbles', 'interceptionReturnYards', 'interceptionReturnTouchDown', 'penalties'],
  P: ['yardsPerPunt', 'touchbacks'],
  K: ['fieldGoalMade', 'fieldGoalAttempts', 'longestFieldGoal', 'blockedKicks']
};

export function normalizePosition(position) {
  return positionNormalizationMap[position] || position;
}

export function getStatsForPosition(position) {
  const canonical = normalizePosition(position);
  return positionStatsMap[canonical] || [];
}

export function toPascalCase(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function groupPlayersByPosition(players) {
  const groups = {};
  players?.forEach(player => {
    const canonicalPosition = normalizePosition(player.position || 'Unknown');
    if (!groups[canonicalPosition]) {
      groups[canonicalPosition] = [];
    }
    groups[canonicalPosition].push(player);
  });
  return groups;
}

const offenseCanonical = new Set(['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL']);
const defenseCanonical = new Set(['DE', 'RDE','LDE','RDT', 'LDT', 'DT','WLB', 'MLB','SLB', 'LB' ,'CB', 'S', 'FS', 'SS', 'DL']);
const specialTeamsCanonical = new Set(['K', 'P']);

export function categorizePositions(positionGroups) {
  const offense = {};
  const defense = {};
  const specialTeams = {};
  const other = {};

  Object.entries(positionGroups).forEach(([canonicalPosition, players]) => {
    if (offenseCanonical.has(canonicalPosition)) {
      offense[canonicalPosition] = players;
    } else if (defenseCanonical.has(canonicalPosition)) {
      defense[canonicalPosition] = players;
    } else if (specialTeamsCanonical.has(canonicalPosition)) {
      specialTeams[canonicalPosition] = players;
    } else {
      other[canonicalPosition] = players;
    }
  });

  return { offense, defense, specialTeams, other };
}
