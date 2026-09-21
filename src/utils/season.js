export function getSeason(today) {
  const { month, day } = today;

  if (month === 9 && day >= 21) {
    return {
      id: 'yellow-flowers',
      label: day === 21 ? 'Día del Amor · flores amarillas' : 'Flores amarillas para ti',
      motif: 'flower',
      message: day === 21 ? 'Hoy el jardín se viste de amarillo para ti.' : 'Las flores amarillas siguen creciendo para ti.',
    };
  }
  if (month === 10) {
    return { id: 'halloween', label: 'Halloween contigo', motif: 'pumpkin', message: 'Hasta las noches más mágicas son mejores contigo.' };
  }
  if (month === 12 || month <= 2) {
    return { id: 'summer', label: 'Verano juntos', motif: 'sun', message: 'Un poquito de sol para nuestros recuerdos.' };
  }
  if (month >= 3 && month <= 5) {
    return { id: 'autumn', label: 'Otoño juntos', motif: 'leaf', message: 'Cada estación tiene algo nuestro.' };
  }
  if (month >= 6 && month <= 8) {
    return { id: 'winter', label: 'Invierno juntos', motif: 'spark', message: 'También hay luz en los días fríos.' };
  }
  return { id: 'spring', label: 'Primavera juntos', motif: 'flower', message: 'Todo vuelve a florecer contigo.' };
}
