import { useRef } from 'react';

// Emblema de la película (la serpiente y el ave alrededor de la corona) como silueta vectorial de un
// solo color: nítida a cualquier tamaño. La forma vive en assets/cosecha/silueta.svg y se pinta con CSS.
// Cambia de sentido según dónde aparece: en la periferia es una silueta pintada a escondidas;
// en el centro, un adorno dorado.
export default function BirdMark({ variant = 'resistance', className = '' }) {
  return <span className={`bird-mark bird-mark--${variant} ${className}`} aria-hidden="true" />;
}

// Emblema grande de la portada de la historia. En reposo queda plano; se inclina en 3D solo
// mientras el dedo o el mouse pasan encima.
export function BirdEmblem() {
  const ref = useRef(null);

  function tilt(event) {
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.classList.add('is-tilting');
    ref.current.style.setProperty('--tilt-y', `${(x * 28).toFixed(2)}deg`);
    ref.current.style.setProperty('--tilt-x', `${(-y * 22).toFixed(2)}deg`);
  }

  function reset() {
    ref.current.classList.remove('is-tilting');
    ref.current.style.setProperty('--tilt-y', '0deg');
    ref.current.style.setProperty('--tilt-x', '0deg');
  }

  return (
    <div className="movie-emblem" ref={ref} onPointerMove={tilt} onPointerLeave={reset} role="img" aria-label="Silueta dorada del emblema: una serpiente y un ave frente a frente alrededor de una corona, con las iniciales de Fabian y Grace">
      <span className="movie-emblem__rays" aria-hidden="true" />
      <span className="movie-emblem__glow" aria-hidden="true" />
      <div className="movie-emblem__stage" aria-hidden="true">
        <div className="movie-emblem__tilt">
          <span className="movie-emblem__shadow" />
          <span className="movie-emblem__shape" />
        </div>
      </div>
      <span className="movie-emblem__initials" aria-hidden="true"><b>F</b><i>&amp;</i><b>G</b></span>
    </div>
  );
}
