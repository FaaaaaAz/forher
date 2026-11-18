import LoveEmblem from './LoveEmblem.jsx';
import { BirdEmblem } from '../Cosecha/BirdMark.jsx';
import CoupleBackdrop from '../Cosecha/CoupleBackdrop.jsx';

export default function BloomIntro({ season, onLogout }) {
  return (
    <section className="bloom-intro" aria-labelledby="bloom-title">
      {season.id === 'cosecha' && <CoupleBackdrop />}
      <div className="bloom-intro__topline">
        <span className="wordmark"><span className="wordmark__symbol" aria-hidden="true">♡</span> FABIAN &amp; GRACE</span>
        <div className="bloom-intro__topright"><button className="story-logout" type="button" onClick={onLogout}>Cerrar sesión</button></div>
      </div>

      <div className="bloom-intro__content">
        <div className="bloom-intro__copy">
          <p className="eyebrow"><span className="eyebrow__line" /> {season.id === 'halloween' ? 'OCTUBRE, NUESTRO LADO MÁS MÁGICO' : season.label.toUpperCase()}</p>
          {season.id === 'cosecha'
            ? <h1 id="bloom-title" className="bloom-intro__quote">“Quédate conmigo.”<br /><em>“Siempre.”</em></h1>
            : <h1 id="bloom-title">Lo bonito es<br /><em>vivirlo contigo.</em></h1>}
          <p className="bloom-intro__description">{season.message} Mañana tendrá nuevas páginas que escribir.</p>
          <p className="couple-signature couple-signature--story">Fabian <span>&amp;</span> Grace</p>
        </div>
        <div className="bloom-intro__art">
          <div className="bloom-intro__art-ring" aria-hidden="true" />
          {season.id === 'cosecha' ? <BirdEmblem /> : <LoveEmblem halloween={season.id === 'halloween'} />}
          <span className="bloom-intro__art-caption">{season.greeting}</span>
        </div>
      </div>

      <p className="bloom-intro__bottom">DESLIZA PARA DESCUBRIR <span aria-hidden="true">↓</span></p>
    </section>
  );
}
