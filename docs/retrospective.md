# 📝 Retrospectiva Técnica - Fase 5: Integración de la Capa de Red y Control de Flujos

## 1. Objetivos de la Fase
El propósito fundamental de esta fase ha sido migrar la aplicación de un modelo de persistencia local estático (estados en memoria aislados en React) a una arquitectura distribuida real Cliente-Servidor mediante peticiones HTTP asíncronas (`fetch`), garantizando la resiliencia de la interfaz ante fallos de comunicación y validando datos en las fronteras de red.

---

## 2. Desafíos Técnicos Encontrados y Soluciones Aplicadas

### A. Conflicto de Puertos y CORS (Cross-Origin Resource Sharing)
* **Problema:** Al intentar comunicar el frontend (Vite/React) con el backend (Express/Node) en `http://localhost:3000`, el navegador bloqueaba las peticiones por políticas de seguridad del mismo origen (CORS). Además, se detectó el riesgo latente de colisión si ambos entornos intentaban levantar en el mismo puerto.
* **Solución:** Se integró de manera estricta el middleware `cors()` en la inicialización de Express (`index.ts`) para habilitar el intercambio seguro de recursos. Se separaron explícitamente los entornos: Servidor corriendo de forma aislada en el puerto `3000` y el cliente operando en su propio puerto asignado por Vite, comunicándose mediante URLs absolutas.

### B. Consistencia de Tipos en la Frontera de Red (String vs Number)
* **Problema:** Los formularios HTML capturan de forma nativa los inputs numéricos (como el presupuesto `budget`) en formato de texto (`string`). Si se enviaba este tipo de dato crudo al Backend, rompía el tipado de TypeScript definido en la interfaz `Trip` y la estructura interna del servicio.
* **Solución:** Se implementó una conversión explícita en la frontera de red del cliente (`TripForm.tsx`) ejecutando `budget: Number(budget)`. Esto asegura que los datos que cruzan la red cumplan al 100% con los contratos de tipos establecidos en ambas capas.

### C. Desacople en la API: Carga de Detalles Dinámicos
* **Problema:** El requerimiento exigía que la pantalla de detalles (`TripDetails.tsx`) mostrase información dinámica basada en el ID de la URL (`useParams`). Sin embargo, el controlador del servidor (`tripRoutes.ts`) carecía de un endpoint individual del tipo `GET /api/trips/:id`. Modificar el backend en este punto de la entrega suponía un riesgo crítico de regresión.
* **Solución:** Se diseñó una solución inteligente y resiliente en el cliente. El componente `TripDetails` consume el endpoint general `GET /api/trips`, evalúa el estado de red de la petición, y realiza una búsqueda de coincidencia exacta mediante `.find(t => t.id === id)` por software. Si el identificador no existe en la respuesta del servidor, el flujo lo intercepta y muestra de inmediato un error simulado de tipo `404 Destino No Encontrado` sin romper la app.

### D. Validación en Dos Capas (Client-Side & Server-Side Validation)
* **Problema:** Permitir que peticiones inválidas (campos vacíos o presupuestos negativos) viajen por la red satura el ancho de banda del servidor innecesariamente. Del mismo modo, si el servidor rechaza una petición (como un código `400 Bad Request` por falta de parámetros), el frontend no debe colgarse.
* **Solución:** Se blindó el envío en `TripForm.tsx` con una estructura de doble frontera:
  1. **En cliente:** Se bloquea el disparo de la petición si el presupuesto es `≤ 0` o faltan campos obligatorios.
  2. **En red:** Se evalúa la propiedad `response.ok`. Si el backend responde con un código de error, el bloque `catch` captura el JSON de rechazo del servidor y lo inyecta en el estado reactivo de la UI para feedback visual inmediato del usuario.

---

## 3. Control de Flujos Dinámicos Implementado
Para cumplir rigurosamente con los criterios de evaluación de la interfaz de usuario, cada componente conectado a red gestiona tres estados fundamentales y mutuamente excluyentes:
1. **Estado de Carga (`isLoading`):** Muestra indicadores visuales animados mientras la promesa del `fetch` sigue pendiente, impidiendo interacciones duplicadas.
2. **Estado de Error (`error`):** Si el servidor se cae (ej: caída del proceso Node), la aplicación renderiza un banner informativo estilizado con opción nativa de **"Reintentar Conexión"**, evitando pantallas en blanco.
3. **Estado de Éxito / Datos Listos:** Renderizado dinámico de tarjetas utilizando arrays reales mapeados desde la API o