import { useRef, useState } from 'react';
import poster from '../../assets/cosecha/poster.webp';

// Las entradas reales de la función.
const MOVIE = { saga: 'Los Juegos del Hambre', title: 'Amanecer en la cosecha', day: 'Miércoles 18 de noviembre', shortDay: 'Mié 18 nov', time: '19:30' };
const TICKETS = [{ number: 1, seat: 'P22' }, { number: 2, seat: 'P23' }];
const OPEN_DELAY = 950;

function MailboxTicket({ number, seat }) {
  return (
    <span className={`cine-ticket cine-ticket--${number}`} aria-hidden="true">
      <span className="cine-ticket__art"><img src={poster} alt="" /><b>{seat}</b></span>
      <span className="cine-ticket__info">
        <small>{MOVIE.saga}</small>
        <strong>{MOVIE.title}</strong>
        <span>{MOVIE.shortDay} · {MOVIE.time}</span>
        <em>Admite uno · {number} de 2</em>
      </span>
    </span>
  );
}

function BigTicket({ number, seat, index }) {
  return (
    <article className="big-ticket" style={{ '--i': index }} aria-label={`Entrada ${number} de 2, asiento ${seat}`}>
      <div className="big-ticket__art">
        <img src={poster} alt="Póster de la película: una serpiente y un ave rodeadas de flores" />
        <span className="big-ticket__seat">Asiento<b>{seat}</b></span>
      </div>
      <div className="big-ticket__body">
        <small>{MOVIE.saga}</small>
        <h4>{MOVIE.title}</h4>
        <dl>
          <div><dt>Fecha</dt><dd>{MOVIE.day}</dd></div>
          <div><dt>Horario</dt><dd>{MOVIE.time}</dd></div>
          <div><dt>Asiento</dt><dd>{seat}</dd></div>
          <div><dt>Entrada</dt><dd>{number} de 2</dd></div>
        </dl>
      </div>
      <div className="big-ticket__stub" aria-hidden="true">
        <span>Admite uno</span>
        <i className="big-ticket__barcode" />
        <span>N.º 0{number}</span>
      </div>
    </article>
  );
}

// El buzón con las dos entradas. Al tocarlo, las entradas salen volando y se abren en grande.
export default function MovieTickets({ mailboxParts }) {
  const dialogRef = useRef(null);
  const [opening, setOpening] = useState(false);

  function open() {
    if (opening) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setOpening(true);
    window.setTimeout(() => dialogRef.current?.showModal(), reduce ? 0 : OPEN_DELAY);
  }

  return (
    <>
      <button className={`love-mailbox love-mailbox--tickets${opening ? ' is-opening' : ''}`} type="button" onClick={open} aria-label={`Abrir el buzón: dos entradas para ${MOVIE.saga}: ${MOVIE.title}, ${MOVIE.day} a las ${MOVIE.time}`}>
        {TICKETS.map((ticket) => <MailboxTicket key={ticket.number} {...ticket} />)}
        <span className="love-mailbox__burst" aria-hidden="true" />
        {mailboxParts}
        <span className="love-mailbox__hint">{opening ? 'Abriendo el buzón…' : 'Toca el buzón: hay dos entradas'}</span>
      </button>

      <dialog className="ticket-dialog" ref={dialogRef} onClose={() => setOpening(false)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} aria-labelledby="ticket-dialog-title">
        <div className="ticket-dialog__content">
          <button className="ticket-dialog__close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar las entradas"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg></button>
          <p className="ticket-dialog__eyebrow">Resumen de compra</p>
          <h3 id="ticket-dialog-title">Nuestra cita en el cine</h3>
          <div className="ticket-dialog__tickets">
            {TICKETS.map((ticket, index) => <BigTicket key={ticket.number} index={index} {...ticket} />)}
          </div>
          <p className="ticket-dialog__summary">2 entradas · Asientos P22 y P23 · {MOVIE.day}, {MOVIE.time}</p>
          <p className="ticket-dialog__note">Una para ti y una para mí. Y que la suerte esté siempre de nuestro lado.</p>
        </div>
      </dialog>
    </>
  );
}
