import { memoryUrl } from '../services/supabase.js';

const plans = [
  { number: '01', type: 'cine', title: 'Una cita en el cine', detail: 'Amanecer en la cosecha', note: 'Nuestra próxima película juntos, con palomitas y tiempo para nosotros.', image: 'Amanecer-en-la-cosecha.webp', alt: 'Póster de Amanecer en la cosecha' },
  { number: '02', type: 'comida', title: 'Una cita para comer', detail: 'Burger Week', note: 'Ir a probar hamburguesas y elegir nuestra favorita.', image: 'burgerWeek.png', alt: 'Logotipo de Burger Week' },
];

export default function PlansSection() {
  return (
    <section className="plans-section" id="plans" aria-labelledby="plans-title">
      <p className="chapter__eyebrow">LO QUE NOS ESPERA</p>
      <h2 id="plans-title">Siguientes actividades <em>y citas por hacer.</em></h2>
      <p className="plans-section__intro">Todavía nos quedan muchos recuerdos por crear.</p>
      <div className="plans-grid">
        {plans.map((plan) => <article className="plan-card" key={plan.number}>
          <div className={`plan-card__image plan-card__image--${plan.type}`}><img src={memoryUrl(plan.image)} alt={plan.alt} loading="lazy" /></div>
          <div className="plan-card__content">
            <span className="plan-card__number">{plan.number} · {plan.type.toUpperCase()} <span aria-hidden="true">✦</span></span>
            <h3>{plan.title}</h3>
            <strong>{plan.detail}</strong>
            <p>{plan.note}</p>
            <span className="plan-card__status">Por hacer ♡</span>
          </div>
        </article>)}
      </div>
      <p className="plans-section__ending">Continuará... Fabian &amp; Grace</p>
    </section>
  );
}
