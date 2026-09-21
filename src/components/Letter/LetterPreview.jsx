import { useRef } from 'react';

export default function LetterPreview() {
  const dialogRef = useRef(null);

  return (
    <>
      <button className="letter-envelope" type="button" onClick={() => dialogRef.current?.showModal()} aria-label="Abrir carta para Grace">
        <span className="letter-envelope__paper" aria-hidden="true">Para Grace ♡</span>
        <span className="letter-envelope__body" aria-hidden="true"><span>♡</span></span>
        <span className="letter-envelope__hint">Toca para abrir la carta</span>
      </button>
      <dialog className="letter-dialog" ref={dialogRef} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} aria-labelledby="letter-paper-title">
        <div className="letter-paper">
          <button type="button" className="letter-paper__close" onClick={() => dialogRef.current?.close()} aria-label="Cerrar carta">×</button>
          <span className="letter-paper__flower" aria-hidden="true">✿</span>
          <p className="letter-paper__date">UNA CARTA PARA TI</p>
          <h3 id="letter-paper-title">Querida Grace,</h3>
          <p>Gracias por hacer especiales incluso los días más sencillos. Me encanta compartir contigo las risas, las conversaciones y esos pequeños momentos que terminan siendo los más importantes.</p>
          <p>Esta historia sigue creciendo, y me hace muy feliz vivirla a tu lado. Ojalá volvamos a esta página muchas veces y recordemos cuánto hemos construido juntos.</p>
          <p className="letter-paper__signature">Con mucho amor,<br /><strong>Fabian ♡</strong></p>
        </div>
      </dialog>
    </>
  );
}
