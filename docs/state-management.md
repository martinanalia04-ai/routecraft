# Gestión de Estado Global - RouteCraft

## Implementación
* **Context API**: Se ha implementado `TripContext` para centralizar el estado de los viajes (`trips`).
* **Hook personalizado**: `useTrips` simplifica el acceso a los datos desde cualquier componente sin necesidad de pasar props manualmente (prop drilling).

## Flujo de Datos
1. El `TripProvider` envuelve la raíz de la aplicación.
2. Los componentes consumen el estado mediante el hook `useTrips()`.
3. Las mutaciones (`addTrip`, `deleteTrip`) actualizan el estado global, provocando un re-render eficiente.