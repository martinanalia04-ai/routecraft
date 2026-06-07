import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { type Trip } from '../types/trip';

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

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