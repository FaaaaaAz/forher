import LetterPreview from '../components/Letter/LetterPreview.jsx';

export default function LetterSection() {
  return (
    <section className="letter-section" id="letter" aria-labelledby="letter-title">
      <p className="chapter__eyebrow">UNAS PALABRAS PARA TI</p>
      <h2 id="letter-title">El buzón de <em>nuestro amor.</em></h2>
      <p>Las palabras nuevas llegan aquí. Las que ya vivimos se quedan guardadas para volver a ellas.</p>
      <LetterPreview />
    </section>
  );
}
