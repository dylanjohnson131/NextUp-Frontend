
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAthleticDirectorDashboard } from '../../lib/api';
import withAuth from '../../hocs/withAuth';

function AthleticDirectorDashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    totalTeams: 0,
    totalGames: 0,
    completedGames: 0,
    upcomingGames: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await fetchAthleticDirectorDashboard()
      setDashboardData(data)
      setError('')
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="ad-dashboard-bg">
        <div className="ad-dashboard-container">
          <div className="ad-dashboard-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-dashboard-bg">
      <div className="ad-dashboard-container">
        {/* Header */}
        <div className="ad-dashboard-header">
          <h1 className="ad-dashboard-title">Athletic Director Dashboard</h1>
          <p className="ad-dashboard-welcome">Welcome back, {user?.name}! Manage your football season from here.</p>
        </div>
        {/* Error Display */}
        {error && (
          <div className="ad-dashboard-error">
            <p>{error}</p>
          </div>
        )}
        {/* Stats Cards */}
        <div className="ad-dashboard-stats-wrapper">
          <div className="ad-dashboard-stats-grid">
            <div className="ad-dashboard-card">
              <div className="ad-dashboard-card-content">
                <div>
                  <p className="ad-dashboard-card-label">Total Teams</p>
                  <p className="ad-dashboard-card-value">{dashboardData.totalTeams}</p>
                </div>
                <div className="ad-dashboard-card-icon ad-dashboard-card-icon-blue">
                  {/* SVG icon here */}
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="ad-dashboard-card">
              <div className="ad-dashboard-card-content">
                <div>
                  <p className="ad-dashboard-card-label">Total Games</p>
                  <p className="ad-dashboard-card-value">{dashboardData.totalGames}</p>
                </div>
                <div className="ad-dashboard-card-icon ad-dashboard-card-icon-green">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="ad-dashboard-card">
              <div className="ad-dashboard-card-content">
                <div>
                  <p className="ad-dashboard-card-label">Completed Games</p>
                  <p className="ad-dashboard-card-value">{dashboardData.completedGames}</p>
                </div>
                <div className="ad-dashboard-card-icon ad-dashboard-card-icon-purple">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="ad-dashboard-card">
              <div className="ad-dashboard-card-content">
                <div>
                  <p className="ad-dashboard-card-label">Upcoming Games</p>
                  <p className="ad-dashboard-card-value">{dashboardData.upcomingGames}</p>
                </div>
                <div className="ad-dashboard-card-icon ad-dashboard-card-icon-orange">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard Content */}
      </div>
    </div>
  );
}

export default withAuth(AthleticDirectorDashboard, ['AthleticDirector']);