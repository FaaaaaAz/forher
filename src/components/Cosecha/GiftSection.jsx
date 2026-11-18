import { memo } from 'react';
import { formatNumber, openGift, useCosecha } from './cosechaStore.js';

// "Te envío un obsequio": aquí no hay cámaras ni público, solo nosotros.
function GiftSection() {
  const { gifts, laughs } = useCosecha();
  return (
    <section className="cosecha-gift" data-world="a" aria-labelledby="gift-title">
      <p className="cosecha-gift__eyebrow">PATROCINADOR OFICIAL: YO</p>
      <h2 id="gift-title">Te envío un <em>obsequio.</em></h2>
      <p className="cosecha-gift__copy">Aquí no hay cámaras ni público. Solo tú y yo, y la promesa de cuidarte aunque nadie esté mirando.</p>
      <button className="cosecha-gift__button" type="button" onClick={openGift}><span aria-hidden="true">✦</span> Abrir mi obsequio <span aria-hidden="true">✦</span></button>
      {gifts > 0 && (
        <dl className="cosecha-gift__ledger" aria-live="polite">
          <div><dt>Abrazos que te debo</dt><dd>{gifts}</dd></div>
          <div><dt>Veces que me hiciste reír</dt><dd>{formatNumber(laughs)}</dd></div>
          <div><dt>Razones por las que te elijo</dt><dd aria-label="infinitas">∞</dd></div>
        </dl>
      )}
      {gifts > 0 && <p className="cosecha-gift__irony">Por cada obsequio, ella siempre gana.</p>}
    </section>
  );
}

export default memo(GiftSection);
