# RouteCraft 🌍

RouteCraft es una aplicación web Full-Stack diseñada para la planificación, personalización y gestión de rutas de viajes independientes. Permite a los usuarios organizar sus itinerarios, definir destinos, controlar presupuestos y gestionar de forma visual el estado de sus próximas aventuras.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **Vite + React**: Entorno de desarrollo rápido y biblioteca para construir la interfaz de usuario.
* **TypeScript**: Tipado estático para garantizar la escalabilidad y robustez del código.
* **Tailwind CSS**: Framework de CSS utilitario para un diseño de interfaz ágil, moderno y adaptable.
* **React Router Dom**: Gestión del enrutamiento del lado del cliente (Vistas de Dashboard y Detalles del Viaje).

### Backend (Arquitectura Inicial)
* **Node.js + Express**: Entorno de ejecución y framework para la construcción de la API REST.
* **Estructura Desacoplada**: Organización modular en capas (Rutas, Controladores, Servicios y Configuración) para facilitar el mantenimiento.

---

## 📋 Gestión del Proyecto y Metodología

El desarrollo de este proyecto se gestiona bajo metodologías ágiles inspiradas en el marco **Kanban**, garantizando un desarrollo iterativo enfocado en un MVP (Producto Mínimo Viable) funcional.

* **Tablero de Trello:** [Acceder al Tablero de Trello]
https://trello.com/b/ycD0YSEZ/proyecto-routecraft

### Estados del Flujo de Trabajo:
1. **Backlog**: Ideas, historias de usuario y requisitos iniciales del proyecto.
2. **Por Hacer (To Do)**: Tareas priorizadas listas para ser desarrolladas en el ciclo actual.
3. **En Progreso (In Progress)**: Tareas que se están desarrollando activamente.
4. **Bloqueado (Blocked)**: Elementos pausados debido a dependencias técnicas o de diseño.
5. **Hecho (Done)**: Funcionalidades totalmente completadas, estilizadas con Tailwind y testeadas.

---

## 📁 Estructura del Repositorio

El proyecto adopta una arquitectura de monorrepositorio organizada de la siguiente manera:
routecraft/
├── docs/                     # Documentación del proyecto (agile, gestión)
├── server/                   # Código fuente del Backend (API REST)
│   └── src/
│       ├── config/           # Configuración de base de datos y variables de entorno
│       ├── controllers/      # Lógica de control para gestionar peticiones HTTP
│       ├── routes/           # Definición de endpoints y rutas de la API
│       └── services/         # Lógica de negocio e interacción con los datos
└── src/                      # Código fuente del Frontend (Aplicación React)
├── api/                  # Clientes de servicios y llamadas a la API
├── components/           # Componentes de interfaz reutilizables
├── context/              # Estados globales de React
├── hooks/                # Custom hooks personalizados
├── pages/                # Páginas principales (Dashboard, TripDetails)
├── types/                # Definiciones de tipos e interfaces de TypeScript
└── utils/                # Funciones auxiliares y formateadores de datos
