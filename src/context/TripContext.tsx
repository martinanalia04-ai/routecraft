import { createContext, useContext, useState, useEffect,type  ReactNode } from 'react';
import { type Trip } from '../types/trip';
import { fetchTrips } from '../api/tripService';

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    fetchTrips().then((data) => setTrips(data)).catch(console.error);
  }, []);

  const addTrip = (trip: Trip) => setTrips((prev) => [...prev, trip]);
  const deleteTrip = (id: string) => setTrips((prev) => prev.filter((t) => t.id !== id));

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrips debe usarse dentro de un TripProvider");
  return context;
};