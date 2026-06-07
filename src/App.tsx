import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; 
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/viaje/:id" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;