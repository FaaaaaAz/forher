import MemoriesPreview from '../components/Memories/MemoriesPreview.jsx';

export default function MemoriesSection() {
  return (
    <section className="memories-section" id="memories" aria-labelledby="memories-title">
      <div className="memories-section__heading">
        <div>
          <p className="chapter__eyebrow">NUESTROS MOMENTOS</p>
          <h2 id="memories-title">Instantes que <em>guardamos.</em></h2>
          <p>Fabian y Grace, en los días que queremos volver a vivir.</p>
        </div>
        <span className="memories-section__symbol" aria-hidden="true">✦</span>
      </div>
      <MemoriesPreview />
    </section>
  );
}
