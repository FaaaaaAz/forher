# Project Bloom

Una base frontend para una historia romántica que comienza con una semilla. Está construida con React, Vite, JavaScript, CSS puro y Motion para la transición entre pantallas.

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
- `src/services/memories.js`: punto de conexión para cargar recuerdos desde una API futura.
- `src/assets/images/`: imágenes importadas desde JavaScript cuando se necesiten.
- `public/images/`: fotografías que se agregarán más adelante; se podrán referenciar como `/images/nombre.jpg`.
- `public/music/`: espacio para música local futura.
- `src/App.jsx`: estado de apertura y transición inicial.
- `src/main.jsx`: entrada de React.

## Preparación para datos futuros

Esta versión no requiere base de datos ni servidor: no guarda datos todavía. Para conectar un backend, se puede configurar `VITE_API_BASE_URL` a partir de `.env.example`. `getMemories()` solicitará `GET /memories`; la galería futura podrá usar esa respuesta. Un recuerdo puede tener `id`, `imageUrl`, `alt`, `caption` y `date`. El backend podrá persistir las imágenes en almacenamiento y devolver su URL en `imageUrl`; las fotografías locales de `public/images/` sirven mientras se desarrolla esa integración.
