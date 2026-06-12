# Documentación de API - RouteCraft

## Endpoints del Backend
El backend se ejecuta en `http://localhost:3000` y gestiona las reservas y los itinerarios.

### 1. Reservas (`/api/reservations`)
* **GET**: Recupera el listado de reservas almacenadas[cite: 22].
* **POST**: Crea una nueva reserva desde el buscador[cite: 22].
* **DELETE**: Elimina una reserva mediante su ID[cite: 22].

### 2. Itinerarios (`/api/trips`)
* **GET**: Obtiene todos los viajes planificados.
* **POST**: Registra un nuevo viaje en la memoria del servidor.
* **DELETE**: Borra un itinerario específico.

## Estructura de Datos
* **Reservation**: Objeto que contiene id, title, detail, price, origin, destination, departureDate, returnDate, locator, status, type, y una imagen opcional[cite: 26].
* **Trip**: Objeto que contiene id, title, destination, startDate, endDate, budget, status, y description.