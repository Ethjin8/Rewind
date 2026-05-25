import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import './App.css';

import Landing     from './pages/Landing';
import Home        from './pages/Home';
import Search      from './pages/Search';
import WatchHistory from './pages/WatchHistory';
import MovieDetailsPage from './pages/MovieDetailsPage';

function AppContent() {
  const { pathname } = useLocation();

  return (
    <>
      {pathname !== '/' && <Nav />}
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/home"       element={<Home />} />
        <Route path="/search"     element={<Search />} />
        <Route path="/history"    element={<WatchHistory />} />
        <Route path="/movie/:id"  element={<MovieDetailsPage />} />
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
