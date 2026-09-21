# Project Bloom

Una historia romántica que comienza con una semilla. Está construida con React, Vite, JavaScript, CSS puro y Motion. Incluye las fotografías, un contador de la relación y decoraciones que cambian con la fecha.

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
- `src/services/memories.js`: carga recuerdos locales o, cuando se configure, desde Supabase.
- `src/assets/images/`: las 33 fotografías de la galería local. Están excluidas de Git por privacidad.
- `public/images/`: espacio para otros archivos públicos que se agreguen más adelante.
- `public/music/`: espacio para música local futura.
- `src/App.jsx`: estado de apertura y transición inicial.
- `src/main.jsx`: entrada de React.

## Preparación para datos futuros

La galería usa las fotos de `src/assets/images/` y puede leer una tabla `memories` de Supabase cuando se configuran `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. El contador parte del 28/04/2024 y calcula los días según la fecha de Bolivia. La decoración cambia automáticamente entre flores amarillas, Halloween y las estaciones del hemisferio sur. Sigue la guía [Supabase y Vercel](docs/SUPABASE_VERCEL.md) para configurar la base de datos y desplegar la web.

**Fotos y despliegue:** las 33 fotos están solo en esta computadora. Para verlas en Vercel, súbelas primero a Supabase siguiendo la guía; no se envían a GitHub.
