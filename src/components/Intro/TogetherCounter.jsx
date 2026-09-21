import { motion } from 'motion/react';
import { getTimeTogether } from '../../utils/dates.js';

export default function TogetherCounter({ today }) {
  const time = getTimeTogether(today);
  const units = [
    { value: time.years, label: time.years === 1 ? 'año' : 'años' },
    { value: time.months, label: time.months === 1 ? 'mes' : 'meses' },
    { value: time.days, label: time.days === 1 ? 'día' : 'días' },
  ];

  return (
    <section className="together" aria-labelledby="together-title">
      <motion.div className="together__inner" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
        <p className="eyebrow"><span className="eyebrow__line" /> DESDE EL 28 DE ABRIL DE 2024</p>
        <h2 id="together-title">El tiempo contigo <em>florece.</em></h2>
        <div className="together__count" role="group" aria-label={`${time.years} años, ${time.months} meses y ${time.days} días juntos`}>
          {units.map(({ value, label }) => (
            <div className="together__unit" key={label} aria-hidden="true">
              <span className="together__number">{String(value).padStart(2, '0')}</span>
              <span className="together__label">{label}</span>
            </div>
          ))}
        </div>
        <p className="together__footnote">{new Intl.NumberFormat('es-BO').format(time.totalDays)} días compartiendo esta historia, y contando.</p>
      </motion.div>
    </section>
  );
}
