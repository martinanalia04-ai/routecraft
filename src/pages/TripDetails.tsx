import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Trip } from '../types/trip';

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTripDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/trips`);
        if (!response.ok) throw new Error('Error al conectar con el servidor.');
        
        const allTrips: Trip[] = await response.json();
        const foundTrip = allTrips.find((t) => t.id === id);
        
        if (!foundTrip) throw new Error('Viaje no encontrado.');
        setTrip(foundTrip);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadTripDetails();
  }, [id]);

  if (isLoading) return <div className="p-10 text-center">Cargando detalles...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!trip) return <div className="p-10 text-center">Viaje no encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-3xl font-black text-[#511365] mb-2">{trip.title}</h1>
      <p className="text-slate-500 mb-6">📍 Destino: {trip.destination}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl">
          <span className="block text-[10px] uppercase font-bold text-slate-400">Presupuesto</span>
          <p className="text-xl font-black">{trip.budget}€</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl">
          <span className="block text-[10px] uppercase font-bold text-slate-400">Estado</span>
          <p className="text-xl font-black">{trip.status}</p>
        </div>
      </div>

      <div className="mb-8">
        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Descripción</span>
        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
          {trip.description || 'Sin descripción disponible.'}
        </p>
      </div>

      <Link to="/trips" className="bg-[#511365] text-white px-6 py-3 rounded-xl font-bold text-xs no-underline">
        ← Volver a la lista
      </Link>
    </div>
  );
}