// src/types/trip.ts
export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'Planificado' | 'En Curso' | 'Completado';
  description?: string;
}