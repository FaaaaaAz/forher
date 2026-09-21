export default function WelcomeScreen({ onOpen, season }) {
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="welcome__aura" aria-hidden="true" />
      <div className="welcome__top"><span className="wordmark"><span className="wordmark__symbol">✿</span> F &amp; G</span><span>UN LUGAR PARA NOSOTROS DOS</span></div>
      <div className="welcome__content">
        <p className="eyebrow welcome__eyebrow"><span className="eyebrow__line" /> CON AMOR <span className="eyebrow__line" /></p>
        <h1 id="welcome-title" className="welcome__title">
          Fabian <span className="welcome__amp">&amp;</span><br />
          <em>Grace.</em>
        </h1>
        <p className="welcome__description">Nuestra historia tiene un lugar propio. Para guardar lo vivido y seguir llenándolo juntos.</p>
        <p className="welcome__season"><span aria-hidden="true">✿</span> {season.label} <span aria-hidden="true">♡</span></p>
        <button className="open-button" type="button" onClick={onOpen}>
          Entrar a nuestra historia
        </button>
      </div>
      <p className="welcome__footer">DESDE EL 28 DE ABRIL DE 2024 <span>✦</span> Y TODO LO QUE VIENE</p>
    </section>
  );
}
