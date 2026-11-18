import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BirdMark from './BirdMark.jsx';
import { clearWorld, drawTicket, formatNumber, setWorld, startViewers, useCosecha } from './cosechaStore.js';

// Tipografías solo para estos dos días: se piden al activar el tema. Sin internet se usan las del sistema.
const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;900&display=swap';

// Qué mundo es cada parte de la página. Las secciones nuevas lo dicen con data-world.
const WORLDS = [
  ['.welcome', 'a'], ['.story-gate', 'a'], ['.bloom-intro', 'a'], ['.together', 'a'],
  ['.garden-section', 'a'], ['.memories-section', 'a'], ['.letter-section', 'a'], ['.plans-section', 'a'],
  ['[data-world]', null],
];
const WORLD_SELECTOR = WORLDS.map(([selector]) => selector).join(',');

function useFonts() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.append(link);
    return () => link.remove();
  }, []);
}

// Marca en <html data-world> la sección que cruza el centro de la pantalla.
function useWorldTracking() {
  useEffect(() => {
    const root = document.querySelector('.site-shell');
    if (!root) return undefined;
    const visible = new Map();
    let io;
    let timer;
    const worldOf = (element) => element.dataset.world || WORLDS.find(([selector]) => element.matches(selector))?.[1] || 'a';

    function scan() {
      io?.disconnect();
      visible.clear();
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.set(entry.target, worldOf(entry.target)) : visible.delete(entry.target)));
        const current = [...visible.values()].pop();
        if (current) setWorld(current);
      }, { rootMargin: '-48% 0px -48% 0px' });
      root.querySelectorAll(WORLD_SELECTOR).forEach((element) => io.observe(element));
    }

    scan();
    const mutations = new MutationObserver(() => { window.clearTimeout(timer); timer = window.setTimeout(scan, 250); });
    mutations.observe(root, { childList: true, subtree: true });
    return () => { io?.disconnect(); mutations.disconnect(); window.clearTimeout(timer); clearWorld(); };
  }, []);
}

