import { Link, useLocation } from 'react-router-dom';

const pages = [
  { label: 'Home',         path: '/' },
  { label: 'Search',       path: '/search' },
  { label: 'Backlog',      path: '/backlog' },
  { label: 'Watch History',path: '/history' },
  { label: 'Account',      path: '/account' },
  { label: 'Login',        path: '/login' },
  { label: 'Register',     path: '/register' },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-wrap gap-2 px-4 py-2 border-b border-gray-200 bg-white">
      {pages.map(({ label, path }) => (
        <Link
          key={path}
          to={path}
          className={`px-3 py-1 rounded text-sm ${
            pathname === path
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
