import { getTimeTogether } from './dates.js';

function relationshipLabel(today) {
  const { years, months } = getTimeTogether(today);
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  if (months) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
  return parts.length ? `${parts.join(' y ')} juntos` : 'Nuestra historia comienza';
}

// Dos días con el estilo de la película favorita de Grace, que vamos a ver juntos al cine.
// Para cambiar las fechas basta con editar esta lista.
export const MOVIE_DAYS = [
  { year: 2026, month: 11, day: 18 },
  { year: 2026, month: 11, day: 19 },
];

// Con ?tema=cosecha en la dirección se puede ver el estilo antes de esos días.
export const MOVIE_PREVIEW = 'cosecha';

function isMovieDay(today) {
  return MOVIE_DAYS.some(({ year, month, day }) => today.year === year && today.month === month && today.day === day);
}

export function getSeason(today, { preview } = {}) {
  const { month } = today;

  if (preview === MOVIE_PREVIEW || isMovieDay(today)) {
    return {
      id: 'cosecha',
      label: 'Noche de estreno, juntos',
      greeting: 'Una cita en el cine',
      motif: 'ember',
      message: 'Esta vez tu historia favorita se cuenta en la pantalla grande, y yo la voy a ver a tu lado.',
    };
  }

  if (month === 10) {
    return { id: 'halloween', label: 'Halloween contigo', greeting: 'Feliz Halloween', motif: 'pumpkin', message: 'Hasta las noches más mágicas son mejores contigo.' };
  }

  return {
    id: 'love',
    label: relationshipLabel(today),
    greeting: 'Nuestro amor, todos los días',
    motif: 'heart',
    message: 'Un lugar para celebrar lo que somos, recordar lo vivido y seguir eligiéndonos.',
  };
}
