import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MEMORY_CODE_KEY } from '../data/storageKeys.js';
import { getPlans, planRequest, uploadPlanImage } from '../services/plans.js';
import { memoryUrl } from '../services/supabase.js';

function PlanCard({ plan, index, onOpen }) {
  return <motion.button className="plan-card" type="button" onClick={() => onOpen(plan)} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * .08 }}>
    <div className={`plan-card__image plan-card__image--${plan.type}`}>{plan.image_path ? <img src={memoryUrl(plan.image_path)} alt={plan.detail || plan.title} loading="lazy" /> : <span aria-hidden="true">♡</span>}</div>
    <div className="plan-card__content"><span className="plan-card__number">{String(index + 1).padStart(2, '0')} · {plan.type.toUpperCase()} <span aria-hidden="true">✦</span></span><h3>{plan.title}</h3>{plan.detail && <strong>{plan.detail}</strong>}{plan.note && <p>{plan.note}</p>}<span className="plan-card__status">{plan.status === 'completed' ? 'Ya lo vivimos ♡' : 'Por hacer ♡'}</span></div>
  </motion.button>;
}

function PlanEditor({ plan, onSaved, onCancel }) {
  const [code, setCode] = useState(() => localStorage.getItem(MEMORY_CODE_KEY) || '');
  const [title, setTitle] = useState(plan?.title || '');
  const [detail, setDetail] = useState(plan?.detail || '');
  const [type, setType] = useState(plan?.type || 'cita');
  const [note, setNote] = useState(plan?.note || '');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const imagePath = file ? await uploadPlanImage(code, file, setStage) : plan?.image_path;
      setStage('Guardando la cita...');
      const result = await planRequest(code, { action: plan ? 'update' : 'create', id: plan?.id, title, detail, type, note, image_path: imagePath });
      localStorage.setItem(MEMORY_CODE_KEY, code); onSaved(result.plans);
    } catch (saveError) { setError(saveError.message); }
    finally { setBusy(false); setStage(''); }
  }
  return <form className="plan-editor" onSubmit={save}>
    <div className="plan-editor__grid"><label>Título<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} required /></label><label>Tipo<input value={type} onChange={(event) => setType(event.target.value)} maxLength={30} placeholder="cine, comida, paseo..." /></label></div>
    <label>Nombre o detalle<input value={detail} onChange={(event) => setDetail(event.target.value)} maxLength={120} placeholder="Lugar, película o actividad" /></label><label>Descripción<textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={400} rows={3} /></label><label>{plan?.image_path ? 'Cambiar imagen (opcional)' : 'Imagen (opcional)'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label><label>Código largo de administración<input type="password" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="off" required /></label>
    {stage && <p className="plan-editor__stage" role="status">{stage}</p>}{error && <p className="plan-editor__error" role="alert">{error}</p>}<div className="plan-editor__actions"><button type="submit" disabled={busy}>{busy ? 'Guardando...' : 'Guardar cita'}</button><button type="button" onClick={onCancel} disabled={busy}>Cancelar</button></div>
  </form>;
}

function PlanDialog({ plan, onClose, onChanged }) {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [code, setCode] = useState(() => localStorage.getItem(MEMORY_CODE_KEY) || '');
  const [error, setError] = useState('');
  useEffect(() => { ref.current?.showModal(); }, []);
  async function complete(event) {
    event.preventDefault(); setError('');
    try { const result = await planRequest(code, { action: 'complete', id: plan.id }); localStorage.setItem(MEMORY_CODE_KEY, code); onChanged(result.plans, 'completed'); }
    catch (completeError) { setError(completeError.message); }
  }
  return <dialog className="plan-dialog" ref={ref} onClose={onClose} onClick={(event) => { if (event.target === ref.current) ref.current.close(); }}><div className="plan-dialog__card"><button className="plan-dialog__close" type="button" onClick={() => ref.current?.close()} aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg></button>
    {editing ? <PlanEditor plan={plan} onSaved={onChanged} onCancel={() => setEditing(false)} /> : <><p className="chapter__eyebrow">{plan.status === 'completed' ? 'UN RECUERDO CUMPLIDO' : 'UNA CITA PENDIENTE'}</p><h3>{plan.title}</h3>{plan.detail && <strong>{plan.detail}</strong>}{plan.note && <p>{plan.note}</p>}{plan.status === 'pending' && !completing && <div className="plan-dialog__choices"><button type="button" onClick={() => setEditing(true)}>Editar cita</button><button type="button" onClick={() => setCompleting(true)}>Ya lo hicimos ♡</button></div>}{plan.status === 'pending' && completing && <form className="plan-dialog__complete" onSubmit={complete}><label>Código largo para guardar el recuerdo<input type="password" value={code} onChange={(event) => setCode(event.target.value)} required /></label>{error && <p role="alert">{error}</p>}<div><button type="submit">Sí, ya lo vivimos</button><button type="button" onClick={() => setCompleting(false)}>Volver</button></div></form>}</>}
  </div></dialog>;
}

export default function PlansSection() {
  const [plans, setPlans] = useState([]);
  const [view, setView] = useState('pending');
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { getPlans().then(setPlans).catch((loadError) => setError(loadError.message)); }, []);
  const visible = plans.filter((plan) => plan.status === view);
  function changed(nextPlans, nextView = view) { setPlans(nextPlans); setSelected(null); setCreating(false); setView(nextView); }
  return <section className="plans-section" id="plans" aria-labelledby="plans-title"><p className="chapter__eyebrow">LO QUE NOS ESPERA</p><h2 id="plans-title">Siguientes actividades <em>y citas por hacer.</em></h2><p className="plans-section__intro">Todavía nos quedan muchos recuerdos por crear.</p>
    <div className="plans-toolbar"><div className="plans-tabs"><button className={view === 'pending' ? 'is-active' : ''} type="button" onClick={() => setView('pending')}>Pendientes <span>{plans.filter((plan) => plan.status === 'pending').length}</span></button><button className={view === 'completed' ? 'is-active' : ''} type="button" onClick={() => setView('completed')}>Ya realizadas <span>{plans.filter((plan) => plan.status === 'completed').length}</span></button></div>{view === 'pending' && <button className="plans-add" type="button" onClick={() => setCreating(true)}>+ Nueva cita</button>}</div>
    {error && <p className="plans-error" role="alert">{error}</p>}{creating && <div className="plans-create"><h3>Nueva cita</h3><PlanEditor onSaved={changed} onCancel={() => setCreating(false)} /></div>}{visible.length ? <div className="plans-grid">{visible.map((plan, index) => <PlanCard key={plan.id} plan={plan} index={index} onOpen={setSelected} />)}</div> : <p className="plans-empty">{view === 'completed' ? 'Cuando vivamos una cita, aparecerá aquí como parte de nuestra historia ♡' : 'No hay citas pendientes. Es un buen momento para imaginar la siguiente.'}</p>}{selected && <PlanDialog key={selected.id} plan={selected} onClose={() => setSelected(null)} onChanged={changed} />}<p className="plans-section__ending">Continuará... Fabian &amp; Grace</p>
  </section>;
}
