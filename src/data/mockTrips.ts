// src/data/mockTrips.ts

// 1. Definimos el tipo y la interfaz aquí mismo para que Vite no tenga que buscar fuera
export type TripStatus = 'planned' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  budget: number;
  description?: string;
}

// 2. Creamos los datos usando la interfaz de arriba
export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Aventura en los Alpes',
    destination: 'Chamonix, Francia',
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    status: 'planned',
    budget: 1200,
    description: 'Semana de esquí y relax.'
  }
];