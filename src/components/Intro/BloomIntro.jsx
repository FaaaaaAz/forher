import Seedling from '../Garden/Seedling.jsx';

export default function BloomIntro({ season }) {
  return (
    <section className="bloom-intro" aria-labelledby="bloom-title">
      <div className="bloom-intro__topline">
        <span className="wordmark"><span className="wordmark__symbol" aria-hidden="true">✳</span> PROJECT BLOOM</span>
        <div className="bloom-intro__topright"><span className="season-label">{season.label}</span><span className="chapter-count">01 / 05</span></div>
      </div>

      <div className="bloom-intro__content">
        <div className="bloom-intro__copy">
          <p className="eyebrow"><span className="eyebrow__line" /> CAPÍTULO UNO · EL COMIENZO</p>
          <h1 id="bloom-title">Todo empieza<br />con <em>una semilla.</em></h1>
          <p className="bloom-intro__description">Una pequeña historia para guardar lo que hemos vivido y dejar espacio a todo lo que aún puede florecer.</p>
          <a className="text-link" href="#garden">Explorar la historia <span aria-hidden="true">↓</span></a>
        </div>
        <div className="bloom-intro__art">
          <div className="bloom-intro__art-ring" aria-hidden="true" />
          <Seedling />
          <span className="bloom-intro__art-caption">01 — PRIMER BROTE</span>
        </div>
      </div>

      <p className="bloom-intro__bottom">DESLIZA PARA DESCUBRIR <span aria-hidden="true">↓</span></p>
    </section>
  );
}
