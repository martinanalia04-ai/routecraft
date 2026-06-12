import { Router } from 'express';
import { getTrips, addTrip } from '../controllers/tripController';

const router = Router();

router.get('/', getTrips);  // Escucha GET en /api/trips
router.post('/', addTrip); // Escucha POST en /api/trips

export default router;