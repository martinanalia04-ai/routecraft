// src/api/client.ts
import { supabase } from './supabase';

export interface trips {
  id?: number; // Lo hacemos opcional por si Supabase lo genera
  title: string;
  detail: string;
  price: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  locator: string;
  status: string;
  type: string;
}

export const apiClient = {
  // GET: Obtener todas las reservas
  async gettrips(): Promise<trips[]> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('id', { ascending: false }); // Las más nuevas primero

    if (error) {
      console.error("Error de Supabase:", error);
      throw new Error('Error al obtener reservas');
    }
    return data || [];
  },

  // POST: Crear una reserva
  async createReservation(trips: Omit<trips, 'id'>): Promise<trips> {
    const { data, error } = await supabase
      .from('trips')
      .insert([trips])
      .select();

    if (error) {
      console.error("Error de Supabase:", error);
      throw new Error('Error al crear reserva');
    }
    return data[0]; // Retornamos el objeto recién creado
  },

  // DELETE: Eliminar una reserva
  async deleteReservation(id: number): Promise<void> {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error de Supabase:", error);
      throw new Error('Error al eliminar reserva');
    }
  }
};