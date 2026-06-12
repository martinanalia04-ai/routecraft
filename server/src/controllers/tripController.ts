import { Request, Response } from 'express';
import * as tripService from '../services/tripService';

// GET /api/trips
export const getTrips = (req: Request, res: Response) => {
  try {
    const data = tripService.getAllTrips();
    res.status(200).json(data); // 200 OK
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/trips
export const addTrip = (req: Request, res: Response) => {
  try {
    const { title, destination } = req.body;

    // Validación en la frontera de red (Fase 3/Fase 11)
    if (!title || !destination) {
      return res.status(400).json({ message: 'El título y el destino son campos obligatorios.' }); // 400 Bad Request
    }

    const createdTrip = tripService.createTrip(req.body);
    res.status(201).json(createdTrip); // 201 Created
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el viaje' });
  }
};