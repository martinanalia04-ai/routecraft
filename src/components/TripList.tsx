import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTrips } from '../api/tripService'; 
import { type Trip } from '../types/trip';

export default function TripList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTripsFromServer = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err.message || 'No se pudo establecer comunicación con el servidor de viajes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTripsFromServer();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full text-center py-16 font-bold text-slate-500 animate-pulse">
        ⏳ Cargando catálogo de rutas y aventuras disponibles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-2xl text-center shadow-sm max-w-xl mx-auto my-10">
        <p className="font-bold mb-2">⚠️ Error de Sincronización</p>
        <p className="text-xs opacity-90 mb-4">{error}</p>
        <button
          type="button"
          onClick={loadTripsFromServer}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2 rounded-lg border-none cursor-pointer shadow-sm transition-colors"
        >
          🔄 Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="flex items-center gap-3 mb-8 border-b pb-4 mt-4">
        <span className="text-2xl">🌍</span>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
          Próximas Aventuras Disponibles
        </h2>
      </div>
      
      {trips.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <p className="text-sm font-semibold mb-1">No hay viajes programados en este momento.</p>
          <p className="text-xs opacity-75">Usa el panel superior para registrar nuevas rutas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div 
              key={trip.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-5 text-left flex-1">
                <span className="text-[10px] uppercase font-black text-[#511365] bg-purple-50 px-2.5 py-1 rounded-md">
                  📍 {trip.destination || 'Destino Global'}
                </span>
                <span className="ml-2 text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {trip.status}
                </span>
                <h3 className="font-black text-slate-800 text-base mt-3 mb-1 line-clamp-1">
                  {trip.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {trip.description || 'Sin descripción detallada cargada en el servidor.'}
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Presupuesto</span>
                  <span className="text-lg font-black text-[#511365]">{trip.budget}€</span>
                </div>
                
                {/* 🌟 AQUÍ ESTÁ EL ARREGLO DEL BOTÓN DE NAVEGACIÓN 🌟 */}
                <Link 
                  to={`/trips/${trip.id}`}
                  className="bg-[#511365] hover:bg-[#3d0e4c] text-white font-bold text-xs py-2 px-4 rounded-xl no-underline transition-colors shadow-sm"
                >
                  Ver detalles ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}