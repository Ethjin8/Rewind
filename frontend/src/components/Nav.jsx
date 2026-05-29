import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const pages = [
  { label: 'Home',         path: '/home' },
  { label: 'Explore',      path: '/search' },
  { label: 'Watch History',path: '/history' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken');

    await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  }

  return (
    <nav className="nav-bar flex flex-wrap py-2">
      {pages.map(({ label, path }) => (
        <Link
          key={path}
          to={path}
          className={`nav-link ${
            pathname === path
              ? 'active'
              : ''
          }`}
        >
          {label}
        </Link>
      ))}

      <div className="account-dropdown">
        <button
        className="account-avatar-btn"
        onClick={() => setAccountOpen(!accountOpen)}
        aria-label="Open account menu"
      >
        <img
          src="/profile-blank.png"
          alt=""
          className="account-avatar"
        />
      </button>

        {accountOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className={`dropdown-item ${pathname === '/profile' ? 'dropdown-active' : ''}`} onClick={() => setAccountOpen(false)}>Profile</Link>
            <button className="dropdown-item logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}
