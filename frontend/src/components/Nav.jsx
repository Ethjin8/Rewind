import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const pages = [
  { label: 'Home',         path: '/home' },
  { label: 'Explore',      path: '/search' },
  { label: 'Watch History',path: '/history' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);

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
          className="nav-link account-btn"
          onClick={() => setAccountOpen(!accountOpen)}
        >
          Account
        </button>

        {accountOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className={`dropdown-item ${pathname === '/profile' ? 'dropdown-active' : ''}`} onClick={() => setAccountOpen(false)}>Profile</Link>
            <button className="dropdown-item logout-btn" onClick={() => setAccountOpen(false)}>Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}
