import { useEffect, useState } from 'react';
import { MEMORY_CODE_KEY } from '../data/storageKeys.js';
import { getDetailPhotos, uploadDetailPhoto } from '../services/detailPhotos.js';
import { memoryUrl } from '../services/supabase.js';

const cards = [
  { slot: 'gifts', alt: 'Los regalos para Grace', symbol: '♡' },
  { slot: 'flowers', alt: 'Las flores para Grace', symbol: '✿' },
];

function DetailCard({ card, path, ready, onUploaded }) {
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [code, setCode] = useState(() => {
    try { return localStorage.getItem(MEMORY_CODE_KEY) || ''; } catch { return ''; }
  });
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!file || !code) return;
    setBusy(true);
    setError('');
    try {
      const photo = await uploadDetailPhoto(code, card.slot, file, setStage);
      try { localStorage.setItem(MEMORY_CODE_KEY, code); } catch { /* El acceso sigue funcionando sin almacenamiento. */ }
      onUploaded(card.slot, photo.path);
      setEditing(false);
    } catch (uploadError) {
      setError(uploadError.message || 'No se pudo subir la foto. Inténtalo otra vez.');
    } finally {
      setBusy(false);
      setStage('');
    }
  }

  return (
    <figure className={`detail-card${path ? ' detail-card--filled' : ''}`}>
      {path ? <img src={memoryUrl(path)} alt={card.alt} loading="lazy" /> : <div className="detail-card__placeholder" aria-hidden="true"><span>{card.symbol}</span></div>}
      {!path && ready && !editing && <button className="detail-card__add" type="button" onClick={() => setEditing(true)}>Subir foto de {card.slot === 'gifts' ? 'los regalos' : 'las flores'}</button>}
      {!path && ready && editing && <form className="detail-card__form" onSubmit={submit}>
        <label htmlFor={`detail-file-${card.slot}`}>Elige la foto</label>
        <input id={`detail-file-${card.slot}`} type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
        <label htmlFor={`detail-code-${card.slot}`}>Código de administración de recuerdos</label>
        <input id={`detail-code-${card.slot}`} type="password" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="off" required />
        <small>Usa el código largo de las fotos, distinto de la clave de seis dígitos.</small>
        {stage && <p role="status">{stage}</p>}
        {error && <p className="detail-card__error" role="alert">{error}</p>}
        <div className="detail-card__actions"><button type="submit" disabled={busy || !file || !code}>{busy ? 'Subiendo...' : 'Guardar foto'}</button><button type="button" onClick={() => setEditing(false)} disabled={busy}>Cancelar</button></div>
      </form>}
    </figure>
  );
}

export default function GardenSection() {
  const [details, setDetails] = useState({ gifts: null, flowers: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try { setDetails(await getDetailPhotos()); }
    catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="garden-section" id="garden" aria-label="Un detalle para ti">
      <p className="chapter__eyebrow">UN DETALLE PARA TI</p>
      {loading && <p className="garden-section__status" role="status">Cargando nuestros detalles...</p>}
      {error && <div className="garden-section__status" role="alert">{error} <button type="button" onClick={load}>Reintentar</button></div>}
      <div className="garden-section__cards">
        {cards.map((card) => <DetailCard key={card.slot} card={card} path={details[card.slot]} ready={!loading && !error} onUploaded={(slot, path) => setDetails((current) => ({ ...current, [slot]: path }))} />)}
      </div>
    </section>
  );
}
