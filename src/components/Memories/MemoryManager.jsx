import { useEffect, useRef, useState } from 'react';
import { MEMORY_CODE_KEY, memoryRequest, uploadMemoryFile } from '../../services/manageMemories.js';

export default function MemoryManager({ mode, memory, onChanged, onClose }) {
  const panelRef = useRef(null);
  const formRef = useRef(null);
  const [code, setCode] = useState(() => localStorage.getItem(MEMORY_CODE_KEY) || '');
  const [unlocked, setUnlocked] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState(memory?.caption || '');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, []);
  useEffect(() => {
    const savedCode = localStorage.getItem(MEMORY_CODE_KEY);
    if (!savedCode) return;
    let active = true;
    memoryRequest(savedCode, { action: 'verify' })
      .then(() => { if (active) setUnlocked(true); })
      .catch(() => { if (active) { localStorage.removeItem(MEMORY_CODE_KEY); setMessage('Introduce el código de nuevo.'); } });
    return () => { active = false; };
  }, []);

  async function unlock(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await memoryRequest(code, { action: 'verify' });
      localStorage.setItem(MEMORY_CODE_KEY, code);
      setUnlocked(true);
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'edit') {
        setStage('Guardando la descripción...');
        await memoryRequest(code, { action: 'update', path: memory.image_path, caption });
      } else {
        if (!file) throw new Error('Elige una foto o un video.');
        if (file.size > 45 * 1024 * 1024) throw new Error('El archivo debe pesar menos de 45 MB.');
        const path = await uploadMemoryFile(code, file, setStage);
        setStage('Guardando el recuerdo...');
        await memoryRequest(code, { action: 'create', path, caption });
        setFile(null);
        setCaption('');
        formRef.current?.reset();
      }
      setStage('Actualizando el álbum...');
      await onChanged();
      setMessage(mode === 'edit' ? 'Descripción guardada ♡' : 'Recuerdo añadido ♡');
    } catch (error) {
      setMessage(error.message || 'No se pudo guardar. Inténtalo de nuevo.');
    } finally {
      setStage('');
      setBusy(false);
    }
  }

  async function removeMemory() {
    setBusy(true);
    setMessage('');
    setStage('Eliminando el recuerdo...');
    try {
      const result = await memoryRequest(code, { action: 'delete', path: memory.image_path });
      await onChanged();
      if (result.warning) {
        setMessage(result.warning);
        setConfirmDelete(false);
      } else {
        onClose();
      }
    } catch (error) {
      setMessage(error.message || 'No se pudo eliminar el recuerdo.');
    } finally {
      setStage('');
      setBusy(false);
    }
  }

  return (
    <div className="memory-manager" ref={panelRef}>
      <div className="memory-manager__heading">
        <div><p className="chapter__eyebrow">NUESTRO ÁLBUM</p><h3>{mode === 'edit' ? 'Editar este recuerdo' : 'Añadir un recuerdo'}</h3></div>
        <button type="button" onClick={onClose} aria-label="Cerrar formulario">×</button>
      </div>
      {!unlocked ? (
        <form className="memory-manager__form" onSubmit={unlock}>
          <label htmlFor="memory-code">Código para Fabian y Grace</label>
          <div className="memory-manager__code"><input id="memory-code" type="password" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="off" required /><button type="submit" disabled={busy}>Entrar</button></div>
          <p>Quedará guardado en este dispositivo.</p>
        </form>
      ) : (
        <form className="memory-manager__form" ref={formRef} onSubmit={save}>
          {mode === 'edit' ? (
            <div className="memory-manager__selected">
              {memory.mediaType === 'video' ? <video src={memory.imageUrl} muted playsInline preload="metadata" /> : <img src={memory.imageUrl} alt={memory.alt} />}
              <span>Estás editando este recuerdo</span>
            </div>
          ) : (
            <><label htmlFor="memory-file">Foto o video</label><input id="memory-file" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /></>
          )}
          <label htmlFor="memory-caption">Palabras debajo del recuerdo</label>
          <textarea id="memory-caption" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} rows={4} placeholder="Un momento nuestro ♡" />
          {stage && <p className="memory-manager__stage" role="status"><span className="memory-manager__spinner" aria-hidden="true" />{stage}</p>}
          <button type="submit" disabled={busy || (mode === 'create' && !file)}>{busy ? 'Un momento...' : mode === 'edit' ? 'Guardar descripción' : 'Subir recuerdo'}</button>
          {mode === 'edit' && <div className="memory-manager__delete">
            {!confirmDelete ? (
              <button type="button" onClick={() => setConfirmDelete(true)} disabled={busy}>Eliminar este recuerdo</button>
            ) : (
              <div className="memory-manager__confirm">
                <p>¿Eliminar esta {memory.mediaType === 'video' ? 'video' : 'foto'} y su descripción? No se puede deshacer.</p>
                <div>
                  <button type="button" onClick={() => setConfirmDelete(false)} disabled={busy}>Cancelar</button>
                  <button type="button" onClick={removeMemory} disabled={busy}>Sí, eliminar</button>
                </div>
              </div>
            )}
          </div>}
        </form>
      )}
      {message && <p className="memory-manager__message" role="status">{message}</p>}
    </div>
  );
}
