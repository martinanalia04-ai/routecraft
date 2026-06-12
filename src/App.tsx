import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import TripDetails from './pages/TripDetails';
import PromoFlash from './pages/PromoFlash';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-slate-900 text-white flex gap-6">
        <Link to="/">✈️ Buscador</Link>
        <Link to="/trips">🌍 Mis Itinerarios</Link>
        <Link to="/trips/new">➕ Planificar Ruta</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/promocion-flash" element={<PromoFlash />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/new" element={<TripForm />} />
        <Route path="/trips/:id" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}