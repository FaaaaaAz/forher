import { useEffect, useRef, useState } from 'react';
import firstTrack from '../../assets/audio/noheybeeAudioor.mp3';
import secondTrack from '../../assets/audio/uprosesAudiohs.mp3';

const tracks = [firstTrack, secondTrack];
const VOLUME_KEY = 'fabian-grace-music-volume';

function SpeakerIcon({ muted }) {
  return muted
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 1.5 4 4m0-4-4 4" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12-1a6 6 0 0 1 0 8m2-11a9 9 0 0 1 0 14" /></svg>;
}

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem(VOLUME_KEY);
    if (stored === null) return 0.45;
    const saved = Number(stored);
    return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.45;
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

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

  function nextTrack() {
    setTrack((current) => (current + 1) % tracks.length);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    audio.play().catch(() => setPlaying(false));
  }, [track]);

  return (
    <aside className="music-player" aria-label="Música de fondo">
      <audio ref={audioRef} src={tracks[track]} muted={muted} onEnded={nextTrack} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} preload="metadata" />
      <button type="button" onClick={togglePlaying} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>{playing ? 'Ⅱ' : '▶'}</button>
      <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Activar sonido' : 'Silenciar música'}><SpeakerIcon muted={muted} /></button>
      <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volumen de la música" />
      <span aria-hidden="true">♪ {track + 1}/2</span>
    </aside>
  );
}
