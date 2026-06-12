import { useState } from 'react';
import * as api from '../api/tripService';
import { type Trip } from '../types/trip';

export default function TripForm() {
  const [formData, setFormData] = useState<Omit<Trip, 'id'>>({
    title: '',
    destination: '',
    budget: 0,
    status: 'Planificado',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof api.createTrip !== 'function') {
      console.error('Error: createTrip no es una función', api.createTrip);
      alert('Error interno: La función de guardado no está cargada.');
      return;
    }

    try {
      await api.createTrip(formData);
      alert('¡Viaje guardado con éxito! 🌍');

      // Limpiar formulario
      setFormData({
        title: '',
        destination: '',
        budget: 0,
        status: 'Planificado',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un problema al guardar el viaje.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md">
      <input
        type="text"
        placeholder="Título del viaje"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        className="border p-2 w-full mb-4"
      />

      <input
        type="text"
        placeholder="Destino"
        value={formData.destination}
        onChange={(e) =>
          setFormData({ ...formData, destination: e.target.value })
        }
        className="border p-2 w-full mb-4"
      />

      <input
        type="date"
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        className="border p-2 w-full mb-4"
      />

      <input
        type="date"
        value={formData.endDate}
        onChange={(e) =>
          setFormData({ ...formData, endDate: e.target.value })
        }
        className="border p-2 w-full mb-4"
      />

      <input
        type="number"
        placeholder="Presupuesto"
        value={formData.budget}
        onChange={(e) =>
          setFormData({
            ...formData,
            budget: Number(e.target.value),
          })
        }
        className="border p-2 w-full mb-4"
      />

      <select
        value={formData.status}
        onChange={(e) =>
          setFormData({
            ...formData,
            status: e.target.value as Trip['status'],
          })
        }
        className="border p-2 w-full mb-4"
      >
        <option value="Planificado">Planificado</option>
        <option value="En Curso">En Curso</option>
        <option value="Completado">Completado</option>
      </select>

      <button
        type="submit"
        className="bg-[#511365] text-white p-3 rounded-lg w-full"
      >
        Guardar Viaje
      </button>
    </form>
  );
}