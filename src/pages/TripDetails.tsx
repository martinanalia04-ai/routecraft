// src/pages/TripDetails.tsx
import { useParams, Link } from 'react-router-dom';

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Detalle del Viaje #{id}</h2>
      <p className="text-gray-600 mb-6">Aquí verás los itinerarios, notas y mapas de este destino.</p>
      <Link to="/" className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
        Volver al Panel Principal
      </Link>
    </div>
  );
}