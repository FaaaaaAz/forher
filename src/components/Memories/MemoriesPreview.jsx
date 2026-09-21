import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { localMemories } from '../../data/localMemories.js';
import { getMemories } from '../../services/memories.js';

export default function MemoriesPreview() {
  const [memories, setMemories] = useState(localMemories);
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    let active = true;
    getMemories().then((items) => {
      if (active) setMemories(items);
    }).catch(() => {
      // Las fotos locales siguen visibles si la API todavía no está disponible.
    });
    return () => { active = false; };
  }, []);

  function openMemory(memory) {
    setSelected(memory);
    dialogRef.current?.showModal();
  }

  return (
    <>
      {memories.length === 0 && <p className="memories-section__empty">Nuestros recuerdos aparecerán aquí muy pronto.</p>}
      <div className="memory-grid">
        {memories.map((memory, index) => (
          <motion.figure
            className="memory-card"
            key={memory.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
          >
            <button type="button" onClick={() => openMemory(memory)} aria-label={`Ampliar foto ${index + 1}: ${memory.alt}`}>
              <img src={memory.imageUrl} alt={memory.alt} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" />
              <span className="memory-card__view" aria-hidden="true">↗</span>
            </button>
            <figcaption>{memory.caption || `RECUERDO ${String(index + 1).padStart(2, '0')}`}</figcaption>
          </motion.figure>
        ))}
      </div>

      <dialog className="memory-dialog" ref={dialogRef} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} aria-label="Fotografía ampliada">
        {selected && (
          <div className="memory-dialog__content">
            <button className="memory-dialog__close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar fotografía">×</button>
            <img src={selected.imageUrl} alt={selected.alt} />
            {selected.caption && <p>{selected.caption}</p>}
          </div>
        )}
      </dialog>
    </>
  );
}
