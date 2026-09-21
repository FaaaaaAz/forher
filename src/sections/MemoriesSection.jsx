import MemoriesPreview from '../components/Memories/MemoriesPreview.jsx';

export default function MemoriesSection() {
  return (
    <section className="chapter" id="memories" aria-labelledby="memories-title">
      <span className="chapter__number">03 / 05</span>
      <div><p className="chapter__eyebrow">PRÓXIMAMENTE</p><h2 id="memories-title">Los recuerdos</h2><MemoriesPreview /></div>
      <span className="chapter__mark" aria-hidden="true">✦</span>
    </section>
  );
}
