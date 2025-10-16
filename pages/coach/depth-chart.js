import { useEffect, useState } from 'react'
import { getCurrentCoach, fetchTeamById } from '../../lib/api'
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
        console.error('Failed to load team data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTeamData()
  }, [])

  // Group players by position
  const groupPlayersByPosition = (players) => {
    const groups = {}
    players?.forEach(player => {
      const position = player.position || 'Unknown'
      if (!groups[position]) {
        groups[position] = []
      }
      groups[position].push(player)
    })
    return groups
  }

  // Define position categories
  const offensePositions = ['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line']
  const defensePositions = ['DE', 'DT', 'LB', 'CB', 'S', 'FS', 'SS', 'Linebacker', 'Safety', 'Defensive End', 'Cornerback']
  const specialTeamsPositions = ['K', 'P', 'LS', 'Kicker', 'Punter']

  const categorizePositions = (positionGroups) => {
    const offense = {}
    const defense = {}
    const specialTeams = {}
    const other = {}

    Object.entries(positionGroups).forEach(([position, players]) => {
      if (offensePositions.some(pos => position.toLowerCase().includes(pos.toLowerCase()))) {
        offense[position] = players
      } else if (defensePositions.some(pos => position.toLowerCase().includes(pos.toLowerCase()))) {
        defense[position] = players
      } else if (specialTeamsPositions.some(pos => position.toLowerCase().includes(pos.toLowerCase()))) {
        specialTeams[position] = players
      } else {
        other[position] = players
      }
    })

    return { offense, defense, specialTeams, other }
  }

  const positionGroups = teamData?.players ? groupPlayersByPosition(teamData.players) : {}
  const categorizedPositions = categorizePositions(positionGroups)

  const renderPositionGroup = (positionName, players) => (
    <div key={positionName} className="bg-slate-700 rounded-lg p-4">
      <h3 className="font-semibold text-white mb-3 text-center border-b border-slate-600 pb-2">
        {positionName}
      </h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={player.playerId} className="bg-slate-600 rounded p-3 hover:bg-slate-500 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">
                  #{player.jerseyNumber} 
                  <Link href={`/coach/player/${player.playerId}`} className="text-cyan-400 hover:text-cyan-300 transition-colors ml-1">
                    {player.name}
                  </Link>
                </div>
                <div className="text-xs text-slate-300">
                  {index === 0 && <span className="bg-green-600 px-1 rounded text-xs mr-1">1st</span>}
                  {index === 1 && <span className="bg-yellow-600 px-1 rounded text-xs mr-1">2nd</span>}
                  {index === 2 && <span className="bg-orange-600 px-1 rounded text-xs mr-1">3rd</span>}
                  Age: {player.age}
                  {player.height && ` • ${player.height}`}
                  {player.weight && ` • ${player.weight}lbs`}
                </div>
              </div>
            </div>
          </div>
        ))}
        {players.length === 0 && (
          <div className="text-center py-4 text-slate-400 text-sm">
            No players assigned
          </div>
        )}
      </div>
    </div>
  )

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(categorizedPositions.offense).map(([position, players]) =>
              renderPositionGroup(position, players)
            )}
            {Object.keys(categorizedPositions.offense).length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">No offensive players on the roster yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'defense' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(categorizedPositions.defense).map(([position, players]) =>
              renderPositionGroup(position, players)
            )}
            {Object.keys(categorizedPositions.defense).length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">No defensive players on the roster yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'special' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(categorizedPositions.specialTeams).map(([position, players]) =>
              renderPositionGroup(position, players)
            )}
            {Object.keys(categorizedPositions.specialTeams).length === 0 && (
              <div className="col-span-full text-center py-12">
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