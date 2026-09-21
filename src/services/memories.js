const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// La galería futura puede usar esta función sin cambiar los componentes visuales.
export async function getMemories() {
  if (!apiBaseUrl) return [];

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/memories`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los recuerdos.');
  }

  return response.json();
}
