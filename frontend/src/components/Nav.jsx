import { Link, useLocation } from 'react-router-dom';

const pages = [
  { label: 'Home',         path: '/' },
  { label: 'Explore',      path: '/search' },
  { label: 'Watch History',path: '/history' },
  { label: 'Account',      path: '/account' },
];

export default function Nav() {
  const { pathname } = useLocation();

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
    </nav>
  );
}
