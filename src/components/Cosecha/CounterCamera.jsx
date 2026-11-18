import { memo, useEffect, useRef } from 'react';
import mentor from '../../assets/cosecha/mentor.webp';

const FOCUS_EVERY = 7000;
const FOCUS_LENGTH = 1900;
const pad = (value) => String(value).padStart(2, '0');

// El contador "en vivo": visor de cámara (esquinas, REC, código de tiempo) y el mentor mirando la cuenta.
// De rato en rato la cámara reenfoca como en una película: desenfoque, enfoque y cuadro fijado en su cara.
function CounterCamera() {
  const rootRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    const section = rootRef.current.closest('.together');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let visible = false;
    let frame = 0;
    let release = 0;

    // Código de tiempo a 24 cuadros por segundo; se escribe directo para no redibujar React.
    function tick(now) {
      const frames = Math.floor((now - start) / (1000 / 24));
      const seconds = Math.floor(frames / 24);
      timeRef.current.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames % 24)}`;
      if (visible) frame = requestAnimationFrame(tick);
    }

    function focus() {
      if (!visible || reduce || document.hidden) return;
      section.classList.remove('is-focusing');
      void section.offsetWidth;
      section.classList.add('is-focusing');
      window.clearTimeout(release);
      release = window.setTimeout(() => section.classList.remove('is-focusing'), FOCUS_LENGTH);
    }

    const watcher = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) {
        frame = requestAnimationFrame(tick);
        if (!wasVisible) window.setTimeout(focus, 900);
      }
    }, { threshold: 0.35 });
    watcher.observe(section);
    const interval = window.setInterval(focus, FOCUS_EVERY);

    return () => {
      watcher.disconnect();
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
      window.clearTimeout(release);
      section.classList.remove('is-focusing');
    };
  }, []);

  return (
    <>
      <div className="camera-vf" ref={rootRef} aria-hidden="true">
        <span className="camera-vf__bar camera-vf__bar--top" />
        <span className="camera-vf__bar camera-vf__bar--bottom" />
        <span className="camera-vf__grain" />
        <span className="camera-vf__corner camera-vf__corner--tl" />
        <span className="camera-vf__corner camera-vf__corner--tr" />
        <span className="camera-vf__corner camera-vf__corner--bl" />
        <span className="camera-vf__corner camera-vf__corner--br" />
        <span className="camera-vf__cross" />
        <span className="camera-vf__rec"><i /> REC</span>
        <span className="camera-vf__time" ref={timeRef}>00:00:00:00</span>
        <span className="camera-vf__meta">24 FPS · ISO 800 · 1/48</span>
        <span className="camera-vf__af">AF</span>
      </div>
      <figure className="mentor-cameo">
        <img src={mentor} alt="El mentor, mirando de reojo la cuenta de los días" loading="lazy" decoding="async" />
        <span className="mentor-cameo__focus" aria-hidden="true" />
      </figure>
    </>
  );
}

export default memo(CounterCamera);
