import Link from 'next/link'
import { logout as apiLogout } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

import { useState } from 'react'

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function RoleNavBar() {
  const { user, loading, isAuthenticated, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    try {
      logout()
      await apiLogout()
    } catch (err) {
      window.location.href = '/'
    }
  }

  const handleAvatarClick = () => setShowDropdown(v => !v)
  const closeDropdown = () => setShowDropdown(false)

  if (loading || !user || !user.role) {
    return null;
  }

  if (user.role === 'Player') {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-row">
            <img src="/nextup-logo.png" alt="NextUp Logo" className="navbar-logo" style={{ height: '7rem', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }} />
            <div className="navbar-links">
              <Link href="/player/dashboard" className="navbar-link">Dashboard</Link>
              <Link href="/player/my-stats" className="navbar-link">My Stats</Link>
              <Link href="/player/my-goals" className="navbar-link">My Goals</Link>
              <Link href="/player/team-info" className="navbar-link">My Team</Link>
              <Link href="/player/matchup" className="navbar-link">Matchup</Link>
            </div>
            <div className="navbar-user" tabIndex={0} onBlur={closeDropdown} style={{ position: 'relative', marginLeft: '2rem' }}>
              <div className="navbar-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer', background: '#1976d2', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} title={user.name}>
                {getInitials(user.name)}
              </div>
              {showDropdown && (
                <div style={{ position: 'absolute', right: 0, top: 56, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '0.5rem 1rem', zIndex: 2000, minWidth: 120 }}>
                  <button className="button" style={{ width: '100%' }} onMouseDown={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (user.role === 'Coach') {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-row">
            <img src="/nextup-logo.png" alt="NextUp Logo" className="navbar-logo" style={{ height: '7rem', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }} />
            <div className="navbar-links">
              <Link href="/coach/dashboard" className="navbar-link">Dashboard</Link>
              <Link href="/coach/schedule" className="navbar-link">Schedule</Link>
              <Link href="/coach/game-stats" className="navbar-link">Game Stats</Link>
              <Link href="/coach/my-team" className="navbar-link">My Team</Link>
            </div>
            <div className="navbar-user" tabIndex={0} onBlur={closeDropdown} style={{ position: 'relative', marginLeft: '2rem' }}>
              <div className="navbar-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer', background: '#1976d2', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} title={user.name}>
                {getInitials(user.name)}
              </div>
              {showDropdown && (
                <div style={{ position: 'absolute', right: 0, top: 56, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '0.5rem 1rem', zIndex: 2000, minWidth: 120 }}>
                  <button className="button" style={{ width: '100%' }} onMouseDown={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (user.role === 'AthleticDirector') {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-row">
            <img src="/nextup-logo.png" alt="NextUp Logo" className="navbar-logo" style={{ height: '7rem', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }} />
            <div className="navbar-links">
              <Link href="/athletic-director/dashboard" className="navbar-link">Dashboard</Link>
              <Link href="/athletic-director/teams" className="navbar-link">Teams</Link>
              <Link href="/athletic-director/games" className="navbar-link">Games</Link>
              <Link href="/athletic-director/schedule" className="navbar-link">Schedule</Link>
            </div>
            <div className="navbar-user" tabIndex={0} onBlur={closeDropdown} style={{ position: 'relative', marginLeft: '2rem' }}>
              <div className="navbar-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer', background: '#1976d2', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} title={user.name}>
                {getInitials(user.name)}
              </div>
              {showDropdown && (
                <div style={{ position: 'absolute', right: 0, top: 56, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '0.5rem 1rem', zIndex: 2000, minWidth: 120 }}>
                  <button className="button" style={{ width: '100%' }} onMouseDown={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-row">
          <img src="/nextup-logo.png" alt="NextUp Logo" className="navbar-logo" style={{ height: '7rem', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }} />
          <div className="navbar-user" tabIndex={0} onBlur={closeDropdown} style={{ position: 'relative', marginLeft: '2rem' }}>
            <div className="navbar-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer', background: '#1976d2', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} title={user.name}>
              {getInitials(user.name)}
            </div>
            {showDropdown && (
              <div style={{ position: 'absolute', right: 0, top: 56, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '0.5rem 1rem', zIndex: 2000, minWidth: 120 }}>
                <button className="button" style={{ width: '100%' }} onMouseDown={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}