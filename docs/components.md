# Documentación de Componentes - RouteCraft

## Componentes Implementados
1. **TripCard**: Componente de visualización para cada viaje. Recibe un objeto `Trip` por props.
2. **TripForm**: Formulario para crear o editar viajes. Usa composición para agrupar inputs.

## Estrategia de Estilos
* Se utiliza **Tailwind CSS** para un diseño responsivo y consistente.
* Los estados de interacción (hover, focus) se definen mediante clases utilitarias.

## Tipado
* Los componentes reciben interfaces definidas en `src/types/trip.ts`.