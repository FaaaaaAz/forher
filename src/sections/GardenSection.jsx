export default function GardenSection() {
  return (
    <section className="garden-section" id="garden" aria-labelledby="garden-title">
      <div className="garden-section__copy"><p className="chapter__eyebrow">UN DETALLE PARA TI</p><h2 id="garden-title">Unas flores <em>para Grace.</em></h2><p>Aquí guardaré la foto de las flores que te regalaré hoy. Un pequeño recuerdo de este día.</p></div>
      <div className="garden-section__frame" aria-label="Espacio reservado para la foto de las flores"><span aria-hidden="true">✿</span><p>Pronto, nuestras flores aquí</p></div>
    </section>
  );
}
