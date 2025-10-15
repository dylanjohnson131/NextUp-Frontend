import { withAuth } from '../../hocs/withAuth'

function GameStats() {
  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Game Stats</h1>
        
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Live Game Statistics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-700 rounded p-4">
              <h3 className="text-white font-medium mb-3">Current Game</h3>
              <p className="text-slate-400 mb-4">No active game</p>
              <button className="bg-cyan-400 text-slate-900 px-4 py-2 rounded font-medium">
                Start New Game
              </button>
            </div>
            
            <div className="bg-slate-700 rounded p-4">
              <h3 className="text-white font-medium mb-3">Quick Stats Entry</h3>
              <p className="text-slate-400">Real-time player statistics tracking interface coming soon...</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-700 rounded">
            <p className="text-slate-400 text-center">
              Live game statistics tracking features will allow you to update player stats in real-time during games.
            </p>
          </div>
        </div>
      </main>
  )
}

export default withAuth(GameStats, 'Coach')