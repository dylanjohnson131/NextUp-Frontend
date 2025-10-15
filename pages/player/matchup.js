import RoleNavBar from '../../components/RoleNavBar'
import { withAuth } from '../../hocs/withAuth'

function Matchup() {
  return (
    <div>
      <RoleNavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Next Matchup</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Game</h2>
          <div className="bg-slate-700 rounded p-4">
            <div className="text-center">
              <p className="text-white font-medium text-lg">vs. Storm Riders</p>
              <p className="text-slate-400">Oct 12, 2025 - 3:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Opponent Strengths */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Opponent Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-green-400 font-medium mb-2">Their Strengths</h3>
                <p className="text-slate-400 text-sm">Opponent strengths scouting coming soon...</p>
              </div>
              <div>
                <h3 className="text-red-400 font-medium mb-2">Their Weaknesses</h3>
                <p className="text-slate-400 text-sm">Opponent weaknesses analysis coming soon...</p>
              </div>
            </div>
          </div>
          
          {/* Opponent Top Performers */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Their Top Performers</h2>
            <p className="text-slate-400">Opponent key players and statistics coming soon...</p>
          </div>
        </div>
        
        {/* Game Overview */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Game Overview</h2>
          <p className="text-slate-400">
            Comprehensive matchup analysis and scouting report features coming soon...
          </p>
        </div>
      </main>
    </div>
  )
}

export default withAuth(Matchup, 'Player')