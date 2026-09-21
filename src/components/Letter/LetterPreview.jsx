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
          <h3 id="letter-paper-title">Bueno mi amorcito:</h3>
          <p>Quería desearte un muy feliz Día del Amor. Te amo muchísimo mi vida, y de verdad no sabes cuánto amo poder compartir este día a tu lado y tener la oportunidad de hacerte sentir lo más especial posible, así como tú lo haces conmigo.</p>
          <p>Hoy quiero recordarte todo el amor que te tengo, todo el cariño que siento por ti y todo el esfuerzo que pongo día tras día para seguir conquistando tu corazón, para seguir haciendo que me elijas cada día y, sobre todo, para que puedas seguir enamorándote de mí tanto como yo lo hago de ti.</p>
          <p>Es difícil expresar con palabras todo lo que pienso y siento por ti, Grace. A veces siento que cualquier palabra se queda corta. Pero de alguna manera, todas terminan llevándome a la misma conclusión: quiero seguir eligiéndote cada día y seguir amándote cada vez más.</p>
          <p>No sé si siempre hago todo de la mejor manera para ser el mejor novio que puedas tener. Tampoco sé si soy la persona correcta para cuidar y proteger ese corazón que me confías. Pero sí sé que todos los días doy lo mejor de mí. Me esfuerzo por ser yo mismo, pero también por convertirme en esa persona que pueda darte todo lo que mereces, alguien que te dé muchísimo amor, que te cuide, te valore, te acompañe, te proteja y te ame de una manera que nunca antes había amado.</p>
          <p>Gracias por enseñarme tanto, por ayudarme a crecer y también por permitirme equivocarme y aprender de mis errores. Gracias por cada momento, por cada sonrisa, por cada abrazo y por cada recuerdo que hemos construido juntos.</p>
          <p>Eres uno de los regalos más bonitos que me ha dado la vida, y por eso te has convertido en una parte tan importante de ella. Te amo con toda mi alma, con todo mi corazón y con todo lo que soy.</p>
          <p>Feliz Día del Amor, mi vida.<br />Hoy, mañana y todos los días que me queden, quiero seguir eligiéndote.</p>
          <p className="letter-paper__signature">Con muchísimo amor, <strong>FA ❤️</strong></p>
        </div>
      </dialog>
    </>
  );
}
