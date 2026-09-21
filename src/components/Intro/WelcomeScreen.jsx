export default function WelcomeScreen({ onOpen, season }) {
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="welcome__aura" aria-hidden="true" />
      <div className="welcome__content">
        <p className="eyebrow welcome__eyebrow"><span className="eyebrow__line" /> UNA PEQUEÑA SORPRESA <span className="eyebrow__line" /></p>
        <h1 id="welcome-title" className="welcome__title">
          Tengo algo<br />
          <em>para ti...</em>
        </h1>
        <p className="welcome__description">Hay historias que merecen florecer despacio.</p>
        <p className="welcome__season"><span aria-hidden="true">✳</span> {season.label}</p>
        <button className="open-button" type="button" onClick={onOpen}>
          Abrir 💛 <span className="open-button__arrow" aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="welcome__footer">HECHO CON AMOR · SOLO PARA TI</p>
    </section>
  );
}
