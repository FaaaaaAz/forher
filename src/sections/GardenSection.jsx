import GardenPreview from '../components/Garden/GardenPreview.jsx';

export default function GardenSection({ season }) {
  return (
    <section className="chapter" id="garden" aria-labelledby="garden-title">
      <span className="chapter__number">02 / 05</span>
      <div><p className="chapter__eyebrow">EL JARDÍN DE HOY</p><h2 id="garden-title">{season.label}</h2><GardenPreview season={season} /></div>
      <span className="chapter__mark" aria-hidden="true">✳</span>
    </section>
  );
}
