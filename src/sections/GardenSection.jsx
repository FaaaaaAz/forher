import GardenPreview from '../components/Garden/GardenPreview.jsx';

export default function GardenSection() {
  return (
    <section className="chapter" id="garden" aria-labelledby="garden-title">
      <span className="chapter__number">02 / 05</span>
      <div><p className="chapter__eyebrow">PRÓXIMAMENTE</p><h2 id="garden-title">El jardín</h2><GardenPreview /></div>
      <span className="chapter__mark" aria-hidden="true">✳</span>
    </section>
  );
}
