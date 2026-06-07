# Metodologías de Desarrollo

## 1. ¿Qué es Agile y cuál es su objetivo?
Agile (o metodologías ágiles) no es una herramienta, sino una filosofía o mentalidad de trabajo para desarrollar software. Su objetivo principal es poder adaptarnos rápidamente a los cambios y entregar valor al cliente de forma constante. En lugar de pasar meses planificando y construyendo algo a ciegas (para descubrir al final que al cliente no le gusta), Agile propone hacer entregas pequeñas y funcionales poco a poco. Así podemos recibir *feedback* continuo y ajustar el rumbo del proyecto sobre la marcha.

## 2. ¿Qué es Scrum y sus conceptos principales?
Scrum es uno de los marcos de trabajo concretos que existen dentro de la filosofía Agile. Es bastante estructurado y divide el trabajo en ciclos cortos de tiempo fijo. Sus conceptos clave son:

* **Sprints:** Son iteraciones o ciclos de trabajo cortos (normalmente de 2 a 4 semanas). Al final de cada Sprint, el equipo debe entregar una parte del producto que funcione.
* **Roles:** * *Product Owner:* Representa al cliente. Decide qué se va a hacer y prioriza las tareas.
    * *Scrum Master:* Es el facilitador del equipo. Ayuda a eliminar obstáculos y asegura que se entienda y respete el proceso Scrum.
    * *Developers (Equipo de desarrollo):* Los profesionales que construyen el producto.
* **Backlog:**
    * *Product Backlog:* La lista general con todo lo que se quiere hacer en el proyecto a largo plazo.
    * *Sprint Backlog:* Las tareas específicas que el equipo se compromete a terminar en el Sprint actual.
* **Reviews (y otros eventos):** Al final del Sprint se hace una *Sprint Review* para mostrar el trabajo terminado al cliente, y una *Retrospectiva* para analizar como equipo qué fue bien y qué se puede mejorar para el siguiente ciclo.

## 3. ¿Qué es Kanban y cómo se usa?
Kanban es otra metodología ágil, pero es mucho más visual y flexible que Scrum. Se basa en un tablero dividido en columnas que representan las fases del trabajo (por ejemplo: "Por hacer", "En progreso", "En revisión", "Hecho"). 
Para organizar las tareas, se van moviendo tarjetas (que representan el trabajo) de izquierda a derecha por el tablero. Su regla de oro es limitar el "Trabajo en Progreso" (WIP - *Work In Progress*). Es decir, no se puede empezar una tarea nueva si no se ha terminado o movido la anterior, evitando así que el equipo se sature de cosas a medias.

## 4. Diferencias entre Scrum y Kanban
* **Tiempos:** Scrum se basa en bloques de tiempo estrictos (Sprints que empiezan y terminan). Kanban es un flujo continuo de trabajo; no hay "Sprints", las tareas entran y salen constantemente.
* **Roles:** Scrum tiene roles muy marcados y obligatorios (Product Owner, Scrum Master). Kanban no impone ningún rol específico, se adapta al equipo que ya existe.
* **Flexibilidad:** En Scrum, una vez que empieza el Sprint, no se deberían añadir tareas nuevas para no romper el objetivo. En Kanban, puedes añadir tareas nuevas a la columna de "Por hacer" en cualquier momento, siempre que se respete el límite de trabajo en curso.
* **El Tablero:** El tablero Scrum se "limpia" y se reinicia en cada nuevo Sprint. El tablero Kanban es permanente y la vida del proyecto fluye por él sin reinicios.

## 5. ¿Cuándo usar cada metodología?
* **Cuándo usar Scrum:** Es ideal para proyectos grandes, complejos y nuevos donde se requiere mucha estructura y planificación. Funciona muy bien cuando construyes un producto desde cero y necesitas ir mostrando avances al cliente cada dos semanas para saber si vas por el buen camino.
* **Cuándo usar Kanban:** Es perfecto para proyectos de mantenimiento, soporte técnico o equipos donde el trabajo es impredecible y las prioridades cambian a diario. Si tienes que resolver *bugs* constantes o tareas pequeñas que van surgiendo sobre la marcha, Kanban es mejor porque te permite reaccionar al instante sin esperar a que termine un "Sprint".