import { AnimatePresence, motion } from 'motion/react';
import { getBoliviaClock, getTimeTogether } from '../../utils/dates.js';

export default function TogetherCounter({ today, now }) {
  const time = getTimeTogether(today);
  const clock = getBoliviaClock(now);
  const units = [
    { value: time.years, label: time.years === 1 ? 'año' : 'años' },
    { value: time.months, label: time.months === 1 ? 'mes' : 'meses' },
    { value: time.days, label: time.days === 1 ? 'día' : 'días' },
    { value: clock.hours, label: 'horas' },
    { value: clock.minutes, label: 'minutos' },
    { value: clock.seconds, label: 'segundos' },
  ];

  return (
    <section className="together" aria-labelledby="together-title">
      <motion.div className="together__inner" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
        <p className="eyebrow"><span className="eyebrow__line" /> DESDE EL 28 DE ABRIL DE 2024</p>
        <h2 id="together-title">El tiempo contigo <em>florece.</em></h2>
        <div className="together__count" role="timer" aria-label="Tiempo juntos" aria-live="off">
          {units.map(({ value, label }) => (
            <div className="together__unit" key={label}>
              <span className="together__number"><AnimatePresence mode="popLayout" initial={false}><motion.span key={value} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .3 }}>{String(value).padStart(2, '0')}</motion.span></AnimatePresence></span>
              <span className="together__label">{label}</span>
            </div>
          ))}
        </div>
        <p className="together__footnote">{new Intl.NumberFormat('es-BO').format(time.totalDays)} días compartiendo esta historia, y contando.</p>
      </motion.div>
    </section>
  );
}
