import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { localMemories } from '../../data/localMemories.js';
import { getMemories } from '../../services/memories.js';
const MemoryManager = lazy(() => import('./MemoryManager.jsx'));

export default function MemoriesPreview() {
  const [memories, setMemories] = useState(localMemories);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('image');
  const [managerOpen, setManagerOpen] = useState(false);
  const dialogRef = useRef(null);

  async function refreshMemories() {
    const items = await getMemories();
    setMemories(items);
  }

  useEffect(() => {
    let active = true;
    getMemories().then((items) => {
      if (active) setMemories(items);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  function openMemory(memory) {
    setSelected(memory);
    dialogRef.current?.showModal();
  }

  const visibleMemories = memories.filter((memory) => (memory.mediaType || 'image') === activeTab);

  return (
    <>
      <div className="memory-toolbar">
        <div className="memory-tabs" role="tablist" aria-label="Tipo de recuerdo">
          <button type="button" role="tab" aria-selected={activeTab === 'image'} className={activeTab === 'image' ? 'is-active' : ''} onClick={() => setActiveTab('image')}>Fotos <span>{memories.filter((memory) => (memory.mediaType || 'image') === 'image').length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'video'} className={activeTab === 'video' ? 'is-active' : ''} onClick={() => setActiveTab('video')}>Videos <span>{memories.filter((memory) => memory.mediaType === 'video').length}</span></button>
        </div>
        <button className="memory-manage-button" type="button" onClick={() => setManagerOpen((open) => !open)}>{managerOpen ? 'Cerrar' : '+ Añadir o editar'}</button>
      </div>
      {managerOpen && <Suspense fallback={<p>Abriendo el álbum...</p>}><MemoryManager memories={memories} onChanged={refreshMemories} onClose={() => setManagerOpen(false)} /></Suspense>}
      {visibleMemories.length === 0 && <p className="memories-section__empty">{activeTab === 'video' ? 'Todavía no hay videos. Aquí guardaremos los que vengan ♡' : 'Nuestros recuerdos aparecerán aquí muy pronto.'}</p>}
      <div className="memory-grid">
        {visibleMemories.map((memory, index) => (
          <motion.figure
            className="memory-card"
            key={memory.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
          >
            <button type="button" onClick={() => openMemory(memory)} aria-label={`Abrir ${activeTab === 'video' ? 'video' : 'foto'} ${index + 1}: ${memory.alt}`}>
              {memory.mediaType === 'video' ? <video src={memory.imageUrl} muted preload="metadata" playsInline /> : <img src={memory.imageUrl} alt={memory.alt} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" />}
              <span className="memory-card__view" aria-hidden="true">{memory.mediaType === 'video' ? '▶' : '↗'}</span>
            </button>
            <figcaption>{memory.caption || 'Un momento nuestro ♡'}</figcaption>
          </motion.figure>
        ))}
      </div>

      <dialog className="memory-dialog" ref={dialogRef} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} aria-label="Recuerdo ampliado">
        {selected && (
          <div className="memory-dialog__content">
            <button className="memory-dialog__close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar recuerdo">×</button>
            {selected.mediaType === 'video' ? <video src={selected.imageUrl} controls autoPlay playsInline /> : <img src={selected.imageUrl} alt={selected.alt} />}
            {selected.caption && <p>{selected.caption}</p>}
          </div>
        )}
      </dialog>
    </>
  );
}
