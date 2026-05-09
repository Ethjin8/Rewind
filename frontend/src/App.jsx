import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';

import Home        from './pages/Home';
import Search      from './pages/Search';
import Backlog     from './pages/Backlog';
import WatchHistory from './pages/WatchHistory';
import Account     from './pages/Account';
import Login       from './pages/Login';
import Register    from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/search"     element={<Search />} />
        <Route path="/backlog"    element={<Backlog />} />
        <Route path="/history"    element={<WatchHistory />} />
        <Route path="/account"    element={<Account />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
