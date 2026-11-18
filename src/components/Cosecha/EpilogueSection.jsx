import { memo } from 'react';
import { motion } from 'motion/react';
import BirdMark from './BirdMark.jsx';

// El contrapunto: sin brillo, sin contador, sin música visual. Solo texto.
const fade = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, amount: 0.6 }, transition: { duration: 2.4, ease: 'easeOut' } };

function EpilogueSection() {
  return (
    <section className="cosecha-epilogue" data-world="end" aria-labelledby="epilogue-title">
      <div className="cosecha-epilogue__inner">
        <motion.div {...fade}><BirdMark variant="plain" /></motion.div>
        <motion.h2 id="epilogue-title" {...fade}>Sobrevivir cuesta.</motion.h2>
        <motion.p {...fade}>Lo pagan siempre los mismos: los que trabajan sin descanso, los que esperan noticias, los que aprenden a despedirse demasiado pronto.</motion.p>
        <motion.p {...fade}>Ningún aplauso devuelve a nadie a casa.</motion.p>
        <motion.p {...fade}>Lo que de verdad nos mantiene vivos es pequeño y nunca sale en pantalla: un nombre dicho en voz baja, una mano que no se suelta, alguien a quien volver.</motion.p>
        <motion.p className="cosecha-epilogue__sign" {...fade}>Tú eres a quien yo vuelvo.<br />— Fabian</motion.p>
      </div>
    </section>
  );
}

export default memo(EpilogueSection);
