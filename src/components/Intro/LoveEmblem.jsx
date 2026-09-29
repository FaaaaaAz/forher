export default function LoveEmblem({ halloween = false }) {
  return (
    <div className={`love-emblem${halloween ? ' love-emblem--halloween' : ''}`} role="img" aria-label={halloween ? 'Fabian y Grace bajo una luna de Halloween' : 'Dos corazones unidos, Fabian y Grace'}>
      <span className="love-emblem__glow" aria-hidden="true" />
      <span className="love-emblem__orbit love-emblem__orbit--outer" aria-hidden="true" />
      <span className="love-emblem__orbit love-emblem__orbit--inner" aria-hidden="true" />
      <span className="love-emblem__heart love-emblem__heart--left" aria-hidden="true">♡</span>
      <span className="love-emblem__heart love-emblem__heart--right" aria-hidden="true">♡</span>
      <span className="love-emblem__initials" aria-hidden="true"><b>F</b><i>&amp;</i><b>G</b></span>
      <span className="love-emblem__spark love-emblem__spark--one" aria-hidden="true">✦</span>
      <span className="love-emblem__spark love-emblem__spark--two" aria-hidden="true">✦</span>
      <span className="love-emblem__spark love-emblem__spark--three" aria-hidden="true">·</span>
    </div>
  );
}
