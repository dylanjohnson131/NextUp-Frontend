import { withAuth } from '../../hocs/withAuth'

function MyTeam() {
  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Team</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Roster */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Team Roster</h2>
            <p className="text-slate-400">Team roster and player management coming soon...</p>
          </div>
          
          {/* Team Strengths & Weaknesses */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Team Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-green-400 font-medium mb-2">Strengths</h3>
                <p className="text-slate-400 text-sm">Team strengths analysis coming soon...</p>
              </div>
              <div>
                <h3 className="text-red-400 font-medium mb-2">Areas to Improve</h3>
                <p className="text-slate-400 text-sm">Weakness analysis coming soon...</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Performers */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Performers</h2>
          <p className="text-slate-400">Top player statistics coming soon...</p>
        </div>
      </main>
  )
}

export default withAuth(MyTeam, 'Coach')