import { useRef } from 'react';

function CloseButton({ onClick }) {
  return <button type="button" className="letter-paper__close" onClick={onClick} aria-label="Cerrar carta"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg></button>;
}

function LetterDialog({ dialogRef, titleId, date, title, children }) {
  return (
    <dialog className="letter-dialog" ref={dialogRef} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} aria-labelledby={titleId}>
      <div className="letter-paper">
        <CloseButton onClick={() => dialogRef.current?.close()} />
        <span className="letter-paper__flower" aria-hidden="true">♡</span>
        <p className="letter-paper__date">{date}</p>
        <h3 id={titleId}>{title}</h3>
        {children}
        <p className="letter-paper__signature">Con muchísimo amor, <strong>FA ❤️</strong></p>
      </div>
    </dialog>
  );
}

export default function LetterPreview() {
  const currentRef = useRef(null);
  const archiveRef = useRef(null);

  return (
    <>
      <div className="mailbox-scene">
        <span className="mailbox-scene__spark mailbox-scene__spark--one" aria-hidden="true">✦</span>
        <span className="mailbox-scene__spark mailbox-scene__spark--two" aria-hidden="true">♡</span>
        <button className="love-mailbox" type="button" onClick={() => currentRef.current?.showModal()} aria-label="Abrir la carta nueva">
          <span className="love-mailbox__letter" aria-hidden="true"><small>PARA GRACE</small><b>♡</b></span>
          <span className="love-mailbox__box" aria-hidden="true"><span className="love-mailbox__door"><b>F &amp; G</b><i>♡</i></span></span>
          <span className="love-mailbox__flag" aria-hidden="true"><i /><b>♡</b></span>
          <span className="love-mailbox__post" aria-hidden="true" />
          <span className="love-mailbox__ground" aria-hidden="true" />
          <span className="love-mailbox__hint">Tienes una carta nueva</span>
        </button>
      </div>

      <div className="letter-archive">
        <div className="letter-archive__heading"><span>CARTAS QUE GUARDAMOS</span><small>01 carta</small></div>
        <div className="letter-shelf">
          <button className="letter-keepsake" type="button" onClick={() => archiveRef.current?.showModal()} aria-label="Abrir carta del 21 de septiembre">
            <span className="letter-keepsake__stamp" aria-hidden="true">♡</span>
            <span className="letter-keepsake__date">21 · 09</span>
            <strong>Día del Amor</strong>
            <small>Una carta para volver a leer</small>
            <span className="letter-keepsake__seal" aria-hidden="true">F &amp; G</span>
          </button>
        </div>
      </div>

      <LetterDialog dialogRef={currentRef} titleId="current-letter-title" date="DOS AÑOS Y CINCO MESES" title="Mi amor:">
        <p>Mi amorcito, felices 2 años y 5 meses. Te amo demasiado, mi amor de mi vida. Gracias por todo, por cada detalle, por siempre estar conmigo y por amarme cada día más.</p>
        <p>Sé que no fue un mes fácil para nosotros, que pasamos por muchas cosas y que estos últimos días fueron especialmente difíciles por todo lo que está pasando con tu familia. Pero quiero que sepas que pase lo que pase y al final de cada día, siempre estaré contigo y para ti, mi amor. Quiero decirte que te elijo cada día y que quiero seguir construyendo muchas cosas bonitas a tu lado.</p>
        <p>Quiero ser siempre ese hombro en el que puedas apoyarte y desahogarte, ese abrazo que te abrigue, calme y te haga sentir segura, y ese beso en la frente acompañado de un “te amo” que te recuerde lo especial, amada y maravillosa que eres. Quiero que sepas que conmigo siempre puedes ser tú, que no tienes que guardarte nada y que tanto en los días bonitos como en los más difíciles, voy a querer acompañarte y estar a tu lado.</p>
        <p>Te amo muchísimo, mi amor. Gracias por estos 2 años y 5 meses tan bonitos, por cada momento que hemos compartido, por todo lo que hemos aprendido juntos y por permitirme seguir formando parte de tu vida. Me siento muy afortunado de tenerte a mi lado y espero que nos queden muchísimos meses y años más para seguir amándonos, creciendo juntos y creando recuerdos que sean solo nuestros.</p>
        <p>Te amo demasiado, Grace. Feliz 2 años y 5 meses, mi niña bonita.</p>
      </LetterDialog>

      <LetterDialog dialogRef={archiveRef} titleId="archived-letter-title" date="21 DE SEPTIEMBRE DE 2026" title="Bueno mi amorcito:">
        <p>Quería desearte un muy feliz Día del Amor. Te amo muchísimo mi vida, y de verdad no sabes cuánto amo poder compartir este día a tu lado y tener la oportunidad de hacerte sentir lo más especial posible, así como tú lo haces conmigo.</p>
        <p>Hoy quiero recordarte todo el amor que te tengo, todo el cariño que siento por ti y todo el esfuerzo que pongo día tras día para seguir conquistando tu corazón, para seguir haciendo que me elijas cada día y, sobre todo, para que puedas seguir enamorándote de mí tanto como yo lo hago de ti.</p>
        <p>Es difícil expresar con palabras todo lo que pienso y siento por ti, Grace. A veces siento que cualquier palabra se queda corta. Pero todas terminan llevándome a la misma conclusión: quiero seguir eligiéndote cada día y seguir amándote cada vez más.</p>
        <p>Gracias por enseñarme tanto, por ayudarme a crecer y por cada momento, cada sonrisa, cada abrazo y cada recuerdo que hemos construido juntos.</p>
        <p>Eres uno de los regalos más bonitos que me ha dado la vida. Te amo con toda mi alma, con todo mi corazón y con todo lo que soy.</p>
        <p>Feliz Día del Amor, mi vida.<br />Hoy, mañana y todos los días que me queden, quiero seguir eligiéndote.</p>
      </LetterDialog>
    </>
  );
}
