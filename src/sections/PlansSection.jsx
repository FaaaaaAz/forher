const plans = [
  { number: '01', title: 'Una cita sorpresa', note: 'De esas que recordaremos por mucho tiempo.' },
  { number: '02', title: 'Un paseo sin prisa', note: 'Solo nosotros y un lugar por descubrir.' },
  { number: '03', title: 'Una noche para nosotros', note: 'Música, risas y tiempo juntos.' },
];

export default function PlansSection() {
  return (
    <section className="plans-section" id="plans" aria-labelledby="plans-title">
      <p className="chapter__eyebrow">LO QUE NOS ESPERA</p>
      <h2 id="plans-title">Siguientes actividades <em>y citas por hacer.</em></h2>
      <p className="plans-section__intro">Todavía nos quedan muchos recuerdos por crear.</p>
      <div className="plans-grid">
        {plans.map((plan) => <article className="plan-card" key={plan.number}>
          <span className="plan-card__number">{plan.number} <span aria-hidden="true">✦</span></span>
          <h3>{plan.title}</h3>
          <p>{plan.note}</p>
          <span className="plan-card__status">Por hacer ♡</span>
        </article>)}
      </div>
      <p className="plans-section__ending">Continuará... Fabian &amp; Grace</p>
    </section>
  );
}
