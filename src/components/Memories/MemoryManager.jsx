import { useEffect, useRef, useState } from 'react';
import { memoryRequest, uploadMemoryFile } from '../../services/manageMemories.js';
import MemoryImage from '../Media/MemoryImage.jsx';

export default function MemoryManager({ mode, memory, onChanged, onClose }) {
  const panelRef = useRef(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState(memory?.caption || '');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, []);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'edit') {
        setStage('Guardando la descripción...');
        await memoryRequest({ action: 'update', path: memory.image_path, caption });
      } else {
        if (!file) throw new Error('Elige una foto o un video.');
        if (file.size > 45 * 1024 * 1024) throw new Error('El archivo debe pesar menos de 45 MB.');
        const path = await uploadMemoryFile(file, setStage);
        setStage('Guardando el recuerdo...');
        await memoryRequest({ action: 'create', path, caption });
      }
      setStage('Actualizando el álbum...');
      await onChanged();
      onClose();
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
      const result = await memoryRequest({ action: 'delete', path: memory.image_path });
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
        <button type="button" onClick={onClose} aria-label="Cerrar formulario"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg></button>
      </div>
      <form className="memory-manager__form" onSubmit={save}>
        {mode === 'edit' ? (
          <div className="memory-manager__selected">
            {memory.mediaType === 'video' ? <video src={memory.imageUrl} muted playsInline preload="metadata" /> : <MemoryImage path={memory.image_path} src={memory.imageUrl} width={640} alt={memory.alt} />}
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
      {message && <p className="memory-manager__message" role="status">{message}</p>}
    </div>
  );
}
