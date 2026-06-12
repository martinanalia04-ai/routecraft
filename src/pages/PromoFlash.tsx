import { Link } from 'react-router-dom';

export default function PromoFlash() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#511365] via-[#3d0e4c] to-slate-900 text-white font-sans antialiased flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      
      {/* Efectos de luces de fondo de diseño */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[#10b981]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#ffcc00]/10 rounded-full blur-3xl"></div>

      <div className="max-w-3xl mx-auto w-full relative z-10 my-auto">
        
        {/* Badge de Urgencia */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[#ffcc00] text-slate-900 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg animate-bounce">
            ⚡ ¡Solo por tiempo limitado! ⚡
          </span>
        </div>

        {/* Encabezado Principal */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Ahorrá el <span className="text-[#10b981] drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]">50% DIGITAL</span>
          </h1>
          <p className="text-slate-300 font-medium md:text-lg max-w-xl mx-auto">
            Armá las valijas. Esta promoción exclusiva es válida para compras realizadas antes del <span className="text-[#ffcc00] font-bold">30 de junio de 2026</span>.
          </p>
        </div>

        {/* Tarjetas de Condiciones/Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center shadow-xl hover:border-[#10b981]/40 transition-colors">
            <div className="text-2xl mb-2">✈️</div>
            <h3 className="font-bold text-sm text-[#10b981] mb-1">Destinos Seleccionados</h3>
            <p className="text-xs text-slate-300">Aplica a una enorme selección de vuelos nacionales e internacionales de temporada.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center shadow-xl hover:border-[#ffcc00]/40 transition-colors">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="font-bold text-sm text-[#ffcc00] mb-1">Precio Directo</h3>
            <p className="text-xs text-slate-300">El descuento del 50% se aplica de forma automática directamente al finalizar tu reserva.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center shadow-xl hover:border-purple-400/40 transition-colors">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-bold text-sm text-purple-300 mb-1">Transparencia</h3>
            <p className="text-xs text-slate-300">No acumulable con otras ofertas en curso, garantizando siempre la tarifa más baja real.</p>
          </div>

        </div>

        {/* Sección de Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto bg-[#10b981] hover:bg-[#0da271] text-white font-black text-sm px-8 py-4 rounded-full shadow-lg transition-all text-center uppercase tracking-wider active:scale-95"
          >
            🚀 Buscar Vuelos con Descuento
          </Link>
          
          <Link 
            to="/" 
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-4 rounded-full transition-all text-center border border-white/10"
          >
            Volver al Panel
          </Link>
        </div>

      </div>

      {/* Mini Legales en el Pie */}
      <footer className="text-center text-[10px] text-slate-500 mt-8 relative z-10">
        *Sujeto a disponibilidad de plazas por parte de las aerolíneas colaboradoras. RouteCraft 2026.
      </footer>

    </div>
  );
}