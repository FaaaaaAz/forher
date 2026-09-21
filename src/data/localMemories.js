const photoUrls = import.meta.glob('../assets/images/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const descriptions = [
  'Nosotros con máscaras divertidas frente a un espejo',
  'Un abrazo juntos frente a un espejo',
  'Nuestras manos entrelazadas',
  'Una selfie de los dos al aire libre',
  'Nosotros juntos bajo los árboles',
  'Un momento tranquilo al aire libre',
  'Compartiendo algo dulce',
  'Una selfie durante un paseo entre montañas',
  'Una selfie muy cerca el uno del otro',
  'Un abrazo frente al espejo',
  'Una tarde divertida juntos en casa',
  'Otro momento de esa tarde juntos',
  'Un beso con las montañas de fondo',
  'Caminando juntos por la montaña',
  'Juntos frente a un paisaje abierto',
  'Una selfie durante nuestra caminata',
  'Descansando juntos y sonriendo a la cámara',
  'Nosotros sentados juntos en casa',
  'Una selfie haciendo caras divertidas',
  'Una tarde compartida en el sofá',
  'Nosotros con ropa amarilla',
  'Una caminata de noche',
  'Un abrazo durante una salida nocturna',
  'Una selfie frente al espejo con flores',
  'Una foto juntos frente al espejo',
  'Un momento tierno con un perrito',
  'Otro momento tierno con un perrito',
  'Nosotros juntos en una salida',
  'Compartiendo bebidas y una sonrisa',
  'Una tarde juntos en la piscina',
  'Una cena compartida',
  'Una selfie de los dos rodeados de naturaleza',
  'Una foto especial para guardar',
];

const featuredOrder = [
  '5013046490745736540.jpg',
  '5013046490745736554.jpg',
  '5013046490745736539.jpg',
  '5013046490745736574.jpg',
];

export const localMemories = Object.entries(photoUrls)
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([path, imageUrl], index) => ({
    id: path,
    imageUrl,
    alt: descriptions[index] ?? `Recuerdo de nuestra historia ${index + 1}`,
    caption: '',
  }))
  .sort((first, second) => {
    const firstRank = featuredOrder.indexOf(first.id.split('/').pop());
    const secondRank = featuredOrder.indexOf(second.id.split('/').pop());
    if (firstRank !== -1 || secondRank !== -1) {
      return (firstRank === -1 ? Infinity : firstRank) - (secondRank === -1 ? Infinity : secondRank);
    }
    return first.id.localeCompare(second.id);
  });
