import LetterPreview from '../components/Letter/LetterPreview.jsx';

export default function LetterSection() {
  return (
    <section className="chapter" id="letter" aria-labelledby="letter-title">
      <span className="chapter__number">04 / 05</span>
      <div><p className="chapter__eyebrow">PRÓXIMAMENTE</p><h2 id="letter-title">Una carta</h2><LetterPreview /></div>
      <span className="chapter__mark" aria-hidden="true">✉</span>
    </section>
  );
}
