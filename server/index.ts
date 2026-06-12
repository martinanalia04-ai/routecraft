// index.ts (Backend)
import express from 'express';
import cors from 'cors';
import tripRoutes from './src/routes/tripRoutes';
// 1. Importa las rutas de reservas (puedes usar import adaptado para CommonJS)
import reservationRoutes from './src/routes/reservationRoutes'; 

const app = express();
const PORT = 3000; // Tu backend corre en el 3000

app.use(cors());
app.use(express.json());

// 2. Registra las rutas correspondientes
app.use('/api/trips', tripRoutes);
app.use('/api/reservations', reservationRoutes); // <-- ¡Faltaba esta línea!

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});