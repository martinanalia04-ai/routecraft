// src/components/TripList.tsx
import { useState } from 'react';
import { mockTrips } from '../data/mockTrips';

export default function TripList() {
  const [trips, setTrips] = useState(mockTrips);
  
  // 1. Estados para capturar absolutamente todos los campos
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<'planned' | 'ongoing' | 'completed'>('planned');

  const handleDelete = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación: Nos aseguramos de que no haya campos vacíos
    if (!title.trim() || !destination.trim() || !startDate || !endDate || !budget) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    const newTrip = {
      id: Date.now().toString(),
      title: title,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      status: status,
      budget: Number(budget) // Convertimos el string del input a número puro
    };

    setTrips([newTrip, ...trips]);

    // Limpiamos todos los estados del formulario
    setTitle('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setStatus('planned');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tus Próximos Viajes</h2>
      
      {/* FORMULARIO COMPLETO */}
      <form onSubmit={handleAddTrip} className="bg-slate-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Añadir Nuevo Destino</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre del Viaje</label>
            <input 
              type="text" 
              placeholder="Ej: Ruta por la Costa Oeste" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Destino */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Destino</label>
            <input 
              type="text" 
              placeholder="Ej: Galway, Irlanda" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Presupuesto */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Presupuesto (€ / $)</label>
            <input 
              type="number" 
              placeholder="Ej: 1500" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Fecha Inicio */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Inicio</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Fin</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Estado del viaje */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Estado del Viaje</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="planned">Planificado</option>
              <option value="ongoing">En Curso</option>
              <option value="completed">Completado</option>
            </select>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
          >
            Guardar Viaje
          </button>
        </div>
      </form>

      {/* LISTA DE VIAJES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-blue-600">{trip.title}</h3>
              <p className="text-gray-600 mt-2">📍 {trip.destination}</p>
              <p className="text-sm text-gray-500 mt-1">📅 {trip.startDate} - {trip.endDate}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-lg">${trip.budget}</span>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase">
                  {trip.status}
                </span>
                <button 
                  onClick={() => handleDelete(trip.id)}
                  className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}