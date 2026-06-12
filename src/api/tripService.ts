// src/api/tripService.ts

import { supabase } from './supabase';
import { type Trip } from '../types/trip';

export const fetchTrips = async (): Promise<Trip[]> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*');

  if (error) throw error;

  // Transformamos los campos en minúscula de la base de datos (startdate/enddate)
  // al formato camelCase (startDate/endDate) que espera tu interfaz de TypeScript.
  return (data?.map((trip: any) => ({
    id: trip.id,
    title: trip.title,
    destination: trip.destination,
    startDate: trip.startdate, // <- Mapeo correcto
    endDate: trip.enddate,     // <- Mapeo correcto
    budget: trip.budget,
    status: trip.status,
    description: trip.description ?? undefined,
  })) as Trip[]) || [];
};

export const createTrip = async (
  trip: Omit<Trip, 'id'>
): Promise<Trip> => {
  const { data, error } = await supabase
    .from('trips')
    .insert([
      {
        title: trip.title,
        destination: trip.destination,
        startdate: trip.startDate, // Enviamos camelCase a la columna en minúscula de la BD
        enddate: trip.endDate,     // Enviamos camelCase a la columna en minúscula de la BD
        budget: trip.budget,
        status: trip.status,
        description: trip.description ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Transformamos el único registro retornado por Supabase de vuelta a la interfaz Trip
  return {
    id: data.id,
    title: data.title,
    destination: data.destination,
    startDate: data.startdate, // <- Mapeo correcto para la respuesta
    endDate: data.enddate,     // <- Mapeo correcto para la respuesta
    budget: data.budget,
    status: data.status,
    description: data.description ?? undefined,
  } as Trip;
};