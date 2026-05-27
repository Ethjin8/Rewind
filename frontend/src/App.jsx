import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import './App.css';

import Landing     from './pages/Landing';
import Home        from './pages/Home';
import Search      from './pages/Search';
import WatchHistory from './pages/WatchHistory';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Profile     from './pages/Profile';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

function AppContent() {
  const { pathname } = useLocation();

  return (
    <>
      {pathname !== '/' && <Nav />}
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/home"       element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search"     element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/history"    element={<ProtectedRoute><WatchHistory /></ProtectedRoute>} />
        <Route path="/movie/:id"  element={<ProtectedRoute><MovieDetailsPage /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
