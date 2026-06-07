# Documentación de Integración: API y Estado Global

## 1. Arquitectura de Servicios
- **Archivo:** `src/api/tripService.ts`
- **Propósito:** Centralizar las peticiones HTTP (`fetch`). Esta capa actúa como un puente entre la lógica de negocio y el servidor, permitiendo que la aplicación sea más fácil de mantener al separar la URL y la configuración de las peticiones del resto de la interfaz.

## 2. Flujo de Datos (Data Flow)
El ciclo de vida de los datos sigue un orden estructurado para garantizar la reactividad y la consistencia:
1. **Carga Inicial:** Al montar la aplicación, `TripProvider` invoca la función `fetchTrips` mediante un hook `useEffect`.
2. **Estado Global:** Los datos obtenidos se almacenan en el estado centralizado (`trips`) dentro de React Context.
3. **Consumo:** Los componentes (como `TripList` o `Dashboard`) acceden a los datos mediante el hook personalizado `useTrips()`, evitando la propagación innecesaria de props (*prop drilling*).

## 3. Manejo de Tipos y Rendimiento
- **Integridad:** Se utiliza la interfaz `Trip` definida en `src/types/trip.ts` como contrato único, asegurando que los datos cumplan con el formato esperado en toda la aplicación.
- **Optimización:** Se han implementado *type-only imports* (`import type`) en todas las capas de la aplicación, lo que optimiza el proceso de compilación al indicar a TypeScript que dichos elementos no requieren espacio en memoria durante la ejecución en el navegador.