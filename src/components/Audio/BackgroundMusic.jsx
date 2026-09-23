import { useEffect, useRef, useState } from 'react';
import noHeyBee from '../../assets/audio/noheybeeAudioor.mp3';
import upRoses from '../../assets/audio/uprosesAudiohs.mp3';

const tracks = [
  { src: upRoses, name: 'Coming Up Roses' },
  { src: noHeyBee, name: 'Honeybee' },
];
const VOLUME_KEY = 'fabian-grace-music-volume';

function SpeakerIcon({ muted }) {
  return muted
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 1.5 4 4m0-4-4 4" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12-1a6 6 0 0 1 0 8m2-11a9 9 0 0 1 0 14" /></svg>;
}

function PlayerIcon({ name }) {
  if (name === 'music') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l9-2v12M9 18a3 3 0 1 1-3-3h3m9 1a3 3 0 1 1-3-3h3" /></svg>;
  if (name === 'play') return <svg className="music-player__fill-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5V7Z" /></svg>;
  if (name === 'pause') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7v10m6-10v10" /></svg>;
  if (name === 'previous') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 7-5 5 5 5" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 7 5 5-5 5" /></svg>;
}

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem(VOLUME_KEY);
    if (stored === null) return 0.45;
    const saved = Number(stored);
    return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.45;
  });

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  async function togglePlaying() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function changeTrack(direction) {
    setTrack((current) => (current + direction + tracks.length) % tracks.length);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [track]);

  return (
    <aside className={`music-player${expanded ? ' music-player--expanded' : ''}`} aria-label="Música de fondo">
      <audio ref={audioRef} src={tracks[track].src} muted={muted} onEnded={() => changeTrack(1)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} preload="metadata" />
      <button className="music-player__toggle" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-label={expanded ? 'Ocultar controles de música' : 'Mostrar controles de música'}><PlayerIcon name="music" /><svg className="music-player__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d={expanded ? 'm7 14 5-5 5 5' : 'm7 10 5 5 5-5'} /></svg></button>
      {expanded && <div className="music-player__panel">
        <span className="music-player__track">{tracks[track].name}</span>
        <div className="music-player__buttons">
          <button type="button" onClick={() => changeTrack(-1)} aria-label="Canción anterior"><PlayerIcon name="previous" /></button>
          <button type="button" onClick={togglePlaying} aria-label={playing ? 'Pausar música' : 'Reproducir música'}><PlayerIcon name={playing ? 'pause' : 'play'} /></button>
          <button type="button" onClick={() => changeTrack(1)} aria-label="Siguiente canción"><PlayerIcon name="next" /></button>
          <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Activar sonido' : 'Silenciar música'}><SpeakerIcon muted={muted} /></button>
        </div>
        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volumen de la música" />
      </div>}
    </aside>
  );
}
