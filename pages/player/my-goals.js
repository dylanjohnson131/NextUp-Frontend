import { withAuth } from '../../hocs/withAuth'

function MyGoals() {
  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Goals</h1>
        
        <div className="mb-6">
          <button className="bg-cyan-400 text-slate-900 px-4 py-2 rounded font-medium">
            + Create New Goal
          </button>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Goals</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700 rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">Sample Goal</h3>
                  <p className="text-slate-400 text-sm mt-1">Improve shooting accuracy by 15%</p>
                  <div className="mt-2">
                    <div className="bg-slate-600 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">60% Progress</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                  <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-700 rounded">
            <p className="text-slate-400 text-center">
              Full CRUD functionality for personal goals coming soon...
            </p>
          </div>
        </div>
      </main>
  )
}

export default withAuth(MyGoals, 'Player')