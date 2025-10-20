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

// Map canonical positions to the stats tracked for each
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

// Normalize a position string to its canonical key
export function normalizePosition(position) {
  return positionNormalizationMap[position] || position;
}

// Get stats for a given position (handles normalization)
export function getStatsForPosition(position) {
  const canonical = normalizePosition(position);
  return positionStatsMap[canonical] || [];
}
