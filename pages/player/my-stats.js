import withAuth from '../../hocs/withAuth'

function MyStats() {
  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Stats</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Position-Based Stats */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Position Statistics</h2>
            <p className="text-slate-400">Comprehensive position-based stat tracking coming soon...</p>
          </div>
          
          {/* Performance Trend */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Trend</h2>
            <p className="text-slate-400">Line chart showing game-by-game performance coming soon...</p>
          </div>
        </div>
        
        {/* Position Goals */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Position Goals</h2>
          <p className="text-slate-400">Position-based goals and targets coming soon...</p>
        </div>
        
        {/* Position Insights */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Position Insights</h2>
          <p className="text-slate-400">AI-powered analysis of your strongest positions based on stats coming soon...</p>
        </div>
      </main>
  )
}

export default withAuth(MyStats, 'Player')