import { memo } from 'react';

// Telaraña de esquina (centro en 0,0): hilos radiales y espirales que cuelgan entre ellos.
const WEB_PATH = 'M0 0L100 0M0 0L95.1 30.9M0 0L80.9 58.8M0 0L58.8 80.9M0 0L30.9 95.1M0 0L0 100M17.9 0Q14.1 2.2 17 5.5Q12.7 6.5 14.4 10.5Q10.1 10.1 10.5 14.4Q6.5 12.7 5.5 17Q2.2 14.1 0 17.9M35.7 0Q28.2 4.5 34 11Q25.5 13 28.9 21Q20.2 20.2 21 28.9Q13 25.5 11 34Q4.5 28.2 0 35.7M53.6 0Q42.3 6.7 50.9 16.6Q38.2 19.5 43.3 31.5Q30.3 30.3 31.5 43.3Q19.5 38.2 16.6 50.9Q6.7 42.3 0 53.6M71.4 0Q56.4 8.9 67.9 22.1Q50.9 25.9 57.8 42Q40.4 40.4 42 57.8Q25.9 50.9 22.1 67.9Q8.9 56.4 0 71.4M89.3 0Q70.5 11.2 84.9 27.6Q63.6 32.4 72.2 52.5Q50.5 50.5 52.5 72.2Q32.4 63.6 27.6 84.9Q11.2 70.5 0 89.3';

const ghosts = [
  { id: 1, size: 74, top: '22%', left: '6%', delay: '0s', duration: '11s' },
  { id: 2, size: 52, top: '48%', left: '84%', delay: '-4s', duration: '13s' },
  { id: 3, size: 96, top: '70%', left: '14%', delay: '-7s', duration: '15s' },
  { id: 4, size: 58, top: '86%', left: '72%', delay: '-2s', duration: '12s' },
];

const bats = [
  { id: 1, top: '16%', size: 46, duration: '24s', delay: '-3s' },
  { id: 2, top: '34%', size: 30, duration: '31s', delay: '-17s' },
  { id: 3, top: '9%', size: 36, duration: '27s', delay: '-11s' },
];

function Web({ className }) {
  return <svg className={className} viewBox="0 0 100 100" aria-hidden="true"><path d={WEB_PATH} /></svg>;
}

function Ghost({ size }) {
  return (
    <svg viewBox="0 0 60 80" width={size} height={size * (80 / 60)} aria-hidden="true">
      <defs>
        <linearGradient id="halloween-ghost-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6f0" />
          <stop offset="0.75" stopColor="#f3e3ec" stopOpacity="0.85" />
          <stop offset="1" stopColor="#e9d3e2" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path d="M30 4C14 4 6 16 6 32v40q5-8 10 0t10 0 10 0 10 0 8 0V32C54 16 46 4 30 4Z" fill="url(#halloween-ghost-fill)" />
      <ellipse cx="22" cy="31" rx="3.6" ry="5" fill="#1b131c" />
      <ellipse cx="38" cy="31" rx="3.6" ry="5" fill="#1b131c" />
      <ellipse cx="30" cy="44" rx="4" ry="5.5" fill="#1b131c" opacity="0.85" />
    </svg>
  );
}

function Bat({ size }) {
  return (
    <svg className="halloween-bat__body" viewBox="0 0 100 46" width={size} height={size * 0.46} aria-hidden="true">
      <path d="M50 16c-2-5-5-6-7-3-4-6-12-10-24-8 6 4 8 10 6 16-6-4-14-4-22 0 10 4 16 10 18 18 6-6 14-8 20-6 2-6 6-8 9-4 3-4 7-2 9 4 6-2 14 0 20 6 2-8 8-14 18-18-8-4-16-4-22 0-2-6 0-12 6-16-12-2-20 2-24 8-2-3-5-2-7 3Z" />
    </svg>
  );
}

function Spider() {
  return (
    <svg className="halloween-spider__body" viewBox="0 0 40 34" aria-hidden="true">
      <g fill="none" stroke="#1d141d" strokeWidth="1.6" strokeLinecap="round">
        <path d="M14 14 4 6M14 17 2 16M14 20 4 27M16 22 9 32M26 14 36 6M26 17 38 16M26 20 36 27M24 22 31 32" />
      </g>
      <ellipse cx="20" cy="18" rx="7" ry="8" fill="#1d141d" />
      <circle cx="20" cy="9" r="4.5" fill="#1d141d" />
      <circle cx="18.4" cy="8.6" r="0.9" fill="#e7a064" />
      <circle cx="21.6" cy="8.6" r="0.9" fill="#e7a064" />
    </svg>
  );
}

// Decoración de fondo solo para octubre. Es estática: memo evita volver a dibujarla cada segundo con el contador.
function HalloweenDecor() {
  return (
    <div className="halloween-decor" aria-hidden="true">
      <div className="halloween-moon"><span /><span /><span /></div>
      <Web className="halloween-web halloween-web--left" />
      <Web className="halloween-web halloween-web--right" />
      <div className="halloween-spider"><span className="halloween-spider__thread" /><Spider /></div>
      {ghosts.map((ghost) => (
        <div className={`halloween-ghost halloween-ghost--${ghost.id}`} key={ghost.id} style={{ top: ghost.top, left: ghost.left, animationDelay: ghost.delay, animationDuration: ghost.duration }}>
          <Ghost size={ghost.size} />
        </div>
      ))}
      {bats.map((bat) => (
        <div className={`halloween-bat halloween-bat--${bat.id}`} key={bat.id} style={{ top: bat.top, animationDuration: bat.duration, animationDelay: bat.delay }}>
          <Bat size={bat.size} />
        </div>
      ))}
      <div className="halloween-fog halloween-fog--back" />
      <div className="halloween-fog halloween-fog--front" />
    </div>
  );
}

export default memo(HalloweenDecor);
