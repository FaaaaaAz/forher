import { useEffect, useRef, useState } from 'react';
import { getDetailPhotos, uploadDetailPhoto } from '../services/detailPhotos.js';
import { memoryImageUrl } from '../services/supabase.js';
import { prepareImagesOffline } from '../pwa/offline.js';
import MemoryImage from '../components/Media/MemoryImage.jsx';

const loveDay = {
  id: 'love-day-2026', title: 'Día del Amor', date: '21/09', year: 2026, icon: '♡',
  caption: 'Flores, regalos y un día hecho para nosotros.', month: 9, day: 21,
  photos: [
    { slot: 'gifts', alt: 'Los regalos del Día del Amor', label: 'Nuestros regalos', symbol: '♡' },
    { slot: 'flowers', alt: 'Las flores del Día del Amor', label: 'Tus flores', symbol: '✿' },
  ],
};

// Añade aquí cada celebración nueva cuando sus fotos y espacios estén listos.
const festivals = [loveDay];

function DetailCard({ card, path, ready, onUploaded }) {
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const photo = await uploadDetailPhoto(card.slot, file, setStage);
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
      {path ? <MemoryImage path={path} width={900} fallbackWidth={480} alt={card.alt} loading="lazy" /> : <div className="detail-card__placeholder" aria-hidden="true"><span>{card.symbol}</span></div>}
      {path && <figcaption>{card.label}</figcaption>}
      {!path && ready && !editing && <button className="detail-card__add" type="button" onClick={() => setEditing(true)}>Añadir {card.label.toLowerCase()}</button>}
      {!path && ready && editing && <form className="detail-card__form" onSubmit={submit}>
        <label htmlFor={`detail-file-${card.slot}`}>Elige la foto</label>
        <input id={`detail-file-${card.slot}`} type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
        {stage && <p role="status">{stage}</p>}
        {error && <p className="detail-card__error" role="alert">{error}</p>}
        <div className="detail-card__actions"><button type="submit" disabled={busy || !file}>{busy ? 'Subiendo...' : 'Guardar foto'}</button><button type="button" onClick={() => setEditing(false)} disabled={busy}>Cancelar</button></div>
      </form>}
    </figure>
  );
}

function FestivalCover({ festival, details, onOpen }) {
  const available = festival.photos.filter(({ slot }) => details[slot]);
  return (
    <button className="festival-card" type="button" onClick={onOpen} aria-label={`Abrir álbum ${festival.title} del ${festival.date}`}>
      <span className="festival-card__previews" aria-hidden="true">
        {available.slice(0, 2).map((photo, index) => <span className={`festival-card__photo festival-card__photo--${index + 1}`} key={photo.slot}><MemoryImage path={details[photo.slot]} width={480} alt="" /></span>)}
        {!available.length && <span className="festival-card__empty">{festival.icon}</span>}
      </span>
      <span className="festival-card__date"><b>{festival.date}</b><small>{festival.year}</small></span>
      <span className="festival-card__copy"><small>ÁLBUM DE UNA FECHA ESPECIAL</small><strong>{festival.title}</strong><span>{festival.caption}</span></span>
      <span className="festival-card__footer"><span>{available.length} {available.length === 1 ? 'recuerdo' : 'recuerdos'}</span><b aria-hidden="true">Abrir álbum&nbsp; →</b></span>
      <span className="festival-card__heart" aria-hidden="true">{festival.icon}</span>
    </button>
  );
}

export default function GardenSection({ today }) {
  const [details, setDetails] = useState({ gifts: null, flowers: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFestival, setSelectedFestival] = useState(null);
  const albumRef = useRef(null);
  const currentFestival = festivals.find((festival) => festival.year === today.year && festival.month === today.month && festival.day === today.day);
  const todayKey = today.year * 10000 + today.month * 100 + today.day;
  const archivedFestivals = festivals.filter((festival) => festival.year * 10000 + festival.month * 100 + festival.day < todayKey);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const loaded = await getDetailPhotos();
      setDetails(loaded);
      prepareImagesOffline(Object.values(loaded).filter(Boolean).flatMap((path) => [memoryImageUrl(path, 480), memoryImageUrl(path, 900)]));
    }
    catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function galleryFor(festival) {
    return <div className="garden-section__cards">{festival.photos.map((card) => <DetailCard key={card.slot} card={card} path={details[card.slot]} ready={!loading && !error} onUploaded={(slot, path) => setDetails((current) => ({ ...current, [slot]: path }))} />)}</div>;
  }

  function openAlbum(festival) {
    setSelectedFestival(festival);
    requestAnimationFrame(() => albumRef.current?.showModal());
  }

  return (
    <section className="garden-section" id="garden" aria-labelledby="festival-title">
      <p className="chapter__eyebrow">UN DETALLE PARA TI</p>
      <div className="garden-section__heading">
        <div><h2 id="festival-title">Fechas que <em>guardamos.</em></h2><p>Cada celebración tendrá aquí su propio pequeño álbum.</p></div>
        <span aria-hidden="true">♡</span>
      </div>
      {loading && <p className="garden-section__status" role="status">Cargando nuestros detalles...</p>}
      {error && <div className="garden-section__status" role="alert">{error} <button type="button" onClick={load}>Reintentar</button></div>}
      {currentFestival && <div className="festival-current"><div className="festival-current__heading"><span>CELEBRANDO AHORA</span><h3>{currentFestival.title}</h3><p>{currentFestival.caption}</p></div>{galleryFor(currentFestival)}</div>}
      {!!archivedFestivals.length && <div className="festival-archive"><p className="festival-archive__label">NUESTROS ÁLBUMES ESPECIALES</p><div className="festival-archive__grid">{archivedFestivals.map((festival) => <FestivalCover key={festival.id} festival={festival} details={details} onOpen={() => openAlbum(festival)} />)}</div></div>}

      <dialog className="festival-dialog" ref={albumRef} onClick={(event) => { if (event.target === albumRef.current) albumRef.current.close(); }} aria-labelledby="festival-dialog-title">
        {selectedFestival && <div className="festival-dialog__content">
          <button className="festival-dialog__close" type="button" onClick={() => albumRef.current?.close()} aria-label="Cerrar álbum"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg></button>
          <div className="festival-dialog__heading"><span className="festival-dialog__icon" aria-hidden="true">{selectedFestival.icon}</span><p>{selectedFestival.date} · {selectedFestival.year}</p><h3 id="festival-dialog-title">{selectedFestival.title}</h3><small>{selectedFestival.caption}</small></div>
          {galleryFor(selectedFestival)}
        </div>}
      </dialog>
    </section>
  );
}
