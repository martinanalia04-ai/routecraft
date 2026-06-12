// Interfaz para que TypeScript sepa cómo es un viaje en el backend
interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'Planificado' | 'En progreso' | 'Completado';
}

// Nuestra "base de datos" temporal en memoria
let trips: Trip[] = [];

export const getAllTrips = (): Trip[] => {
  return trips;
};

export const createTrip = (newTrip: Trip): Trip => {
  trips.push(newTrip);
  return newTrip;
};