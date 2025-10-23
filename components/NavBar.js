
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout as apiLogout } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const navLinks = {
  Coach: [
    { href: '/coach/dashboard', label: 'Dashboard' },
    { href: '/coach/my-team', label: 'My Team' },
    { href: '/coach/schedule', label: 'Schedule' },
    { href: '/coach/game-stats', label: 'Game Stats' },
  ],
  Player: [
    { href: '/player/dashboard', label: 'Dashboard' },
    { href: '/player/my-stats', label: 'My Stats' },
    { href: '/player/my-goals', label: 'My Goals' },
    { href: '/player/team-info', label: 'Team Info' },
    { href: '/player/matchup', label: 'Matchup' },
  ],
  AthleticDirector: [
    { href: '/athletic-director/dashboard', label: 'Dashboard' },
    { href: '/athletic-director/teams', label: 'Teams' },
    { href: '/athletic-director/games', label: 'Games' },
    { href: '/athletic-director/schedule', label: 'Schedule' },
  ],
};

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await apiLogout();
      logout();
    } catch (err) {
      logout();
    }
  };

  const handleAvatarClick = () => setShowDropdown(v => !v);
  const closeDropdown = () => setShowDropdown(false);

  // Highlight active link
  const isActive = (href) => router.pathname === href;

  // Loading state
  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <span className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <img src="/nextup-logo.png" alt="NextUp Logo" style={{ height: '5rem', width: 'auto', display: 'inline-block', verticalAlign: 'middle', marginRight: 16 }} />
            NextUp
          </span>
          <div style={{ color: 'var(--muted)' }}>Loading...</div>
        </div>
      </nav>
    );
  }

  // Not authenticated
  const isAuthed = user && (user.IsAuthenticated || user.isAuthenticated);
  if (!isAuthed) {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <span className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <img src="/nextup-logo.png" alt="NextUp Logo" style={{ height: '5rem', width: 'auto', display: 'inline-block', verticalAlign: 'middle', marginRight: 16 }} />
            NextUp
          </span>
          <div className="navbar-links">
            <Link href="/login" className="button">Login</Link>
            <Link href="/register" className="button">Sign Up</Link>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated
  const role = user.Role || user.role;
  const links = navLinks[role] || [];
  const initials = getInitials(user.Name || user.name);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <span className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <img src="/nextup-logo.png" alt="NextUp Logo" style={{ height: '5rem', width: 'auto', display: 'inline-block', verticalAlign: 'middle', marginRight: 16 }} />
          NextUp
        </span>
        <div className="navbar-links">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link${isActive(link.href) ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="navbar-user" tabIndex={0} onBlur={closeDropdown}>
          <div className="navbar-avatar" onClick={handleAvatarClick} title={user.Name || user.name}>
            {initials}
          </div>
          {showDropdown && (
            <div style={{ position: 'absolute', right: '2rem', top: '60px', background: 'var(--card)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '0.5rem 1rem', zIndex: 2000 }}>
              <div style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>{user.Name || user.name}</div>
              <button className="navbar-logout" onMouseDown={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
