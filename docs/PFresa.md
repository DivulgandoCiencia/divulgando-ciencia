# ⚙️ PFRESA — Sistema de Renderizado Híbrido para DivulgandoCiencia

**PFRESA** es un sistema de **renderizado y enrutado mixto** diseñado exclusivamente para **DivulgandoCiencia**. Su objetivo es combinar la eficiencia del prerenderizado estático con la flexibilidad del SSR de Astro, reduciendo drásticamente el trabajo del servidor mientras el frontend mantiene una experiencia fluida y dinámica.

---

## 🚀 Propósito y contexto

En un entorno como Astro SSR, cada página dinámica requiere renderizado desde el servidor, lo que incrementa el tiempo de respuesta y el coste de procesamiento. PFRESA redefine esta arquitectura implementando una **división entre backend y frontend**, donde cada capa cumple un rol específico:

* El **backend** prerenderiza la mayoría del contenido en la build.
* El **frontend** gestiona la navegación, el almacenamiento de datos, las plantillas y el renderizado parcial de contenido dinámico.

De esta forma, PFRESA logra mantener la estructura SSR solo donde realmente se necesita, reduciendo las peticiones servidoras a un mínimo y mejorando la experiencia del usuario.

---

## 🧠 Cómo funciona PFRESA

PFRESA se apoya en cuatro pilares fundamentales:

### 1. 🏗️ Prerenderizado selectivo

Durante la build de Astro, el sistema analiza las rutas y **genera versiones estáticas** del contenido que no requiere renderizado dinámico. Esto incluye artículos, secciones informativas y componentes comunes.

Así, más del **90% del contenido se genera estáticamente**, dejando únicamente **dos rutas** bajo SSR (las relacionadas con datos dinámicos o APIs).

### 2. 🛰️ Minimización del SSR

PFRESA intercepta las peticiones mediante un router interno. Cuando una página puede servirse desde cache o prerenderizado, se hace **sin consultar al servidor**. Solo las rutas críticas o con contenido cambiante se mantienen en modo SSR.

Esto reduce drásticamente el consumo del backend, manteniendo la flexibilidad del renderizado dinámico solo cuando es necesario.

### 3. 💾 Capa de frontend inteligente

El frontend en PFRESA no es pasivo: actúa como una capa de control que **cachea, renderiza y actualiza** el contenido dinámico. Entre sus funciones:

* **Almacenamiento en caché** de datos y páginas renderizadas.
* **Rehidratación automática** del contenido cuando hay conexión disponible.
* **Renderizado incremental**: el HTML prerenderizado se complementa con los datos que llegan desde la API.
* **Transiciones fluidas entre páginas**, sin recargar por completo la interfaz.

De esta forma, el navegador asume parte del trabajo del servidor, ofreciendo una navegación casi instantánea.

### 4. 🧩 Plantillas y tipos de página

PFRESA utiliza un sistema de **plantillas reutilizables** para los distintos tipos de página del sitio (artículos, categorías, autores, secciones, etc.). Esto permite:

* Mantener una estructura visual coherente y ligera.
* Renderizar el contenido dinámico dentro de plantillas ya cargadas.
* Reducir el tiempo de renderizado y el tamaño de las respuestas.

El sistema se apoya en **una única request inicial**: después de esa primera carga, toda la navegación se gestiona internamente. PFRESA actualiza las plantillas y los datos dinámicos **sin volver a solicitar el HTML completo** al servidor.

---

## 🔩 Arquitectura técnica

PFRESA redefine el ciclo de carga tradicional:

```
Cliente → PFRESA Router → Cache → Prerenderizado (Build) → SSR (Fallback)
```

### 🔹 Enrutado interno (Client Router)

El client router de PFRESA intercepta las rutas internas y determina si puede resolverlas:

* **Ruta prerenderizada:** se sirve directamente desde cache o desde el bundle local.
* **Ruta dinámica:** se solicita al servidor y se almacena para futuras visitas.

La navegación ocurre en una única sesión, sin recargar la página, manteniendo el estado del frontend y los datos almacenados. Esto hace que la experiencia sea **fluida, persistente y eficiente**.

### 🔹 Integración con Astro SSR

Mientras Astro SSR maneja las rutas tradicionales en el servidor, PFRESA actúa como un sistema paralelo de prerenderizado inteligente. Gracias a su diseño, ambos pueden coexistir sin conflictos.

---

## 🧮 Diferencias clave: Astro SSR vs PFRESA

| Característica          | Astro SSR                     | PFRESA                              |
| ----------------------- | ----------------------------- | ----------------------------------- |
| Renderizado             | En servidor en cada petición  | Estático + Dinámico híbrido         |
| Carga inicial           | Más lenta por renderizado SSR | Instantánea en la mayoría de rutas  |
| Dependencia del backend | Alta                          | Mínima                              |
| Cache                   | No nativo                     | Integrada y gestionada por frontend |
| Transiciones            | Recarga completa              | Client routing suave                |
| Actualizaciones         | Requiere nueva build o SSR    | Automáticas desde cache o API       |
| Navegación              | Varias requests               | Una sola request por sesión         |

---

## 📊 Resultados en DivulgandoCiencia

* **>90%** del sitio prerenderizado en build.
* Solo **2 rutas SSR activas.**
* Carga promedio inferior a **200ms** en páginas prerenderizadas.
* Reducción de hasta **70% en peticiones servidoras repetidas.**
* Navegación completa gestionada en **una sola sesión.**

PFRESA ha permitido que **DivulgandoCiencia** funcione como una web estática en la práctica, pero manteniendo las capacidades de actualización y renderizado dinámico propias de un entorno SSR.

---

## 🔮 Conclusión

PFRESA no es solo una capa de optimización: es una **arquitectura completa** pensada para proyectos híbridos como DivulgandoCiencia. Su integración con Astro combina lo mejor del SSR, el prerenderizado y el client routing avanzado, logrando un equilibrio entre **rendimiento, interactividad y resiliencia.**