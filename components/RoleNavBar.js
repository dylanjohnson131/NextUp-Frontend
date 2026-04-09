import Link from 'next/link'
import { useRouter } from 'next/router'
import { logout as apiLogout } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const NAV_LINKS = {
  Player: [
    { href: '/player/dashboard', label: 'Dashboard' },
    { href: '/player/my-stats', label: 'My Stats' },
    { href: '/player/my-goals', label: 'My Goals' },
    { href: '/player/team-info', label: 'My Team' },
    { href: '/player/matchup', label: 'Matchup' },
  ],
  Coach: [
    { href: '/coach/dashboard', label: 'Dashboard' },
    { href: '/coach/schedule', label: 'Schedule' },
    { href: '/coach/game-stats', label: 'Game Stats' },
    { href: '/coach/my-team', label: 'My Team' },
  ],
  AthleticDirector: [
    { href: '/athletic-director/dashboard', label: 'Dashboard' },
    { href: '/athletic-director/teams', label: 'Teams' },
    { href: '/athletic-director/games', label: 'Games' },
    { href: '/athletic-director/schedule', label: 'Schedule' },
  ],
}

function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function RoleNavBar() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    try {
      logout()
      await apiLogout()
    } catch {
      window.location.href = '/'
    }
  }

  if (loading || !user || !user.role) return null

  const links = NAV_LINKS[user.role] || []

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-row">
          <img
            src="/nextup-logo.png"
            alt="NextUp"
            style={{ height: '3rem', width: 'auto', display: 'block' }}
          />
          <div className="navbar-links">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`navbar-link${router.pathname === href || router.pathname.startsWith(href + '/') ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div
            className="navbar-user"
            tabIndex={0}
            onBlur={() => setShowDropdown(false)}
            style={{ position: 'relative', marginLeft: '1.5rem' }}
          >
            <div
              onClick={() => setShowDropdown(v => !v)}
              style={{
                cursor: 'pointer',
                background: 'rgba(0, 224, 255, 0.15)',
                border: '1.5px solid rgba(0, 224, 255, 0.3)',
                color: '#00e0ff',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
                transition: 'background 0.2s',
              }}
              title={user.name}
            >
              {getInitials(user.name)}
            </div>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 48,
                background: '#0d2d4a',
                border: '1px solid rgba(0, 224, 255, 0.15)',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                padding: '0.5rem',
                zIndex: 2000,
                minWidth: 140,
              }}>
                <div style={{ padding: '0.5rem 0.75rem', color: '#94a3b8', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.25rem' }}>
                  {user.name}
                </div>
                <button
                  onMouseDown={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: 6,
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
