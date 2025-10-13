import RoleNavBar from '../../components/RoleNavBar'

export default function Schedule() {
  return (
    <div>
      <RoleNavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Schedule</h1>
        
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Matchups</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700 rounded p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">vs. Storm Riders</p>
                  <p className="text-slate-400 text-sm">Oct 12, 2025 - 3:00 PM</p>
                </div>
                <button className="bg-cyan-400 text-slate-900 px-3 py-1 rounded text-sm">
                  View Team Stats
                </button>
              </div>
            </div>
            
            <div className="bg-slate-700 rounded p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">vs. Eagles FC</p>
                  <p className="text-slate-400 text-sm">Oct 19, 2025 - 2:30 PM</p>
                </div>
                <button className="bg-cyan-400 text-slate-900 px-3 py-1 rounded text-sm">
                  View Team Stats
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-700 rounded">
            <p className="text-slate-400 text-center">
              Read-only schedule view with opponent analysis features coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}