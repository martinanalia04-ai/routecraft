import { useTrips } from '../context/TripContext'; // Importamos el hook

export const TripList = () => {
  
  const { trips, deleteTrip } = useTrips();

  return (
    <div className="grid gap-4 p-4">
      {trips.length === 0 ? (
        <p>No hay viajes registrados aún.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip.id} className="p-4 border rounded shadow bg-white">
            <h3 className="font-bold">{trip.destination}</h3>
            <p className="text-sm text-gray-500">Presupuesto: {trip.budget}€</p>
            <span className="text-xs font-medium text-blue-600">{trip.status}</span>
            <button 
              onClick={() => deleteTrip(trip.id)}
              className="block mt-2 text-red-500 underline"
            >
              Borrar
            </button>
          </div>
        ))
      )}
    </div>
  );
};