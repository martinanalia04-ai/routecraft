import { useState, useEffect } from 'react'; 
import { supabase } from '../api/supabase'; // Ruta para tu cliente de Supabase

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
  // --- CONTROL DE PANTALLA PRINCIPAL VS PROMO 50% ---
  const [currentScreen, setCurrentScreen] = useState<'main' | 'promo50'>('main');

  // --- ESTADOS DE LA APLICACIÓN ---
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
  
  // --- ESTADOS DE AUTENTICACIÓN AJUSTADOS ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Estado para el Nombre de Usuario
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null); // Guarda el nombre del usuario activo
  const [authLoading, setAuthLoading] = useState(false);

  // --- NUEVOS ESTADOS DE MODALES Y ALERTAS DE MANTENIMIENTO ---
  const [showPrimeModal, setShowPrimeModal] = useState(false);
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(false);
  const [differentDropOff, setDifferentDropOff] = useState(false); 

  // --- FILTROS DE RESERVAS ACUMULADAS ---
  const [filterType, setFilterType] = useState('todos');
  const [filterSearch, setFilterSearch] = useState('');

  // Idioma y moneda
  const [selectedCurrency] = useState({ code: 'EUR', symbol: '€' });

  // Sincronización Backend
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState(95730);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer); 
  }, []);

  // --- MANEJADOR DE ENVÍO DE AUTENTICACIÓN UNIFICADO ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (authMode === 'register' && !username)) {
      alert('Por favor, rellena todos los campos de forma correcta.');
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (response.error) throw response.error;
        
        // Obtenemos el nombre asignado al usuario desde su metadata de Supabase (o usamos la primera parte del correo si no existe)
        const userDisplayName = response.data.user?.user_metadata?.username || email.split('@')[0];
        setLoggedInUser(userDisplayName);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username // Guardamos el nombre de usuario en la metadata de Supabase Auth
            }
          }
        });
        if (error) throw error;
        
        setLoggedInUser(username);
      }
      
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error: any) {
      console.error('Fallo en el proceso de autenticación:', error);
      alert(error.message || 'Ocurrió un error inesperado al procesar la solicitud.');
    } finally {
      setAuthLoading(false);
    }
  };

  // --- Cargar reservas EXCLUSIVAMENTE desde el backend (Mapeado a la tabla 'trips') ---
  const loadReservationsFromServer = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*');

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
          departureDate: row.startDate || row.startdate || '2026-08-01',
          returnDate: row.endDate || row.enddate || '2026-08-10',
          locator: detailsObj.locator,
          status: row.status,
          type: detailsObj.type,
          image: detailsObj.image || row.image
        };
      });

      setReservations(mappedReservations);
    } catch (error) {
      console.error("Error al cargar reservas desde Supabase:", error);
      setReservations([]);
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
    return [
      String(days).padStart(2, '0'),
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':');
  };

  const handleClearSearch = () => {
    setOrigin(''); setDestination(''); setDepartureDate(''); setReturnDate('');
    setAdults(1); setChildren(0); setInfants(0); setHasSearched(false);
    setDifferentDropOff(false);
  };

  // --- INTERCEPCIÓN DEL FORMULARIO PARA MOSTRAR CARTEL DE MANTENIMIENTO ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMaintenanceAlert(true);
    // Ocultamos automáticamente el aviso de mantenimiento tras 4 segundos
    setTimeout(() => {
      setShowMaintenanceAlert(false);
    }, 4000);
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
      const { error } = await supabase
        .from('trips')
        .insert([dbPayload]);

      if (error) throw error;

      setReservations(prev => [newBooking, ...prev]);
      alert('¡Reserva guardada con éxito! 🌍');
    } catch (e) {
      console.error("Fallo crítico: No se pudo guardar en Supabase", e);
      alert("Hubo un problema de conexión. La reserva no pudo ser guardada.");
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm('¿Seguro que deseas cancelar esta reserva de forma permanente?')) return;
    
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      setReservations(prev => prev.filter(res => res.id !== id));
    } catch (e) {
      console.error("Fallo crítico: No se pudo eliminar la reserva en Supabase", e);
      alert("Hubo un problema al cancelar tu reserva con el servidor.");
    }
  };

  const getMockResults = () => {
    const factor = adults + (children * 0.7);
    const sym = selectedCurrency.symbol;

    switch (activeTab) {
      case 'hoteles':
        return [
          { id: 'h1', title: 'Luxury Resort & Spa 🌟🌟🌟🌟🌟', detail: 'Vistas panorámicas al mar, piscina infinita climatizada y desayuno buffet gourmet incluido.', price: `${Math.round(180 * factor)}${sym}`, extra: '¡9.6 Excepcional!', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80' },
          { id: 'h2', title: 'Urban Grand Hotel 🌟🌟🌟🌟', detail: 'Ubicado en pleno centro histórico. Cuenta con terraza Rooftop, gym y WiFi de alta velocidad.', price: `${Math.round(110 * factor)}${sym}`, extra: 'Ubicación ideal (9.2)', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80' },
          { id: 'h3', title: 'Boutique Eco Lodge 🌟🌟🌟', detail: 'Ambiente natural y autosustentable. Perfecto para escapadas tranquilas de desconexión total.', price: `${Math.round(75 * factor)}${sym}`, extra: 'Mejor precio', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80' },
          { id: 'h4', title: 'Family Sky Apartments 🌟🌟🌟🌟', detail: 'Apartamento familiar totalmente equipado con cocina de diseño, balcón y zona de juegos infantil.', price: `${Math.round(135 * factor)}${sym}`, extra: 'Ideal familias', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=80' }
        ];
      case 'coches':
        return [
          { id: 'c1', title: 'SUV Explorer Premium (Audi Q3 o similar)', detail: 'Transmisión automática, tracción total, espacio para 5 maletas grandes y seguro premium a todo riesgo.', price: `${Math.round(65 * factor)}${sym}`, extra: 'Modelo Recomendado', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80' },
          { id: 'c2', title: 'Compacto Urbano Eco (Fiat 500 o similar)', detail: 'Híbrido de bajísimo consumo, fácil maniobrabilidad urbana, 3 puertas con climatizador inteligente.', price: `${Math.round(29 * factor)}${sym}`, extra: 'Más Económico', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80' },
          { id: 'c3', title: 'Berlina Executive (Tesla Model 3 o similar)', detail: '100% Eléctrico de gran autonomía, conducción asistida, pantalla multimedia de 15" y carga rápida.', price: `${Math.round(85 * factor)}${sym}`, extra: 'Alta Gama Élite', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=500&q=80' },
          { id: 'c4', title: 'Adventure Family Van (VW Transporter)', detail: 'Ideal para grupos o familias numerosas. 7 plazas espaciosas, portaesquís opcional y gran maletero.', price: `${Math.round(110 * factor)}${sym}`, extra: 'Máxima capacidad', image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=500&q=80' }
        ];
      case 'trenes':
        return [
          { id: 't1', title: 'Alta Velocidad - Preferente Confort', detail: 'Asientos de cuero XL reclinables, enchufes individuales, acceso a Sala Club y restauración incluida.', price: `${Math.round(45 * factor)}${sym}`, extra: 'Trayecto más rápido', image: 'https://images.unsplash.com/photo-1532103054090-334e6e60b73c?auto=format&fit=crop&w=500&q=80' },
          { id: 't2', title: 'Intercity Flexible Estándar', detail: 'Tarifa con cambios gratis permitidos. Espacio ampliado para maletas pesadas y WiFi a bordo.', price: `${Math.round(28 * factor)}${sym}`, extra: 'Mejor Flexibilidad', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=500&q=80' },
          { id: 't3', title: 'Tren Nocturno Express Blue', detail: 'Viaja descansando en cabina con litera privada. Incluye kit de aseo y café de cortesía matutino.', price: `${Math.round(60 * factor)}${sym}`, extra: 'Ahorra noche hotel', image: 'https://images.unsplash.com/photo-1515165504669-4230870744a6?auto=format&fit=crop&w=500&q=80' },
          { id: 't4', title: 'Regional Económico Directo', detail: 'Enlace directo sin escalas intermedias. Perfecto para viajes directos de corta y media distancia.', price: `${Math.round(15 * factor)}${sym}`, extra: 'Tarifa Low Cost', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80' }
        ];
      case 'vuelo-hotel-coche':
        return [
          { id: 'p1', title: 'Pack Oro Caribe: Vuelo + Hotel 5★ + SUV', detail: 'Vuelo transatlántico directo, estancia Completa de 7 noches en Resort VIP y SUV libre en destino.', price: `${Math.round(499 * factor)}${sym}`, extra: '🔥 Ahorras 35% en Pack', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=80' },
          { id: 'p2', title: 'Euro-Tour Completo: Todo en Uno', detail: 'Vuelos internos entre capitales, hoteles boutique céntricos y utilitario eficiente para las rutas.', price: `${Math.round(320 * factor)}${sym}`, extra: 'Favorito Cultural', image: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=500&q=80' },
          { id: 'p3', title: 'Pack Aventura Alpes Premium', detail: 'Vuelo + Chalet Alpino de lujo con spa + Coche 4x4 preparado para nieve con cadenas incluidas.', price: `${Math.round(410 * factor)}${sym}`, extra: 'Especial Invierno', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80' },
          { id: 'p4', title: 'Escapada Express Pack Ahorro', detail: 'Vuelo de fin de semana, hotel funcional de 3 estrellas cercano a transporte y coche compacto.', price: `${Math.round(180 * factor)}${sym}`, extra: 'Outlet Semanal', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=500&q=80' }
        ];
      default: 
        return [
          { id: 'v1', title: 'Vuelo Directo Premium (FlyCraft Air)', detail: 'Incluye maleta en cabina + bulto facturado de 23kg. Selección de asiento ergonómico gratis.', price: `${Math.round(89 * factor)}${sym}`, extra: 'El más vendido', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80' },
          { id: 'v2', title: 'Vuelo Económico Tarifa Smart', detail: '1 maleta de cabina incluida. Ideal para viajeros ligeros de equipaje. Bebidas a bordo de pago.', price: `${Math.round(42 * factor)}${sym}`, extra: 'Precio Mínimo', image: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=500&q=80' },
          { id: 'v3', title: 'Business Class Intercontinental', detail: 'Acceso prioritario a salas VIP de aeropuertos, asientos-cama totalmente reclinables y menú de autor.', price: `${Math.round(250 * factor)}${sym}`, extra: 'Máxima Exclusividad', image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=500&q=80' },
          { id: 'v4', title: 'Vuelo con Escala Optimizada', detail: 'Escala técnica corta de 45 min. Conexión garantizada y asistencia preferente en terminal.', price: `${Math.round(65 * factor)}${sym}`, extra: 'Buen Balance', image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=500&q=80' }
        ];
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesType = filterType === 'todos' || res.type === filterType;
    return matchesType && (res.origin + res.destination + res.title + res.locator).toLowerCase().includes(filterSearch.toLowerCase());
  });

  const totalSpent = filteredReservations.reduce((acc, res) => acc + (parseInt(res.price.replace(/[^0-9]/g, '')) || 0), 0);

  if (currentScreen === 'promo50') {
    return (
      <div className="min-h-screen bg-[#2e083a] text-white flex flex-col items-center justify-center p-6 font-sans select-none">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-block bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-bounce">
            ⚡ ¡Solo por tiempo limitado! ⚡
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Ahorrá el <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">50% DIGITAL</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium">
            Armá las valijas. Esta promoción exclusiva es válida para compras realizadas antes del <span className="text-yellow-400 font-bold">30 de junio de 2026</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            <div className="bg-[#411452]/60 border border-white/10 rounded-2xl p-6 text-center">
              <span className="text-3xl block mb-2">✈️</span>
              <h4 className="text-emerald-400 font-bold text-sm mb-1">Destinos Seleccionados</h4>
              <p className="text-white/70 text-xs">Aplica a una enorme selección de vuelos nacionales e internacionales.</p>
            </div>
            <div className="bg-[#411452]/60 border border-white/10 rounded-2xl p-6 text-center">
              <span className="text-3xl block mb-2">🛡️</span>
              <h4 className="text-yellow-400 font-bold text-sm mb-1">Precio Directo</h4>
              <p className="text-white/70 text-xs">El descuento se aplica automáticamente directamente al finalizar tu reserva.</p>
            </div>
            <div className="bg-[#411452]/60 border border-white/10 rounded-2xl p-6 text-center">
              <span className="text-3xl block mb-2">✨</span>
              <h4 className="text-purple-300 font-bold text-sm mb-1">Transparencia</h4>
              <p className="text-white/70 text-xs">No acumulable con otras ofertas, asegurando el price neto más bajo.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <button 
              type="button"
              onClick={() => { setCurrentScreen('main'); setActiveTab('vuelos'); setHasSearched(true); }}
              className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black px-8 py-3.5 rounded-full text-xs uppercase tracking-wider cursor-pointer border-none"
            >
              🚀 Buscar Vuelos Con Descuento
            </button>
            <button type="button" onClick={() => setCurrentScreen('main')} className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider cursor-pointer border border-white/20">
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-100 flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="bg-[#511365] text-white px-6 py-3 flex items-center justify-between shadow-md relative z-30 font-sans">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleClearSearch}>
            <span className="text-emerald-400 text-xl">🌐</span>
            <span className="text-white font-bold text-xl tracking-tight">RouteCraft</span>
          </div>
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase">
            {['vuelos', 'hoteles', 'vuelo-hotel-coche', 'trenes', 'coches'].map((t) => (
              <button key={t} type="button" onClick={() => {setActiveTab(t); setHasSearched(false);}} className={`bg-transparent border-none text-white cursor-pointer ${activeTab === t ? 'border-b-2 border-white' : 'opacity-80'}`}>
                {t === 'vuelo-hotel-coche' ? '💎 Combo Pack' : t}
              </button>
            ))}
          </nav>
        </div>

        {/* CONTROLES DE LA DERECHA (SOPORTE DE SALUDO DINÁMICO) */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button 
            type="button" 
            onClick={() => setShowPrimeModal(true)} 
            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-5 py-2 rounded-full shadow-md border-none cursor-pointer flex items-center gap-1.5 transition-all transform hover:scale-105"
          >
            <span>✨</span> Hacerse Prime
          </button>
          
          {loggedInUser ? (
            <div className="bg-white/20 backdrop-blur-md text-emerald-300 font-black px-4 py-2 rounded-full border border-emerald-400/30 shadow-inner flex items-center gap-1">
              👋 ¡Hola, <span className="text-white underline decoration-emerald-400 decoration-2">{loggedInUser}</span>!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} 
                className="bg-transparent border-none text-white cursor-pointer hover:underline font-bold"
              >
                Inicia sesión / Crear cuenta
              </button>
            </div>
          )}
        </div>
      </header>

      {/* VENTANA EMERGENTE: HACERSE PRIME ACTIVADA */}
      {showPrimeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-md">
          <div className="bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-amber-400/40 text-center animate-fadeIn">
            <button 
              type="button" 
              onClick={() => setShowPrimeModal(false)} 
              className="absolute top-4 right-4 bg-transparent border-none text-slate-400 hover:text-white font-bold text-base cursor-pointer"
            >
              ✕
            </button>
            <span className="text-4xl block mb-2">👑</span>
            <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 text-lg uppercase tracking-wider mb-2">
              Únete a RouteCraft Prime
            </h3>
            <p className="text-slate-300 text-xs mb-4 leading-relaxed">
              Viaja sin límites como un verdadero profesional. Obtén accesos VIP y beneficios ocultos directo en tu cuenta corporativa.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left space-y-2 mb-4 text-xs">
              <div className="flex items-center gap-2">✨ <span className="font-bold text-amber-300">Descuento del 15%</span> extra fijo en Hoteles y Coches.</div>
              <div className="flex items-center gap-2">🎧 <span className="font-bold text-amber-300">Soporte Prioritario VIP</span> 24 horas sin esperas.</div>
              <div className="flex items-center gap-2">🛡️ <span className="font-bold text-amber-300">Cancelación gratuita</span> flexible en cualquier itinerario.</div>
            </div>

            <button 
              type="button"
              onClick={() => { alert('¡Gracias por unirte! Tu suscripción Prime de prueba gratuita ha sido activada.'); setShowPrimeModal(false); }}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer border-none shadow-lg transition-transform transform hover:scale-[1.02]"
            >
              Comenzar prueba gratis de 30 días
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE AUTENTICACIÓN UNIFICADO */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100">
            <button 
              type="button" 
              onClick={() => { setShowAuthModal(false); setEmail(''); setPassword(''); setUsername(''); }} 
              className="absolute top-4 right-4 bg-transparent border-none text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex border-b mb-4">
              <button 
                type="button" 
                onClick={() => setAuthMode('login')} 
                className={`flex-1 pb-2 font-black text-xs uppercase tracking-tight bg-transparent border-none cursor-pointer ${authMode === 'login' ? 'text-[#511365] border-b-2 border-[#511365]' : 'text-slate-400'}`}
              >
                🔑 Iniciar Sesión
              </button>
              <button 
                type="button" 
                onClick={() => setAuthMode('register')} 
                className={`flex-1 pb-2 font-black text-xs uppercase tracking-tight bg-transparent border-none cursor-pointer ${authMode === 'register' ? 'text-[#511365] border-b-2 border-[#511365]' : 'text-slate-400'}`}
              >
                📝 Registrarse
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    required 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Tu apodo o nombre" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#511365]"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="ejemplo@routecraft.com" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#511365]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contraseña</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#511365]"
                />
              </div>

              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-[#511365] hover:bg-[#410f52] text-white font-black py-2.5 rounded-lg text-xs uppercase tracking-wider mt-3 border-none cursor-pointer disabled:opacity-50 transition-colors"
              >
                {authLoading ? 'Procesando...' : authMode === 'login' ? 'Conectarse' : 'Registrar Cuenta'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUERPO CENTRAL */}
      <div 
        className="relative flex-1 bg-cover bg-center pt-8 pb-14 px-4"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')` }}
      >
        {/* CARTEL LINDO DE EN MANTENIMIENTO */}
        {showMaintenanceAlert && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white font-sans p-4 rounded-xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-bounce">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider">Módulo en Mantenimiento</h4>
              <p className="text-[11px] text-white/90">Estamos optimizando la API global de enrutamiento. Inténtalo de nuevo en unos minutos.</p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <h2 className="text-white text-2xl font-bold mb-4 drop-shadow-md">Busca. Reserva. Viaja.</h2>
          <div className="text-white/80 text-xs font-mono mb-4">⏱️ La oferta expira en: {formatTime()}</div>

          {/* BANNER PROMO FLASH */}
          <div 
            onClick={() => setCurrentScreen('promo50')}
            className="mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-4 rounded-xl shadow-xl cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 hover:scale-[1.01] transition-all group animate-pulse"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-2xl group-hover:rotate-12 transition-transform">⚡</span>
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-wider">¡Hacker de Viajes Activado! Promo Flash Disponible</h4>
                <p className="text-white/80 text-xs">Tienes un discount especial esperándote. Haz clic aquí para descubrir tu tarifa oculta.</p>
              </div>
            </div>
            <button type="button" className="bg-white text-pink-600 font-extrabold text-xs px-5 py-2.5 rounded-full shadow-md uppercase border-none pointer-events-none">Ver mi regalo 🎁</button>
          </div>

          {/* BUSCADOR (BOTÓN PLANIFICAR ASOCIADO A REQUERIMIENTO MANTENIMIENTO) */}
          <form onSubmit={handleSearchSubmit} className="relative z-10">
            <div className="flex items-end gap-1 overflow-x-auto">
              {['vuelos', 'hoteles', 'vuelo-hotel-coche', 'trenes', 'coches'].map((tab) => (
                <button 
                  key={tab} type="button" onClick={() => { setActiveTab(tab); setHasSearched(false); setDifferentDropOff(false); }}
                  className={`px-5 py-3 rounded-t-md font-bold text-sm capitalize whitespace-nowrap border-none cursor-pointer ${activeTab === tab ? 'bg-white text-slate-900 border-t-4 border-[#511365]' : 'bg-white/70 text-slate-700'}`}
                >
                  {tab === 'vuelos' && '✈️ Vuelos'} {tab === 'hoteles' && '🏨 Hoteles'} {tab === 'vuelo-hotel-coche' && '💎 Combo Pack'} {tab === 'trenes' && '🚂 Trenes'} {tab === 'coches' && '🚗 Coches'}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-b-md rounded-tr-md p-6 shadow-2xl border border-slate-100 font-sans">
              {activeTab === 'coches' && (
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#511365] cursor-pointer w-max">
                    <input type="checkbox" checked={differentDropOff} onChange={(e) => { setDifferentDropOff(e.target.checked); setHasSearched(false); }} className="accent-[#511365] w-4 h-4 rounded" /> 
                    Devolver en una oficina diferente
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                <div className={`sm:col-span-2 lg:col-span-6 grid border border-slate-300 rounded focus-within:border-[#511365] bg-white ${
                  activeTab === 'hoteles' || (activeTab === 'coches' && !differentDropOff) ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                }`}>
                  <input type="text" required value={origin} onChange={(e) => {setOrigin(e.target.value); setHasSearched(false);}} placeholder={activeTab === 'hoteles' ? "¿Dónde te vas a alojar?" : activeTab === 'coches' ? "Oficina de recogida del coche" : "¿Desde dónde sales? (Origen)"} className="p-2.5 text-sm outline-none font-medium text-slate-800 bg-transparent w-full" />
                  {(activeTab !== 'hoteles' && (activeTab !== 'coches' || differentDropOff)) && (
                    <input type="text" required value={destination} onChange={(e) => {setDestination(e.target.value); setHasSearched(false);}} placeholder={activeTab === 'coches' ? "Oficina de devolución" : "¿A dónde vas? (Destino)"} className="p-2.5 border-t md:border-t-0 md:border-l border-slate-200 text-sm outline-none font-medium text-slate-800 bg-transparent w-full" />
                  )}
                </div>

                <div className="lg:col-span-2 border border-slate-300 rounded p-2 bg-white relative">
                  <span className="absolute top-1 left-2.5 text-[9px] uppercase font-bold text-slate-400">Ida</span>
                  <input type="date" required value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full text-sm outline-none pt-3 pb-0.5 font-semibold" />
                </div>
                <div className="lg:col-span-2 border border-slate-300 rounded p-2 bg-white relative">
                  <span className="absolute top-1 left-2.5 text-[9px] uppercase font-bold text-slate-400">Vuelta</span>
                  <input type="date" required value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={departureDate} className="w-full text-sm outline-none pt-3 pb-0.5 font-semibold" />
                </div>
                <div className="lg:col-span-2 border border-slate-300 rounded p-2 bg-white relative">
                  <span className="absolute top-1 left-2.5 text-[9px] uppercase font-bold text-slate-400">Pasajeros</span>
                  <button type="button" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)} className="w-full text-left font-semibold text-sm pt-3 pb-0.5 bg-transparent border-none cursor-pointer">
                    {adults} ad, {children} ni, {infants} bb
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={handleClearSearch} className="w-full sm:w-auto bg-slate-100 text-slate-600 font-bold py-3 sm:py-2 px-5 rounded-full border-none cursor-pointer text-xs uppercase text-center">Limpiar</button>
                <button type="submit" className="w-full sm:w-auto bg-[#511365] text-white font-bold py-3 sm:py-2 px-6 rounded-full border-none cursor-pointer text-xs uppercase text-center">Planificar {activeTab}</button>
              </div>
            </div>
          </form>

          {/* OPCIONES RECOMENDADAS */}
          {hasSearched && (
            <div className="mt-6 bg-white/95 rounded-xl p-6 shadow-xl border border-slate-200 animate-fadeIn font-sans">
              <h3 className="font-black text-sm text-[#511365] uppercase mb-4 border-b pb-2">📍 Opciones Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getMockResults().map((result) => (
                  <div key={result.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                    <img src={result.image} alt={result.title} className="w-full h-36 object-cover" />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs mb-1">{result.title}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mb-3">{result.detail}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <span className="block text-[8px] font-extrabold text-[#10b981] bg-emerald-50 px-1.5 py-0.5 rounded">{result.extra}</span>
                          <span className="text-sm font-black text-[#511365] block mt-0.5">{result.price}</span>
                        </div>
                        <button type="button" onClick={() => handleSelectBooking(result.title, result.detail, result.price, result.image)} className="bg-[#10b981] text-white font-bold text-[10px] py-1.5 px-3 rounded-full border-none cursor-pointer">Elegir</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INDICADOR DE CARGA */}
          {isLoading && (
            <div className="mt-8 text-center animate-pulse">
              <span className="text-[#511365] font-bold text-sm bg-purple-100 px-4 py-2 rounded-full">
                ⏳ Sincronizando reservas con el servidor...
              </span>
            </div>
          )}

          {/* SECCIÓN FILTROS Y APARTADO DE MIS RESERVAS */}
          {reservations.length > 0 && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-2xl border-2 border-emerald-400 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 mb-4">
                <h3 className="font-black text-base text-slate-900 uppercase">💼 Mis Reservas Realizadas</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Filtradas: {filteredReservations.length}</span>
              </div>

              {/* BARRA DE FILTROS */}
              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <input 
                  type="text" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Buscar por destino o localizador..." className="md:col-span-4 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none"
                />
                <div className="md:col-span-8 flex flex-wrap gap-1.5 justify-end">
                  {['todos', 'vuelos', 'hoteles', 'vuelo-hotel-coche', 'trenes', 'coches'].map((cat) => (
                    <button key={cat} type="button" onClick={() => setFilterType(cat)} className={`px-2.5 py-1.5 rounded text-xs font-bold border-none cursor-pointer ${filterType === cat ? 'bg-[#511365] text-white' : 'bg-white border text-slate-600'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 bg-slate-950 text-white rounded-xl p-3 flex justify-between text-xs">
                <span>Presupuesto total acumulado:</span>
                <span className="font-black text-emerald-400">{totalSpent} {selectedCurrency.symbol}</span>
              </div>

              {/* LISTA DINÁMICA DE ITINERARIOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredReservations.map((res) => (
                  <div key={res.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between shadow-sm animate-fadeIn">
                    {res.image && <img src={res.image} alt={res.title} className="w-full h-24 object-cover" />}
                    <div className="p-3">
                      <span className="text-[9px] font-extrabold text-[#511365] uppercase block">{res.type}</span>
                      <h4 className="font-bold text-slate-800 text-xs leading-tight mb-1">{res.title}</h4>
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

      {/* FOOTER CREATIVO INSTITUCIONAL */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 px-6 font-sans border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="text-emerald-400">🌐</span> RouteCraft Inc.
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              La plataforma global de enrutamiento inteligente que conecta aerolíneas, cadenas hoteleras y transportes en un solo ecosistema optimizado.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Asistencia Técnica</h4>
            <ul className="space-y-2 p-0 list-none text-[11px]">
              <li className="flex items-center gap-2">📞 <span className="text-slate-300 font-medium">900 839 201 (Gratuito)</span></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}