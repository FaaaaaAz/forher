import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { localMemories } from '../../data/localMemories.js';
import { getMemories } from '../../services/memories.js';

const MemoryManager = lazy(() => import('./MemoryManager.jsx'));

function ExpandIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M4 16v4h4m12-4v4h-4" /><path d="m4 4 5 5m11-5-5 5M4 20l5-5m11 5-5-5" /></svg>;
}

function AlbumIcon({ type }) {
  return type === 'video'
    ? <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="7" y="13" width="50" height="38" rx="5" /><path d="m27 24 15 8-15 8V24Z" strokeLinejoin="round" /></svg>
    : <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="7" y="11" width="50" height="42" rx="5" /><circle cx="23" cy="25" r="5" /><path d="m8 45 14-14 11 9 8-8 15 13" strokeLinejoin="round" /></svg>;
}

export default function MemoriesPreview() {
  const [memories, setMemories] = useState(localMemories);
  const [selected, setSelected] = useState(null);
  const [album, setAlbum] = useState(null);
  const [manager, setManager] = useState(null);
  const dialogRef = useRef(null);

  async function refreshMemories() { setMemories(await getMemories()); }

  useEffect(() => {
    let active = true;
    getMemories().then((items) => { if (active) setMemories(items); }).catch(() => {});
    return () => { active = false; };
  }, []);

  function openMemory(memory) {
    setSelected(memory);
    dialogRef.current?.showModal();
  }

  function chooseAlbum(type) {
    setAlbum(type);
    setManager(null);
    requestAnimationFrame(() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  const photos = memories.filter((memory) => (memory.mediaType || 'image') === 'image');
  const videos = memories.filter((memory) => memory.mediaType === 'video');
  const visibleMemories = album === 'video' ? videos : photos;

  return (
    <>
      {album === null ? (
        <div className="album-choices">
          {[{ type: 'image', title: 'Fotos', count: photos.length, description: 'Instantes que queremos volver a mirar.' }, { type: 'video', title: 'Videos', count: videos.length, description: 'Momentos que vuelven a moverse.' }].map((choice) => (
            <button className="album-choice" type="button" key={choice.type} onClick={() => chooseAlbum(choice.type)}>
              <span className="album-choice__icon"><AlbumIcon type={choice.type} /></span>
              <span className="album-choice__copy"><strong>{choice.title}</strong><small>{choice.description}</small></span>
              <span className="album-choice__count">{choice.count}</span>
              <span className="album-choice__arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="album-view">
          <div className="album-view__top">
            <button className="album-back" type="button" onClick={() => { setAlbum(null); setManager(null); }}>← Volver a los álbumes</button>
            <button className="memory-manage-button" type="button" onClick={() => setManager({ mode: 'create', memory: null })}>+ Añadir recuerdo</button>
          </div>
          <h3>{album === 'video' ? 'Nuestros videos' : 'Nuestras fotos'}</h3>
          {manager && <Suspense fallback={<p>Abriendo el formulario...</p>}><MemoryManager key={`${manager.mode}-${manager.memory?.image_path || ''}`} mode={manager.mode} memory={manager.memory} onChanged={refreshMemories} onClose={() => setManager(null)} /></Suspense>}
          {visibleMemories.length === 0 && <p className="memories-section__empty">{album === 'video' ? 'Todavía no hay videos. Aquí guardaremos los que vengan ♡' : 'Nuestros recuerdos aparecerán aquí muy pronto.'}</p>}
          <div className="memory-grid">
            {visibleMemories.map((memory, index) => (
              <motion.figure className="memory-card" key={memory.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}>
                <button type="button" onClick={() => openMemory(memory)} aria-label={`Abrir ${album === 'video' ? 'video' : 'foto'} ${index + 1}: ${memory.alt}`}>
                  {memory.mediaType === 'video' ? <video src={memory.imageUrl} muted preload="metadata" playsInline /> : <img src={memory.imageUrl} alt={memory.alt} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" />}
                  <span className="memory-card__view" aria-hidden="true">{memory.mediaType === 'video' ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 12 7-12 7V5Z" /></svg> : <ExpandIcon />}</span>
                </button>
                <figcaption>{memory.caption || 'Un momento nuestro ♡'}</figcaption>
                <button className="memory-card__edit" type="button" onClick={() => setManager({ mode: 'edit', memory })}>Editar descripción</button>
              </motion.figure>
            ))}
          </div>
        </div>
      )}

      <dialog className="memory-dialog" ref={dialogRef} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} aria-label="Recuerdo ampliado">
        {selected && <div className="memory-dialog__content">
          <button className="memory-dialog__close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar recuerdo">×</button>
          {selected.mediaType === 'video' ? <video src={selected.imageUrl} controls autoPlay playsInline /> : <img src={selected.imageUrl} alt={selected.alt} />}
          {selected.caption && <p>{selected.caption}</p>}
        </div>}
      </dialog>
    </>
  );
}
