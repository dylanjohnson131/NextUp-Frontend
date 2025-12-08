const positionAliases = {
  QB: ['Quarterback', 'QB'],
  RB: ['Running Back', 'RB'],
  WR: ['Wide Receiver', 'WR'],
  TE: ['Tight End', 'TE'],
  LT: ['Left Tackle', 'LT'],
  LG: ['Left Guard', 'LG'],
  C: ['Center', 'C'],
  RG: ['Right Guard', 'RG'], 
  RT: ['Right Tackle', 'RT'],
  DE: ['Defensive End', 'DE'],
  LDT: ['Left Defensive Tackle', 'LDT'],
  RDT: ['Right Defensive Tackle', 'RDT'],
  WLB: ['Weakside Linebacker','Weak Side Linebacker','Will Linebacker', 'WLB'],
  MLB: ['Middle Linebacker', 'Mike Linebacker' ,'MLB'],
  SLB: ['Strongside Linebacker', 'Strong Side Linebacker' ,'Sam Linebacker', 'SLB'],
  CB: ['Cornerback', 'Defensive Back', 'CB', 'DB'],
  S: ['Safety', 'S'],
  P: ['Punter', 'P'],
  K: ['Kicker', 'K']
};

export const positionNormalizationMap = Object.fromEntries(
  Object.entries(positionAliases).flatMap(([canonical, aliases]) =>
    aliases.map(alias => [alias, canonical]) 
  )
);

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

  Object.entries(positionGroups).forEach(([canonicalPosition, players]) => {
    if (offenseCanonical.has(canonicalPosition)) {
      offense[canonicalPosition] = players;
    } else if (defenseCanonical.has(canonicalPosition)) {
      defense[canonicalPosition] = players;
    } else if (specialTeamsCanonical.has(canonicalPosition)) {
      specialTeams[canonicalPosition] = players;
    } 
  });

  return { offense, defense, specialTeams};
}
