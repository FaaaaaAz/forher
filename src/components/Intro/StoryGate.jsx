import { useEffect, useRef, useState } from 'react';
import { requestStoryToken } from '../../services/session.js';

export default function StoryGate({ onUnlock, onBack }) {
  const inputRef = useRef(null);
  const [digits, setDigits] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [wrongCode, setWrongCode] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function enter(event) {
    event.preventDefault();
    if (digits.length !== 6 || busy) return;
    setBusy(true);
    setError('');
    try {
      // La clave se comprueba en el servidor, que entrega el permiso para subir y editar.
      onUnlock(await requestStoryToken(digits), remember);
    } catch (unlockError) {
      setError(unlockError.message);
      setWrongCode(Boolean(unlockError.wrongCode));
      if (unlockError.wrongCode) setDigits('');
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section className="story-gate" aria-labelledby="gate-title">
      <div className="story-gate__glow" aria-hidden="true" />
      <button className="story-gate__back" type="button" onClick={onBack}>← Volver</button>
      <div className="story-gate__card">
        <div className="story-gate__flower" aria-hidden="true">♡</div>
        <p className="story-gate__eyebrow">UN RINCÓN PARA FABIAN Y GRACE</p>
        <h1 id="gate-title">Nuestra historia<br /><em>tiene una llave.</em></h1>
        <p className="story-gate__intro">Escribe los seis números que abren este lugar.</p>
        <form onSubmit={enter}>
          <label className="story-gate__label" htmlFor="story-code">Nuestra clave</label>
          <div className={`story-gate__slots${wrongCode ? ' story-gate__slots--error' : ''}`} onClick={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }, (_, index) => <span className={`story-gate__slot${index === digits.length ? ' story-gate__slot--active' : ''}`} key={index} aria-hidden="true">{digits[index] ? '•' : ''}</span>)}
            <input ref={inputRef} id="story-code" type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" maxLength={6} value={digits} onChange={(event) => { setDigits(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); setWrongCode(false); }} aria-describedby={error ? 'story-code-error' : undefined} aria-invalid={wrongCode} />
          </div>
          {error && <p id="story-code-error" className="story-gate__error" role="alert">{error}</p>}
          <label className="story-gate__remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Recordar este dispositivo</label>
          <button className="story-gate__submit" type="submit" disabled={digits.length !== 6 || busy}>{busy ? 'Abriendo...' : 'Abrir nuestra historia'} <span aria-hidden="true">♡</span></button>
        </form>
        <p className="story-gate__foot">Solo tú y yo sabemos por qué estos números importan.</p>
      </div>
    </section>
  );
}
