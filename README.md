# Fabian & Grace

Un espacio para nuestra historia. Está construido con React, Vite, JavaScript, CSS y Motion. Incluye recuerdos, un contador de la relación y decoraciones que cambian con la fecha.

## Ejecutar

```bash
npm install
npm run dev
```

Para comprobar la compilación:

```bash
npm run build
```

## Estructura

- `src/components/`: piezas visuales de la introducción y componentes preparados para cada capítulo.
- `src/sections/`: secciones semánticas de la historia.
- `src/styles/`: colores y tipografía, animaciones y estilos globales.
- `src/services/memories.js`: carga fotos y videos desde Supabase y usa los nombres del bucket cuando la tabla aún está vacía.
- `api/memories.js`: crea enlaces de subida y guarda descripciones con un código compartido que se comprueba en el servidor.
- `src/assets/images/`: las 33 fotografías de la galería local. Están excluidas de Git por privacidad.
- `public/images/`: espacio para otros archivos públicos que se agreguen más adelante.
- `public/music/`: espacio para música local futura.
- `src/App.jsx`: estado de apertura y transición inicial.
- `src/main.jsx`: entrada de React.

## Preparación para datos futuros

La galería usa las fotos de `src/assets/images/` localmente y el bucket público de Supabase en el deploy cuando se configuran `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. Si `memories` tiene registros, sus textos y orden tienen prioridad; si está vacía, se muestran las 33 fotos del bucket. El contador parte del 28/04/2024 y calcula los días según la fecha de Bolivia. La decoración cambia automáticamente entre flores amarillas, Halloween y las estaciones del hemisferio sur. Sigue la guía [Supabase y Vercel](docs/SUPABASE_VERCEL.md) para configurar la base de datos y desplegar la web.

**Fotos y despliegue:** las 33 fotos están solo en esta computadora. Para verlas en Vercel, súbelas primero a Supabase siguiendo la guía; no se envían a GitHub.

Para añadir recuerdos desde la web, configura `MEMORY_ADMIN_CODE` (mínimo 12 caracteres) y `SUPABASE_SERVICE_ROLE_KEY` únicamente como variables de servidor en Vercel. El código se introduce una vez por dispositivo; no se incluye en el repositorio ni en las variables `VITE_`. Lee [la guía de configuración](docs/SUPABASE_VERCEL.md#añadir-y-editar-recuerdos-desde-la-web).
