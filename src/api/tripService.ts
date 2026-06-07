import { type Trip } from '../types/trip';

const API_URL = 'http://localhost:3000/trips'; // O tu URL de backend

export const fetchTrips = async (): Promise<Trip[]> => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createTrip = async (trip: Omit<Trip, 'id'>): Promise<Trip> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip),
  });
  return response.json();
};