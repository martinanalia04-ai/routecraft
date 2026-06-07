# Diseño de Arquitectura - RouteCraft 🌍

Este documento detalla las decisiones técnicas, la estructura de componentes, la estrategia de gestión de estado y el diseño de la API REST para el MVP de RouteCraft.

---

## 🏗️ 1. Estructura de Componentes Principales

La interfaz se divide en vistas principales (páginas) y componentes modulares organizados de forma jerárquica:

### Páginas (`src/pages/`)
* **`Dashboard`**: Vista principal. Muestra el formulario de creación de viajes y el listado de tarjetas de viajes planificados.
* **`TripDetails`**: Vista detallada de un viaje específico (itinerarios, mapa conceptual, presupuestos y control de gastos).

### Componentes Reutilizables (`src/components/`)
* **`Navbar`**: Barra de navegación superior fija con enlaces de secciones y branding.
* **`TripCard`**: Tarjeta visual para listar viajes en el Dashboard (muestra destino, fechas, presupuesto resumido y botón de eliminar/ver más).
* **`TripForm`**: Formulario controlado para añadir o editar destinos (campos: nombre, destino, presupuesto, fechas, estado).
* **`Button` / `Input` / `Select`**: Componentes atómicos de UI estilizados de forma homogénea con Tailwind CSS.

---

## 🔄 2. Gestión del Estado

Para mantener la aplicación ágil, desacoplada y escalable, se implementa una estrategia de estado mixto:

* **Estado Local (`useState`)**: Utilizado de forma exclusiva en formularios (`TripForm`) y componentes interactivos pequeños (modales, toggles de menús) donde los datos no interesan al resto de la aplicación.
* **Estado Global (React Context API)**: Se crea un `TripContext` que envuelve la aplicación para proveer el array de viajes (`trips`), las funciones de mutación (`addTrip`, `deleteTrip`, `updateTrip`) y el estado de carga/errores de la API de forma global.

---

## 🌐 3. Diseño del Backend e Interfaz de la API (REST)

El backend expone una API REST bajo el prefijo `/api/v1` encargada de gestionar los recursos de los viajes.

### Recursos, Verbos y Contratos de Datos

| Recurso | Verbo HTTP | Descripción | Respuesta (JSON) / Estado |
| :--- | :--- | :--- | :--- |
| `/api/v1/trips` | `GET` | Obtiene todos los viajes creados | `[ { id, title, destination, budget, startDate, endDate, status } ]` (200 OK) |
| `/api/v1/trips` | `POST` | Registra un nuevo viaje | Recibe el objeto del viaje. Devuelve `{ message, trip: { id, ... } }` (201 Created) |
| `/api/v1/trips/:id` | `PUT` | Actualiza un viaje existente | Recibe los campos modificados. Devuelve del objeto actualizado (200 OK) |
| `/api/v1/trips/:id` | `DELETE` | Elimina un viaje por ID | `{ message: "Viaje eliminado correctamente" }` (200 OK) |

---

## 💾 4. Estrategia de Persistencia (Cliente vs Servidor)

### Persistido en el Servidor (Base de Datos / Backend)
* Datos estructurales del viaje (ID, Título, Destino, Presupuesto total).
* Cronograma o fechas (`startDate`, `endDate`).
* Estado actual del viaje (`Planificado`, `En Curso`, `Completado`).

### Persistido en el Cliente (Memoria / Estado de React)
* Estados visuales intermedios (si el formulario está abierto o cerrado).
* Filtros de búsqueda activos o criterios de ordenación en el Dashboard (ej. ordenar por fecha más cercana).
* Tokens de sesión temporales o estados de carga (`isLoading`).

---

## 📊 5. Diagrama de Flujo de Datos

```text
+------------------------------------------------------------+
|                        FRONTEND (React)                    |
|                                                            |
|  [ Vista UI ] ----(Dispara Acción)----> [ TripContext ]     |
|       ^                                      |             |
|       | (Actualiza Estado)                   | (Petición)  |
|       |                                      v             |
|  [ Estado Local ]                      [ Axios / Fetch ]   |
+----------------------------------------------|-------------+
                                               |
                                        HTTP Request / JSON
                                               |
+----------------------------------------------|-------------+
|                        BACKEND (Express)     v             |
|                                                            |
|  [ Routes ] ----> [ Controllers ] ----> [ Services ]       |
|                                                |           |
|                                         (Query DB)         |
|                                                v           |
|                                         [ Base de Datos ]  |
+------------------------------------------------------------+