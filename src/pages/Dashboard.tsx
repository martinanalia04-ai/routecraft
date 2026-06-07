
export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda: Formulario (Ocupa 1 columna de 3) */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Añadir Nuevo Destino ✨
          </h2>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Nombre del Viaje
              </label>
              <input 
                type="text" 
                placeholder="Ej: Ruta por la Costa Oeste" 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Destino
              </label>
              <input 
                type="text" 
                placeholder="Ej: Galway, Irlanda" 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Presupuesto
              </label>
              <input 
                type="number" 
                placeholder="Ej: 1500" 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none text-sm bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Inicio
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Fin
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none text-sm bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Estado del Viaje
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition outline-none text-sm bg-gray-50 cursor-pointer">
                <option value="planned">Planificado 🗓️</option>
                <option value="ongoing">En Curso ✈️</option>
                <option value="completed">Completado ✅</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition transform active:scale-[0.98]"
            >
              Guardar Viaje
            </button>
          </form>
        </div>
      </div>

      {/* Columna Derecha: Tarjetas de Viajes (Ocupa 2 columnas de 3) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Tus Próximos Viajes 🌍
          </h2>
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
            1 Destino activo
          </span>
        </div>

        {/* Rejilla de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta Alpes de ejemplo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between">
            <div className="p-6">
              <div className="flex justify-between items-start gap-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  Aventura en los Alpes
                </h3>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                  Planificado
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2 font-medium">
                  <span className="text-base">📍</span> Chamonix, Francia
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <span className="text-base">📅</span> 2026-07-15 - 2026-07-22
                </p>
              </div>
            </div>

            {/* Parte inferior de la tarjeta */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between mt-auto">
              <span className="text-xl font-black text-purple-600">
                $1,200
              </span>
              <button className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 py-1.5 px-3 rounded-lg transition border border-transparent hover:border-red-100">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}