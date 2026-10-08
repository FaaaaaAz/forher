import { memoryImageUrl, memoryUrl } from '../../services/supabase.js';

// Foto de Supabase en el tamaño justo. Si una versión falla (sin internet o sin miniaturas),
// prueba la siguiente: tamaño de respaldo (normalmente ya guardado) y al final el original.
export default function MemoryImage({ path, src, width, fallbackWidth, alt, ...props }) {
  if (!path) return <img src={src} alt={alt} decoding="async" {...props} />;
  const sources = [memoryImageUrl(path, width), fallbackWidth && memoryImageUrl(path, fallbackWidth), memoryUrl(path)].filter(Boolean);

  function tryNext(event) {
    const image = event.currentTarget;
    const next = Number(image.dataset.source || 0) + 1;
    if (next >= sources.length) return;
    image.dataset.source = String(next);
    image.src = sources[next];
  }

  return <img src={sources[0]} alt={alt} decoding="async" onError={tryNext} {...props} />;
}
