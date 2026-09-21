import LetterPreview from '../components/Letter/LetterPreview.jsx';

export default function LetterSection() {
  return (
    <section className="letter-section" id="letter" aria-labelledby="letter-title">
      <p className="chapter__eyebrow">UNAS PALABRAS PARA TI</p>
      <h2 id="letter-title">Una carta para <em>Grace.</em></h2>
      <p>Hay cosas que se sienten mejor al escribirlas. Esta es una de ellas.</p>
      <LetterPreview />
    </section>
  );
}
