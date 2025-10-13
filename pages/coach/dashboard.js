import { useEffect, useState } from 'react'
import RoleNavBar from '../../components/RoleNavBar'
import { getCurrentUser, fetchTeams } from '../../lib/api'

export default function CoachDashboard() {
  const [user, setUser] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userInfo, teamsData] = await Promise.all([
          getCurrentUser(),
          fetchTeams()
        ])
        setUser(userInfo)
        setTeams(teamsData || [])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div>
        <RoleNavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <RoleNavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Coach Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's an overview of your teams and recent activity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Teams Section */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">My Teams</h2>
            <div className="space-y-4">
              {teams.filter(team => team.Coach?.Name === user?.Name).map(team => (
                <div key={team.TeamId} className="bg-slate-700 rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{team.Name}</h3>
                      <p className="text-slate-400 text-sm">{team.Location}</p>
                      <p className="text-slate-400 text-sm">{team.PlayerCount} Players</p>
                    </div>
                    <div className="text-right">
                      <button className="bg-cyan-400 text-slate-900 px-3 py-1 rounded text-sm">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full bg-slate-700 border-2 border-dashed border-slate-600 rounded p-4 text-slate-400 hover:border-slate-500 transition-colors">
                + Create New Team
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-cyan-400 text-slate-900 px-4 py-3 rounded font-medium hover:bg-cyan-300 transition-colors">
                Record Game Stats
              </button>
              <button className="w-full bg-slate-700 text-white px-4 py-3 rounded font-medium hover:bg-slate-600 transition-colors">
                View Team Performance
              </button>
              <button className="w-full bg-slate-700 text-white px-4 py-3 rounded font-medium hover:bg-slate-600 transition-colors">
                Browse Opponents
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Games */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Games</h2>
          <div className="space-y-3">
            <div className="bg-slate-700 rounded p-4 flex justify-between items-center">
              <div>
                <p className="text-white font-medium">vs. Storm Riders</p>
                <p className="text-slate-400 text-sm">Oct 12, 2025 - 3:00 PM</p>
              </div>
              <button className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-500">
                Scout Team
              </button>
            </div>
            
            <div className="bg-slate-700 rounded p-4 flex justify-between items-center">
              <div>
                <p className="text-white font-medium">vs. Eagles FC</p>
                <p className="text-slate-400 text-sm">Oct 19, 2025 - 2:30 PM</p>
              </div>
              <button className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-500">
                Scout Team
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}