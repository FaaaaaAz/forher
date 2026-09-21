import { useEffect, useState } from 'react';
import { MEMORY_CODE_KEY, memoryRequest, uploadMemoryFile } from '../../services/manageMemories.js';

export default function MemoryManager({ memories, onChanged, onClose }) {
  const [code, setCode] = useState(() => localStorage.getItem(MEMORY_CODE_KEY) || '');
  const [unlocked, setUnlocked] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [editPath, setEditPath] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!code) return;
    let active = true;
    memoryRequest(code, { action: 'verify' })
      .then(() => { if (active) setUnlocked(true); })
      .catch(() => { if (active) localStorage.removeItem(MEMORY_CODE_KEY); });
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

  async function addMemory(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file) return;
    if (file.size > 45 * 1024 * 1024) { setMessage('El archivo debe pesar menos de 45 MB.'); return; }
    setBusy(true);
    setProgress(0);
    setMessage('');
    try {
      const path = await uploadMemoryFile(code, file, setProgress);
      await memoryRequest(code, { action: 'create', path, caption });
      setFile(null);
      setCaption('');
      form.reset();
      setMessage('Recuerdo añadido ♡');
      await onChanged();
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }

  async function saveCaption(event) {
    event.preventDefault();
    if (!editPath) return;
    setBusy(true);
    setMessage('');
    try {
      await memoryRequest(code, { action: 'update', path: editPath, caption: editCaption });
      setMessage('Descripción guardada ♡');
      await onChanged();
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="memory-manager">
      <div className="memory-manager__heading"><div><p className="chapter__eyebrow">NUESTRO ÁLBUM</p><h3>Añadir un recuerdo</h3></div><button type="button" onClick={onClose} aria-label="Cerrar administración">×</button></div>
      {!unlocked ? (
        <form className="memory-manager__form" onSubmit={unlock}>
          <label htmlFor="memory-code">Código para Fabian y Grace</label>
          <div className="memory-manager__code"><input id="memory-code" type="password" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="off" required /><button type="submit" disabled={busy}>Entrar</button></div>
          <p>Se guarda en este dispositivo para que no tengas que escribirlo cada vez.</p>
        </form>
      ) : (
        <div className="memory-manager__columns">
          <form className="memory-manager__form" onSubmit={addMemory}>
            <h4>Nuevo recuerdo</h4>
            <label htmlFor="memory-file">Foto o video</label>
            <input id="memory-file" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required />
            <label htmlFor="memory-caption">Palabras debajo del recuerdo</label>
            <textarea id="memory-caption" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} rows={3} placeholder="Una tarde que siempre recordaremos..." />
            {busy && progress > 0 && <progress value={progress} max="100">{progress}%</progress>}
            <button type="submit" disabled={busy || !file}>{busy ? `Guardando ${progress}%` : 'Subir recuerdo'}</button>
          </form>
          <form className="memory-manager__form" onSubmit={saveCaption}>
            <h4>Editar una descripción</h4>
            <label htmlFor="memory-select">Elige un recuerdo</label>
            <select id="memory-select" value={editPath} onChange={(event) => { const item = memories.find((memory) => memory.image_path === event.target.value); setEditPath(event.target.value); setEditCaption(item?.caption || ''); }} required>
              <option value="">Seleccionar...</option>
              {memories.map((memory, index) => <option key={memory.image_path} value={memory.image_path}>{memory.caption || `${memory.mediaType === 'video' ? 'Video' : 'Foto'} ${index + 1}`}</option>)}
            </select>
            <label htmlFor="memory-edit-caption">Descripción</label>
            <textarea id="memory-edit-caption" value={editCaption} onChange={(event) => setEditCaption(event.target.value)} maxLength={500} rows={3} placeholder="Escribe algo para este recuerdo" required />
            <button type="submit" disabled={busy || !editPath}>Guardar descripción</button>
          </form>
        </div>
      )}
      {message && <p className="memory-manager__message" role="status">{message}</p>}
    </div>
  );
}
