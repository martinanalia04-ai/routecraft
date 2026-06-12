import { useState, useEffect } from 'react'; 
import { supabase } from '../api/supabase'; // Ajusta la ruta según tu estructura de carpetas

interface Reservation {
  id: string;
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
  image?: string;
}

export default function Dashboard() {
  // --- CONTROL DE PANTALLAS PRINCIPALES ---
  const [currentScreen, setCurrentScreen] = useState<'main' | 'promo50'>('main');

  // --- ESTADOS DE BÚSQUEDA ---
  const [activeTab, setActiveTab] = useState('vuelos');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [differentDropOff, setDifferentDropOff] = useState(false); 

  // --- NUEVAS VENTANAS FLOTANTES SEPARADAS ---
  const [showPrimeModal, setShowPrimeModal] = useState(false); 
  const [showAuthModal, setShowAuthModal] = useState(false);   
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // --- FILTROS Y COLECCIONES ---
  const [filterType, setFilterType] = useState('todos');
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedCurrency] = useState({ code: 'EUR', symbol: '€' });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(95730);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer); 
  }, []);

  // --- LOGIN Y REGISTRO ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor, rellena todos los campos.');
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        alert('¡Sesión iniciada correctamente! 🚀');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('¡Cuenta creada con éxito! Revisa tu correo de confirmación.');
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error al procesar la solicitud.');
    } finally {
      setAuthLoading(false);
    }
  };

  // --- CARGAR DATOS DESDE SUPABASE ---
  const loadReservationsFromServer = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('trips').select('*');
      if (error) throw error;

      const mappedReservations: Reservation[] = (data || []).map((row: any) => {
        let detailsObj = { detail: '', price: `${row.budget}€`, origin: 'Madrid', locator: 'RC-000000', type: 'vuelos', image: '' };
        try {
          if (row.description && row.description.startsWith('{')) {
            detailsObj = JSON.parse(row.description);
          } else {
            detailsObj.detail = row.description || '';
          }
        } catch (e) {
          detailsObj.detail = row.description || '';
        }

        return {
          id: row.id,
          title: row.title,
          detail: detailsObj.detail,
          price: detailsObj.price,
          origin: detailsObj.origin,
          destination: row.destination,
          departureDate: row.startDate || '2026-08-01',
          returnDate: row.endDate || '2026-08-10',
          locator: detailsObj.locator,
          status: row.status,
          type: detailsObj.type,
          image: detailsObj.image || row.image
        };
      });
      setReservations(mappedReservations);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReservationsFromServer();
  }, []);

  const formatTime = () => {
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleClearSearch = () => {
    setOrigin(''); setDestination(''); setDepartureDate(''); setReturnDate('');
    setAdults(1); setChildren(0); setInfants(0); setHasSearched(false);
    setDifferentDropOff(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleSelectBooking = async (title: string, detail: string, price: string, image?: string) => {
    const calculatedDestination = activeTab === 'hoteles' || (activeTab === 'coches' && !differentDropOff) ? origin || 'Destino Local' : (destination || 'Destino Internacional');
    
    const newBooking: Reservation = {
      id: 'rc-' + Date.now(),
      title,
      detail,
      price,
      image,
      origin: origin || 'Madrid (MAD)',
      destination: calculatedDestination,
      departureDate: departureDate || '2026-08-01',
      returnDate: returnDate || '2026-08-10',
      locator: 'RC-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Confirmado',
      type: activeTab
    };

    const dbPayload = {
      id: newBooking.id,
      title: newBooking.title,
      destination: newBooking.destination,
      budget: parseInt(price.replace(/[^0-9]/g, '')) || 0,
      status: 'Planificado', 
      startDate: newBooking.departureDate,
      endDate: newBooking.returnDate,
      description: JSON.stringify({
        detail: newBooking.detail,
        price: newBooking.price,
        origin: newBooking.origin,
        locator: newBooking.locator,
        type: newBooking.type,
        image: newBooking.image
      })
    };

    try {
      const { error } = await supabase.from('trips').insert([dbPayload]);
      if (error) throw error;
      setReservations(prev => [newBooking, ...prev]);
      alert('¡Reserva registrada con éxito! 🌍');
    } catch (e) {
      alert("Error de conexión con el servidor.");
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm('¿Deseas cancelar esta reserva?')) return;
    try {
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (error) throw error;
      setReservations(prev => prev.filter(res => res.id !== id));
    } catch (e) {
      alert("No se pudo procesar la cancelación.");
    }
  };

  const getMockResults = () => {
    const factor = adults + (children * 0.7);
    const sym = selectedCurrency.symbol;
    if (activeTab === 'hoteles') {
      return [
        { id: 'h1', title: 'Luxury Resort & Spa 🌟🌟🌟🌟🌟', detail: 'Vistas panorámicas al mar, piscina infinita climatizada y desayuno buffet gourmet incluido.', price: `${Math.round(180 * factor)}${sym}`, extra: '¡9.6 Excepcional!', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80' },
        { id: 'h2', title: 'Urban Grand Hotel 🌟🌟🌟🌟', detail: 'Ubicado en pleno centro histórico. Cuenta con terraza Rooftop, gym y WiFi de alta velocidad.', price: `${Math.round(110 * factor)}${sym}`, extra: 'Ubicación ideal (9.2)', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80' }
      ];
    } else if (activeTab === 'coches') {
      return [
        { id: 'c1', title: 'SUV Explorer Premium (Audi Q3 o similar)', detail: 'Transmisión automática, tracción total, espacio para 5 maletas grandes y seguro premium a todo riesgo.', price: `${Math.round(65 * factor)}${sym}`, extra: 'Modelo Recomendado', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80' },
        { id: 'c2', title: 'Compacto Urbano Eco (Fiat 500 o similar)', detail: 'Híbrido de bajísimo consumo, fácil maniobrabilidad urbana, 3 puertas con climatizador inteligente.', price: `${Math.round(29 * factor)}${sym}`, extra: 'Más Económico', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80' }
      ];
    }
    return [
      { id: 'v1', title: 'Vuelo Directo Premium (FlyCraft Air)', detail: 'Incluye maleta en cabina + bulto facturado de 23kg. Selección de asiento ergonómico gratis.', price: `${Math.round(89 * factor)}${sym}`, extra: 'El más vendido', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80' },
      { id: 'v2', title: 'Vuelo Económico Tarifa Smart', detail: '1 maleta de cabina incluida. Ideal para viajeros ligeros de equipaje. Bebidas a bordo de pago.', price: `${Math.round(42 * factor)}${sym}`, extra: 'Precio Mínimo', image: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=500&q=80' }
    ];
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesType = filterType === 'todos' || res.type === filterType;
    return matchesType && (res.origin + res.destination + res.title + res.locator).toLowerCase().includes(filterSearch.toLowerCase());
  });

  const totalSpent = filteredReservations.reduce((acc, res) => acc + (parseInt(res.price.replace(/[^0-9]/g, '')) || 0), 0);

  if (currentScreen === 'promo50') {
    return (
      <div className="min-h-screen bg-[#2e083a] text-white flex flex-col items-center justify-center p-4 md:p-6 font-sans">
        <div className="max-w-4xl text-center space-y-6 w-full">
          <div className="inline-block bg-yellow-400 text-black text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-bounce">
            ⚡ ¡Solo por tiempo limitado! ⚡
          </div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-none">
            Ahorrá el <span className="text-emerald-400">50% DIGITAL</span>
          </h1>
          <p className="text-slate-300 text-xs md:text-base max-w-xl mx-auto px-2">
            Armá las valijas. Esta promoción exclusiva es válida para compras realizadas antes del <span className="text-yellow-400 font-bold">30 de junio de 2026</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full">
            <button type="button" onClick={() => { setCurrentScreen('main'); setActiveTab('vuelos'); setHasSearched(true); }} className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black px-8 py-3.5 rounded-full text-xs uppercase cursor-pointer border-none">
              🚀 Buscar Vuelos Con Descuento
            </button>
            <button type="button" onClick={() => setCurrentScreen('main')} className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase cursor-pointer border border-white/20">
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-100 flex flex-col justify-between overflow-x-hidden w-full max-w-full box-border">
      
      {/* 🛠️ HEADER ULTRA-RESPONSIVO CORREGIDO */}
      <header className="bg-[#511365] text-white px-3 sm:px-6 py-3 flex items-center justify-between shadow-md relative z-30 font-sans w-full box-border">
        {/* Logo de la marca */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <span className="text-emerald-400 text-lg sm:text-xl flex-shrink-0">🌐</span>
          <span className="text-white font-black text-sm sm:text-lg tracking-tight truncate cursor-pointer" onClick={handleClearSearch}>
            RouteCraft
          </span>
        </div>

        {/* ❌ ESTO ERA LO QUE ROMPÍA EN MÓVIL: Ahora estrictamente oculto salvo en pantallas grandes (lg) */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-bold uppercase mx-2 overflow-hidden">
          {['vuelos', 'hoteles', 'vuelo-hotel-coche', 'trenes', 'coches'].map((t) => (
            <button key={t} type="button" onClick={() => {setActiveTab(t); setHasSearched(false);}} className={`bg-transparent border-none text-white cursor-pointer whitespace-nowrap ${activeTab === t ? 'border-b-2 border-white' : 'opacity-80'}`}>
              {t === 'vuelo-hotel-coche' ? '💎 Combo' : t}
            </button>
          ))}
        </nav>

        {/* Botones de acción alineados y sin peligro de desbordamiento */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            type="button" 
            onClick={() => setShowPrimeModal(true)} 
            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border-none cursor-pointer flex items-center gap-1 whitespace-nowrap transition-all transform hover:scale-105"
          >
            <span>✨</span> Prime
          </button>
          <button 
            type="button" 
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} 
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/20 cursor-pointer whitespace-nowrap"
          >
            Ingresar
          </button>
        </div>
      </header>

      {/* 👑 VENTANA INDEPENDIENTE: CONTENIDO PRIME */}
      {showPrimeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-sm">
          <div className="bg-gradient-to-b from-slate-950 to-purple-950 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-purple-500/30">
            <button type="button" onClick={() => setShowPrimeModal(false)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 border-none text-white font-bold w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-xs">✕</button>
            
            <div className="text-center space-y-2 mb-6">
              <span className="text-3xl">👑</span>
              <h3 className="font-black text-lg bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent uppercase tracking-tight">Beneficios RouteCraft Prime</h3>
              <p className="text-slate-400 text-xs">Acceso inmediato al club de viajes exclusivo más potente del mercado.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex gap-3">
                <span className="text-amber-400 font-bold text-sm flex-shrink-0">✓</span>
                <div>
                  <strong className="text-white block">Tarifas Ocultas Desbloqueadas</strong>
                  <span className="text-slate-400 text-[11px]">Descuentos directos de hasta el 40% en hoteles de lujo internacionales.</span>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex gap-3">
                <span className="text-amber-400 font-bold text-sm flex-shrink-0">✓</span>
                <div>
                  <strong className="text-white block">Cancelaciones sin Explicaciones</strong>
                  <span className="text-slate-400 text-[11px]">Reembolso íntegro en tu billetera virtual hasta 24 horas antes del viaje.</span>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex gap-3">
                <span className="text-amber-400 font-bold text-sm flex-shrink-0">✓</span>
                <div>
                  <strong className="text-white block">Soporte Humano Prioritario 24/7</strong>
                  <span className="text-slate-400 text-[11px]">Línea telefónica directa exclusiva libre de esperas y contestadores.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              <button 
                type="button" 
                onClick={() => { setShowPrimeModal(false); setAuthMode('register'); setShowAuthModal(true); }}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase cursor-pointer border-none shadow-lg hover:brightness-110 transition-all text-center block"
              >
                Suscribirse y Registrarse Gratis 🚀
              </button>
              <span className="text-[10px] text-slate-500 text-center block">Prueba de 30 días gratis, luego 9,99€/mes.</span>
            </div>
          </div>
        </div>
      )}

      {/* 🔑 VENTANA INDEPENDIENTE: INICIAR SESIÓN / CREAR CUENTA */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100">
            <button type="button" onClick={() => { setShowAuthModal(false); setEmail(''); setPassword(''); }} className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 border-none text-slate-400 hover:text-slate-600 font-bold w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-xs">✕</button>
            
            <h3 className="font-black text-slate-900 text-base mb-1 uppercase tracking-tight">
              {authMode === 'login' ? '🔑 Iniciar Sesión' : '📝 Crear Cuenta'}
            </h3>
            <p className="text-slate-500 text-xs mb-4">
              {authMode === 'login' ? 'Ingresa tus credenciales para conectarte a tu panel.' : 'Regístrate gratis para comenzar a guardar tus itinerarios.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Correo Electrónico</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@routecraft.com" className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#511365]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contraseña</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#511365]" />
              </div>

              <button type="submit" disabled={authLoading} className="w-full bg-[#511365] hover:bg-[#410f52] text-white font-black py-2.5 rounded-lg text-xs uppercase tracking-wider mt-3 border-none cursor-pointer disabled:opacity-50 transition-colors">
                {authLoading ? 'Procesando...' : authMode === 'login' ? 'Ingresar' : 'Registrar Cuenta'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-500 border-t pt-3">
              {authMode === 'login' ? (
                <span>¿Aún no tienes cuenta? <button type="button" onClick={() => setAuthMode('register')} className="bg-transparent border-none text-purple-600 font-bold cursor-pointer hover:underline p-0">Regístrate aquí</button></span>
              ) : (
                <span>¿Ya estás registrado? <button type="button" onClick={() => setAuthMode('login')} className="bg-transparent border-none text-purple-600 font-bold cursor-pointer hover:underline p-0">Inicia sesión</button></span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUERPO CENTRAL */}
      <div className="relative flex-1 bg-cover bg-center pt-6 pb-12 px-4 box-border w-full" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')` }}>
        <div className="max-w-6xl mx-auto w-full box-border">
          <h2 className="text-white text-xl md:text-3xl font-bold mb-1 drop-shadow-md">Busca. Reserva. Viaja.</h2>
          <div className="text-white/80 text-[10px] md:text-xs font-mono mb-4">⏱️ Oferta expira en: {formatTime()}</div>

          {/* PROMO FLASH */}
          <div onClick={() => setCurrentScreen('promo50')} className="mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-4 rounded-xl shadow-xl cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 border border-white/20 hover:scale-[1.01] transition-all group">
            <div className="flex items-center gap-3 text-center md:text-left flex-col md:flex-row">
              <span className="text-2xl group-hover:rotate-12 transition-transform">⚡</span>
              <div>
                <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wider">¡Hacker de Viajes Activado!</h4>
                <p className="text-white/80 text-[11px] md:text-xs">Descuento especial del 50% digital disponible. Haz clic aquí para ver tarifas.</p>
              </div>
            </div>
            <button type="button" className="w-full md:w-auto bg-white text-pink-600 font-extrabold text-[10px] md:text-xs px-5 py-2.5 rounded-full border-none pointer-events-none uppercase flex-shrink-0">Ver mi regalo 🎁</button>
          </div>

          {/* BUSCADOR CON DESPLAZAMIENTO HORIZONTAL SEGURO */}
          <form onSubmit={handleSearchSubmit} className="relative z-20 w-full box-border">
            <div className="flex items-end gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
              {['vuelos', 'hoteles', 'vuelo-hotel-coche', 'trenes', 'coches'].map((tab) => (
                <button key={tab} type="button" onClick={() => { setActiveTab(tab); setHasSearched(false); setDifferentDropOff(false); }} className={`px-4 py-2.5 rounded-t-md font-bold text-xs capitalize whitespace-nowrap border-none cursor-pointer flex-shrink-0 ${activeTab === tab ? 'bg-white text-slate-900 border-t-4 border-[#511365]' : 'bg-white/70 text-slate-700'}`}>
                  {tab === 'vuelos' && '✈️ Vuelos'} {tab === 'hoteles' && '🏨 Hoteles'} {tab === 'vuelo-hotel-coche' && '💎 Combo'} {tab === 'trenes' && '🚂 Trenes'} {tab === 'coches' && '🚗 Coches'}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-b-md rounded-tr-md p-4 md:p-6 shadow-2xl border border-slate-100 font-sans box-border">
              {activeTab === 'coches' && (
                <div className="mb-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#511365] cursor-pointer w-max">
                    <input type="checkbox" checked={differentDropOff} onChange={(e) => { setDifferentDropOff(e.target.checked); setHasSearched(false); }} className="accent-[#511365] w-4 h-4 rounded" /> 
                    Devolver en una oficina diferente
                  </label>
                </div>
              )}

              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3">
                <div className={`lg:col-span-6 flex flex-col sm:flex-row border border-slate-300 rounded focus-within:border-[#511365] bg-white overflow-hidden`}>
                  <input type="text" required value={origin} onChange={(e) => {setOrigin(e.target.value); setHasSearched(false);}} placeholder={activeTab === 'hoteles' ? "¿Dónde te vas a alojar?" : activeTab === 'coches' ? "Oficina de recogida" : "¿Desde dónde sales? (Origen)"} className="p-2.5 text-xs md:text-sm outline-none font-medium text-slate-800 bg-transparent flex-1 w-full" />
                  {(activeTab !== 'hoteles' && (activeTab !== 'coches' || differentDropOff)) && (
                    <input type="text" required value={destination} onChange={(e) => {setDestination(e.target.value); setHasSearched(false);}} placeholder={activeTab === 'coches' ? "Oficina de devolución" : "¿A dónde vas? (Destino)"} className="p-2.5 border-t sm:border-t-0 sm:border-l border-slate-200 text-xs md:text-sm outline-none font-medium text-slate-800 bg-transparent flex-1 w-full" />
                  )}
                </div>

                <div className="grid grid-cols-2 lg:col-span-4 gap-2">
                  <div className="border border-slate-300 rounded p-1.5 bg-white relative">
                    <span className="absolute top-0.5 left-2 text-[8px] uppercase font-bold text-slate-400">Ida</span>
                    <input type="date" required value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full text-xs outline-none pt-3 pb-0.5 font-semibold bg-transparent" />
                  </div>
                  <div className="border border-slate-300 rounded p-1.5 bg-white relative">
                    <span className="absolute top-0.5 left-2 text-[8px] uppercase font-bold text-slate-400">Vuelta</span>
                    <input type="date" required value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={departureDate} className="w-full text-xs outline-none pt-3 pb-0.5 font-semibold bg-transparent" />
                  </div>
                </div>

                <div className="lg:col-span-2 border border-slate-300 rounded p-1.5 bg-white relative">
                  <span className="absolute top-0.5 left-2 text-[8px] uppercase font-bold text-slate-400">Pasajeros</span>
                  <button type="button" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)} className="w-full text-left font-semibold text-xs pt-3 pb-0.5 bg-transparent border-none cursor-pointer">
                    {adults} ad, {children} ni, {infants} bb
                  </button>

                  {showPassengerDropdown && (
                    <div className="absolute left-0 lg:right-0 lg:left-auto top-full mt-1 bg-white border border-slate-200 rounded-xl p-4 shadow-2xl z-50 w-full sm:w-56 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold block text-slate-800">Adultos</span>
                          <span className="text-[9px] text-slate-400">Mayores de 12</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setAdults(prev => Math.max(1, prev - 1))} className="w-6 h-6 rounded-full border border-slate-300 bg-slate-50 font-bold cursor-pointer text-slate-700">-</button>
                          <span className="font-bold w-4 text-center text-slate-800">{adults}</span>
                          <button type="button" onClick={() => setAdults(prev => prev + 1)} className="w-6 h-6 rounded-full border border-slate-300 bg-slate-50 font-bold cursor-pointer text-slate-700">+</button>
                        </div>
                      </div>
                      <button type="button" onClick={() => setShowPassengerDropdown(false)} className="w-full bg-[#511365] text-white font-bold py-1.5 rounded-lg text-[10px] uppercase border-none cursor-pointer">Listo</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <button type="button" onClick={handleClearSearch} className="w-full sm:w-auto bg-slate-100 text-slate-600 font-bold py-2.5 px-5 rounded-full border-none cursor-pointer text-xs uppercase">Limpiar</button>
                <button type="submit" className="w-full sm:w-auto bg-[#511365] text-white font-bold py-2.5 px-6 rounded-full border-none cursor-pointer text-xs uppercase">Buscar {activeTab}</button>
              </div>
            </div>
          </form>

          {/* TARJETAS RESULTADOS */}
          {hasSearched && (
            <div className="mt-6 bg-white/95 rounded-xl p-4 md:p-6 shadow-xl border border-slate-200 font-sans">
              <h3 className="font-black text-xs md:text-sm text-[#511365] uppercase mb-4 border-b pb-2">📍 Opciones Disponibles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {getMockResults().map((result) => (
                  <div key={result.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                    <img src={result.image} alt={result.title} className="w-full h-32 md:h-36 object-cover" />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs mb-1 leading-tight">{result.title}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mb-3">{result.detail}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <span className="block text-[8px] font-extrabold text-[#10b981] bg-emerald-50 px-1.5 py-0.5 rounded">{result.extra}</span>
                          <span className="text-xs md:text-sm font-black text-[#511365] block mt-0.5">{result.price}</span>
                        </div>
                        <button type="button" onClick={() => handleSelectBooking(result.title, result.detail, result.price, result.image)} className="bg-[#10b981] text-white font-bold text-[10px] py-1.5 px-3 rounded-full border-none cursor-pointer">Elegir</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-6 text-center animate-pulse">
              <span className="text-[#511365] font-bold text-xs bg-purple-100 px-4 py-2 rounded-full">⏳ Sincronizando datos...</span>
            </div>
          )}

          {/* SECCIÓN HISTORIAL RESERVAS */}
          {reservations.length > 0 && (
            <div className="mt-6 bg-white rounded-xl p-4 md:p-6 shadow-2xl border-2 border-emerald-400 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 mb-4 gap-2">
                <h3 className="font-black text-sm md:text-base text-slate-900 uppercase">💼 Mis Reservas</h3>
                <span className="w-max bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Total: {filteredReservations.length}</span>
              </div>

              <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col md:grid md:grid-cols-12 gap-2.5 items-center">
                <input type="text" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} placeholder="Buscar..." className="w-full md:col-span-4 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none" />
                <div className="md:col-span-8 flex flex-wrap gap-1 w-full justify-start md:justify-end">
                  {['todos', 'vuelos', 'hoteles', 'coches'].map((cat) => (
                    <button key={cat} type="button" onClick={() => setFilterType(cat)} className={`px-2.5 py-1 rounded text-[10px] font-bold border-none cursor-pointer ${filterType === cat ? 'bg-[#511365] text-white' : 'bg-white border text-slate-600'}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="mb-4 bg-slate-950 text-white rounded-lg p-2.5 flex justify-between text-xs font-medium">
                <span>Inversión Total Acumulada:</span>
                <span className="font-black text-emerald-400">{totalSpent} {selectedCurrency.symbol}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReservations.map((res) => (
                  <div key={res.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between shadow-sm">
                    {res.image && <img src={res.image} alt={res.title} className="w-full h-24 object-cover" />}
                    <div className="p-3">
                      <span className="text-[8px] font-extrabold text-[#511365] uppercase block mb-0.5">{res.type}</span>
                      <h4 className="font-bold text-slate-800 text-xs leading-tight mb-1 line-clamp-1">{res.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">📍 {res.origin} → {res.destination}</p>
                      <div className="flex justify-between items-center pt-2 border-t mt-3 text-[11px]">
                        <span className="font-mono text-slate-500 font-bold">{res.locator}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#511365]">{res.price}</span>
                          <button type="button" onClick={() => handleCancelReservation(res.id)} className="bg-red-100 text-red-600 w-5 h-5 rounded-full flex items-center justify-center font-bold border-none cursor-pointer">✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800 font-sans w-full box-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-white font-bold text-base">🌐 RouteCraft Inc.</div>
            <p className="text-slate-500 text-[11px]">Ecosistema global optimizado de enrutamiento inteligente.</p>
          </div>
          <div className="text-[11px]">📞 <span className="text-slate-300 font-medium">900 839 201 (Soporte Gratuito)</span></div>
        </div>
      </footer>

    </div>
  );
}