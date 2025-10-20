import { useEffect, useState } from 'react'
import { getCurrentCoach, fetchTeamById } from '../../lib/api'
import { normalizePosition, getStatsForPosition } from '../../lib/positions'
import withAuth from '../../hocs/withAuth'
import Link from 'next/link'

function DepthChart() {
  const [coach, setCoach] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('offense')

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const coachInfo = await getCurrentCoach()
        setCoach(coachInfo)
        
        // Fetch detailed team data if coach has a team
        if (coachInfo?.team?.teamId) {
          const teamDetails = await fetchTeamById(coachInfo.team.teamId)
          setTeamData(teamDetails)
        }
      } catch (error) {
        } finally {
        setLoading(false)
      }
    }
    
    loadTeamData()
  }, [])

  // Group players by normalized position
  const groupPlayersByPosition = (players) => {
    const groups = {}
    players?.forEach(player => {
      const canonicalPosition = normalizePosition(player.position || 'Unknown')
      if (!groups[canonicalPosition]) {
        groups[canonicalPosition] = []
      }
      groups[canonicalPosition].push(player)
    })
    return groups
  }

  // Canonical position sets for categorization
  const offenseCanonical = new Set(['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL'])
  const defenseCanonical = new Set(['DE', 'RDE','LDE','RDT', 'LDT', 'DT','WLB', 'MLB','SLB', 'LB' ,'CB', 'S', 'FS', 'SS', 'DL'])
  const specialTeamsCanonical = new Set(['K', 'P'])

  const categorizePositions = (positionGroups) => {
    const offense = {}
    const defense = {}
    const specialTeams = {}
    const other = {}

    Object.entries(positionGroups).forEach(([canonicalPosition, players]) => {
      if (offenseCanonical.has(canonicalPosition)) {
        offense[canonicalPosition] = players
      } else if (defenseCanonical.has(canonicalPosition)) {
        defense[canonicalPosition] = players
      } else if (specialTeamsCanonical.has(canonicalPosition)) {
        specialTeams[canonicalPosition] = players
      } else {
        other[canonicalPosition] = players
      }
    })

    return { offense, defense, specialTeams, other }
  }

  const positionGroups = teamData?.players ? groupPlayersByPosition(teamData.players) : {}
  const categorizedPositions = categorizePositions(positionGroups)

  // Render a table row for a position and up to 4 players (starter, 2nd, 3rd, 4th)
  const renderPositionRow = (positionName, players) => {
    // Fill up to 4 slots with players or dashes
    const slots = [0, 1, 2, 3].map(i => players[i] || null);
    return (
      <tr key={positionName}>
        <td className="font-semibold text-slate-700 dark:text-white border px-2 py-1 whitespace-nowrap">{positionName}</td>
        {slots.map((player, idx) => (
          <td key={idx} className="border px-2 py-1 whitespace-nowrap">
            {player ? (
              <Link href={`/coach/player/${player.playerId}`} className="text-cyan-700 dark:text-cyan-400 font-medium hover:underline">
                {player.name}
              </Link>
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </td>
        ))}
      </tr>
    );
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Depth Chart</h1>
      
      {coach?.team && (
        <div className="mb-6">
          <h2 className="text-xl text-slate-300">{coach.team.name}</h2>
          <p className="text-slate-400">{coach.team.location}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('offense')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'offense'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              Offense
            </button>
            <button
              onClick={() => setActiveTab('defense')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'defense'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              Defense
            </button>
            <button
              onClick={() => setActiveTab('special')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'special'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              Special Teams
            </button>
          </nav>
        </div>
      </div>

      {/* Depth Chart Content */}
      <div className="min-h-96">
        {activeTab === 'offense' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-slate-800 rounded shadow">
              <thead>
                <tr>
                  <th className="border px-2 py-2 text-left">POS</th>
                  <th className="border px-2 py-2 text-left">STARTER</th>
                  <th className="border px-2 py-2 text-left">2ND</th>
                  <th className="border px-2 py-2 text-left">3RD</th>
                  <th className="border px-2 py-2 text-left">4TH</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorizedPositions.offense).map(([position, players]) =>
                  renderPositionRow(position, players)
                )}
              </tbody>
            </table>
            {Object.keys(categorizedPositions.offense).length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No offensive players on the roster yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'defense' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-slate-800 rounded shadow">
              <thead>
                <tr>
                  <th className="border px-2 py-2 text-left">POS</th>
                  <th className="border px-2 py-2 text-left">STARTER</th>
                  <th className="border px-2 py-2 text-left">2ND</th>
                  <th className="border px-2 py-2 text-left">3RD</th>
                  <th className="border px-2 py-2 text-left">4TH</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorizedPositions.defense).map(([position, players]) =>
                  renderPositionRow(position, players)
                )}
              </tbody>
            </table>
            {Object.keys(categorizedPositions.defense).length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No defensive players on the roster yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'special' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-slate-800 rounded shadow">
              <thead>
                <tr>
                  <th className="border px-2 py-2 text-left">POS</th>
                  <th className="border px-2 py-2 text-left">STARTER</th>
                  <th className="border px-2 py-2 text-left">2ND</th>
                  <th className="border px-2 py-2 text-left">3RD</th>
                  <th className="border px-2 py-2 text-left">4TH</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorizedPositions.specialTeams).map(([position, players]) =>
                  renderPositionRow(position, players)
                )}
              </tbody>
            </table>
            {Object.keys(categorizedPositions.specialTeams).length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No special teams players on the roster yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Team Summary */}
      <div className="mt-8 bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Team Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {teamData?.stats?.totalPlayers || teamData?.players?.length || 0}
            </div>
            <div className="text-sm text-slate-400">Total Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Object.keys(categorizedPositions.offense).length}
            </div>
            <div className="text-sm text-slate-400">Offense Positions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {Object.keys(categorizedPositions.defense).length}
            </div>
            <div className="text-sm text-slate-400">Defense Positions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Object.keys(categorizedPositions.specialTeams).length}
            </div>
            <div className="text-sm text-slate-400">Special Teams</div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default withAuth(DepthChart, 'Coach')