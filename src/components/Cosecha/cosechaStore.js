import { useSyncExternalStore } from 'react';

// Estado compartido del tema de la película: espectadores, obsequios, boleto del sorteo y
// en qué "mundo" de la página está la persona (a: periferia, b: centro, end: silencio final).
const TICKET_KEY = 'fabian-grace-cosecha-ticket';

function readTicket() {
  try {
    const raw = window.localStorage.getItem(TICKET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let state = {
  viewers: 12_000 + Math.floor(Math.random() * 900),
  watched: 0,
  world: 'a',
  gifts: 0,
  laughs: 0,
  spectacle: 0,
  ticket: readTicket(),
};
const listeners = new Set();

function update(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCosecha() {
  return useSyncExternalStore(subscribe, () => state);
}

export function setWorld(world) {
  if (world === state.world) return;
  document.documentElement.dataset.world = world;
  update({ world });
}

export function clearWorld() {
  delete document.documentElement.dataset.world;
}

// El contador sube solo mientras se mira; en el centro sube más rápido.
export function startViewers() {
  const interval = window.setInterval(() => {
    if (document.hidden || state.world === 'end') return;
    const step = state.world === 'b' ? 40 + Math.floor(Math.random() * 160) : 2 + Math.floor(Math.random() * 18);
    update({ viewers: state.viewers + step, watched: state.watched + 1.2 });
  }, 1200);
  return () => window.clearInterval(interval);
}

// Cada obsequio abierto suma un abrazo pendiente y unas cuantas risas más.
export function openGift() {
  update({
    gifts: state.gifts + 1,
    laughs: state.laughs + 7 + Math.floor(Math.random() * 15),
    spectacle: state.spectacle + 1,
  });
}

export function drawTicket() {
  const total = 14_000 + Math.floor(Math.random() * 900);
  const ticket = { number: String(1 + Math.floor(Math.random() * total)).padStart(5, '0'), total };
  try { window.localStorage.setItem(TICKET_KEY, JSON.stringify(ticket)); } catch { /* sin almacenamiento: vale solo esta visita */ }
  update({ ticket });
  return ticket;
}

export const formatNumber = (value, digits = 0) => new Intl.NumberFormat('es-BO', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
