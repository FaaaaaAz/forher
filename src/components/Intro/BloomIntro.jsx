import Seedling from '../Garden/Seedling.jsx';

export default function BloomIntro({ season }) {
  return (
    <section className="bloom-intro" aria-labelledby="bloom-title">
      <div className="bloom-intro__topline">
        <span className="wordmark"><span className="wordmark__symbol" aria-hidden="true">✿</span> FABIAN &amp; GRACE</span>
        <div className="bloom-intro__topright"><span className="season-label">{season.label}</span><span className="chapter-count">01 / 05</span></div>
      </div>

      <div className="bloom-intro__content">
        <div className="bloom-intro__copy">
          <p className="eyebrow"><span className="eyebrow__line" /> NUESTRA HISTORIA, EN CADA TEMPORADA</p>
          <h1 id="bloom-title">Lo bonito es<br /><em>vivirlo contigo.</em></h1>
          <p className="bloom-intro__description">Este rincón cambia con nosotros. {season.id === 'yellow-flowers' ? 'Hoy está lleno de flores amarillas, corazones y recuerdos.' : season.message} Mañana tendrá nuevas páginas que escribir.</p>
          <p className="couple-signature couple-signature--story">Fabian <span>&amp;</span> Grace</p>
          <a className="text-link" href="#garden">Explorar la historia <span aria-hidden="true">↓</span></a>
        </div>
        <div className="bloom-intro__art">
          <div className="bloom-intro__art-ring" aria-hidden="true" />
          <Seedling />
          <span className="bloom-intro__art-caption">PARA SEGUIR FLORECIENDO JUNTOS</span>
        </div>
      </div>

      <p className="bloom-intro__bottom">DESLIZA PARA DESCUBRIR <span aria-hidden="true">↓</span></p>
    </section>
  );
}
