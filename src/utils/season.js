import { getTimeTogether } from './dates.js';

function relationshipLabel(today) {
  const { years, months } = getTimeTogether(today);
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  if (months) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
  return parts.length ? `${parts.join(' y ')} juntos` : 'Nuestra historia comienza';
}

export function getSeason(today) {
  const { month } = today;

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
