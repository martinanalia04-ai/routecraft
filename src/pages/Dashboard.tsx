import { useState } from 'react';
import { useTrips } from '../context/TripContext';

export default function Dashboard() {
  const { addTrip } = useTrips();
  
  // Estados para capturar los datos del formulario
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Objeto que cumple estrictamente con la interfaz Trip
    const newTrip = {
      id: Date.now().toString(),
      title,
      destination,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      budget: 0,
      status: 'Planificado' as const,
    };

    addTrip(newTrip); 
    
    // Limpiamos los estados para vaciar el formulario
    setTitle('');
    setDestination('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Añadir Nuevo Destino ✨
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Nombre del Viaje
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Destino
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Guardar Viaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}