function LotteryNotice() {
  const { ticket } = useCosecha();
  const [phase, setPhase] = useState(ticket ? 'done' : 'ask');
  const [rolling, setRolling] = useState('00000');

  useEffect(() => {
    if (phase === 'refused') {
      const timeout = window.setTimeout(() => setPhase('drawing'), 2200);
      return () => window.clearTimeout(timeout);
    }
    if (phase === 'drawing') {
      const roll = window.setInterval(() => setRolling(String(Math.floor(Math.random() * 99999)).padStart(5, '0')), 70);
      const stop = window.setTimeout(() => { drawTicket(); setPhase('result'); }, 1500);
      return () => { window.clearInterval(roll); window.clearTimeout(stop); };
    }
    if (phase === 'result') {
      const timeout = window.setTimeout(() => setPhase('done'), 9000);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <section className={`cosecha-lottery cosecha-lottery--${phase}`} aria-label="Aviso de cookies" aria-live="polite">
      <p className="cosecha-lottery__eyebrow"><BirdMark variant="resistance" /> AVISO DE COOKIES</p>
      {phase === 'ask' && <>
        <p>Usamos cookies para mejorar tu experiencia. Al aceptarlas, tu nombre entra en el sorteo de esta temporada.</p>
        <div className="cosecha-lottery__actions">
          <button type="button" onClick={() => setPhase('drawing')}>Aceptar y participar</button>
          <button type="button" onClick={() => setPhase('refused')}>Rechazar</button>
        </div>
      </>}
      {phase === 'refused' && <p><strong>Rechazar no está disponible en esta región.</strong> Tu nombre ya estaba en la urna.</p>}
      {phase === 'drawing' && <p>Sacando un papel de la urna… <span className="cosecha-lottery__roll">{rolling}</span></p>}
      {phase === 'result' && ticket && <>
        <p className="cosecha-lottery__result">Tu número <b>{ticket.number}</b><small>de {formatNumber(ticket.total)} nombres</small></p>
        <p>Que el azar te mire con buenos ojos.</p>
        <div className="cosecha-lottery__actions"><button type="button" onClick={() => setPhase('done')}>Entendido</button></div>
      </>}
    </section>
  );
}

function ViewerCounter() {
  const { viewers, watched, ticket } = useCosecha();
  const [open, setOpen] = useState(false);
  useEffect(() => startViewers(), []);

  return (
    <div className="cosecha-viewers">
      <button type="button" className="cosecha-viewers__pill" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="cosecha-viewers__dot" aria-hidden="true" /> EN VIVO <b>{formatNumber(viewers)}</b> <span>espectadores</span>
      </button>
      {(watched > 18 || open) && <p className="cosecha-viewers__you">Uno de ellos eres tú.</p>}
      {open && <p className="cosecha-viewers__note">El número sube mientras miras. Así se sostiene el espectáculo: alguien siempre está mirando.{ticket && <> Tu boleto: N.º {ticket.number}.</>}</p>}
    </div>
  );
}

function seeded(seed) {
  let value = seed * 9301 + 49297;
  return () => { value = (value * 9301 + 49297) % 233280; return value / 233280; };
}

const COLORS = ['#f2d8a7', '#d0703a', '#a39d92', '#c8b27a', '#e4ded3', '#6e6a63'];

// Copos de ceniza (posición, tamaño y ritmo fijos para que no cambien en cada render).
const ASHES = Array.from({ length: 48 }, (_, index) => {
  const random = seeded(index + 101);
  const size = 2 + random() * 5;
  return {
    '--x': `${(random() * 100).toFixed(1)}%`,
    '--s': `${size.toFixed(1)}px`,
    '--o': (0.25 + random() * 0.45).toFixed(2),
    '--b': size > 5 ? '1px' : '0px',
    '--d': `${(16 + random() * 22).toFixed(1)}s`,
    '--delay': `${(-random() * 38).toFixed(1)}s`,
    '--drift': `${(random() * 80 - 40).toFixed(0)}px`,
  };
});

// Brasas que suben como de una fogata, con parpadeo.
const EMBERS = Array.from({ length: 26 }, (_, index) => {
  const random = seeded(index + 501);
  return {
    '--x': `${(random() * 100).toFixed(1)}%`,
    '--s': `${(1.5 + random() * 2.5).toFixed(1)}px`,
    '--d': `${(9 + random() * 12).toFixed(1)}s`,
    '--delay': `${(-random() * 20).toFixed(1)}s`,
    '--drift': `${(random() * 120 - 60).toFixed(0)}px`,
  };
});

function Spectacle() {
  const { spectacle } = useCosecha();
  const [active, setActive] = useState(0);
  const lastSeen = useRef(spectacle);

  useEffect(() => {
    if (spectacle === lastSeen.current) return undefined;
    lastSeen.current = spectacle;
    setActive(spectacle);
    const timeout = window.setTimeout(() => setActive(0), 4200);
    const close = (event) => { if (event.key === 'Escape') setActive(0); };
    window.addEventListener('keydown', close);
    return () => { window.clearTimeout(timeout); window.removeEventListener('keydown', close); };
  }, [spectacle]);

  const particles = useMemo(() => {
    const random = seeded(active + 7);
    return Array.from({ length: 72 }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const distance = 25 + random() * 55;
      return {
        id: index,
        shape: index % 4 === 0 ? 'spark' : 'confetti',
        style: {
          '--x': `${Math.cos(angle) * distance}vmax`,
          '--y': `${Math.sin(angle) * distance * 0.8}vmax`,
          '--r': `${Math.round(random() * 720 - 360)}deg`,
          '--c': COLORS[index % COLORS.length],
          '--d': `${(random() * 0.35).toFixed(2)}s`,
          '--s': (0.6 + random() * 1.1).toFixed(2),
        },
      };
    });
  }, [active]);

  if (!active) return null;

  return createPortal(
    <div className="cosecha-spectacle" key={active} onClick={() => setActive(0)} role="status">
      <span className="cosecha-spectacle__flash" aria-hidden="true" />
      <span className="cosecha-spectacle__beam cosecha-spectacle__beam--left" aria-hidden="true" />
      <span className="cosecha-spectacle__beam cosecha-spectacle__beam--right" aria-hidden="true" />
      <div className="cosecha-spectacle__burst" aria-hidden="true">
        {particles.map((particle) => <i className={`cosecha-spectacle__${particle.shape}`} key={particle.id} style={particle.style} />)}
      </div>
      <svg className="cosecha-spectacle__drop" viewBox="0 0 80 96" aria-hidden="true">
        <defs>
          <linearGradient id="cosecha-canopy" x1="0" x2="1">
            <stop offset="0" stopColor="#6b5644" /><stop offset=".5" stopColor="#c8b27a" /><stop offset="1" stopColor="#8f5a3c" />
          </linearGradient>
        </defs>
        <path d="M4 32Q40-8 76 32q-6-5-12 0-6-5-12 0-6-5-12 0-6-5-12 0-6-5-12 0-6-5-12 0Z" fill="url(#cosecha-canopy)" />
        <path d="M5 32 32 66M75 32 48 66M28 32l8 34M52 32l-8 34" stroke="#fff4d6" strokeWidth=".8" opacity=".8" />
        <rect x="28" y="64" width="24" height="20" rx="2" fill="#8f6a44" />
        <path d="M40 64v20M28 72h24" stroke="#c8b27a" strokeWidth="3" />
      </svg>
      <div className="cosecha-spectacle__copy">
        <p className="cosecha-spectacle__script">Para ti</p>
        <h2>Tu obsequio</h2>
        <p className="cosecha-spectacle__gain">+1 abrazo que te debo</p>
        <p className="cosecha-spectacle__truth">Sin cámaras. Sin público. Solo nosotros.</p>
      </div>
    </div>,
    document.body,
  );
}

function CosechaLayer({ inStory }) {
  const { world } = useCosecha();
  useFonts();
  useWorldTracking();

  return (
    <>
      <div className="cosecha-ambient" aria-hidden="true">
        <span className="cosecha-ambient__dust" />
        <span className="cosecha-ambient__fire" />
        <span className="cosecha-ambient__ash">{ASHES.map((style, index) => <i key={index} style={style} />)}</span>
        <span className="cosecha-ambient__embers">{EMBERS.map((style, index) => <i key={index} style={style} />)}</span>
      </div>
      <div className="cosecha-vignette" aria-hidden="true" />
      <div className={`cosecha-hud cosecha-hud--${world}`}>
        <LotteryNotice />
        {inStory && <ViewerCounter />}
      </div>
      <Spectacle />
    </>
  );
}

export default memo(CosechaLayer);
