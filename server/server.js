// server/server.js
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Mock DB en memoria
let trips = [];

// GET todos los viajes
app.get('/api/trips', (req, res) => {
  res.json(trips);
});

// POST crear viaje
app.post('/api/trips', (req, res) => {
  const newTrip = {
    id: Date.now().toString(),
    ...req.body
  };

  trips.push(newTrip);

  res.status(201).json(newTrip);
});

// DELETE eliminar viaje
app.delete('/api/trips/:id', (req, res) => {
  const { id } = req.params;

  trips = trips.filter(trip => trip.id !== id);

  res.status(200).json({
    message: 'Viaje eliminado'
  });
});

app.listen(3001, () => {
  console.log('Servidor corriendo en puerto 3001');
});