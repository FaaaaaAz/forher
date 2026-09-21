import FinalPreview from '../components/Final/FinalPreview.jsx';

export default function FinalSection() {
  return (
    <section className="chapter" id="final" aria-labelledby="final-title">
      <span className="chapter__number">05 / 05</span>
      <div><p className="chapter__eyebrow">ESTO CONTINÚA</p><h2 id="final-title">Y todo lo que viene...</h2><FinalPreview /></div>
      <span className="chapter__mark" aria-hidden="true">∞</span>
    </section>
  );
}
