import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { INSTALL_DISMISSED_KEY } from '../../data/storageKeys.js';

const DISMISS_DAYS = 5;

function isInstalled() {
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

// 'safari' | 'ios-other' (Chrome, Firefox o Edge en iPhone) | null
function getIosBrowser() {
  const agent = window.navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(agent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  if (!isIos) return null;
  return /CriOS|FxiOS|EdgiOS/i.test(agent) ? 'ios-other' : 'safari';
}

function wasRecentlyDismissed() {
  try {
    const dismissedAt = Number(window.localStorage.getItem(INSTALL_DISMISSED_KEY));
    return Boolean(dismissedAt) && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

function ShareIcon() {
  return <svg className="install-prompt__share" viewBox="0 0 24 24" aria-label="Compartir" role="img"><path d="M12 15V4m0 0L8 8m4-4 4 4M7 11H6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-1" /></svg>;
}

// Se monta siempre para no perder beforeinstallprompt; solo se muestra cuando `visible` es true.
export default function InstallPrompt({ visible }) {
  const [mode, setMode] = useState(null);
  const [installEvent, setInstallEvent] = useState(null);

  useEffect(() => {
    if (isInstalled() || wasRecentlyDismissed()) return undefined;
    const iosBrowser = getIosBrowser();
    const timer = iosBrowser ? window.setTimeout(() => setMode(iosBrowser), 2500) : undefined;

    function handleBeforeInstall(event) {
      event.preventDefault();
      setInstallEvent(event);
      setMode('prompt');
    }
    function handleInstalled() {
      setInstallEvent(null);
      setMode(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  function dismiss() {
    try { window.localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now())); } catch { /* Sin almacenamiento solo se oculta por ahora. */ }
    setMode(null);
  }

  async function install() {
    if (!installEvent) return;
    installEvent.prompt();
    const { outcome } = await installEvent.userChoice.catch(() => ({ outcome: 'dismissed' }));
    setInstallEvent(null);
    if (outcome === 'accepted') setMode(null);
    else dismiss();
  }

  return (
    <AnimatePresence>
      {mode && visible && (
        <motion.aside
          className="install-prompt"
          aria-label="Instalar la app"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <span className="install-prompt__flower" aria-hidden="true">✿</span>
          <div className="install-prompt__copy">
            <strong>Llévanos en tu pantalla de inicio</strong>
            {mode === 'prompt' && <p>Abre nuestra historia como una app llamada “US”, sin barra del navegador.</p>}
            {mode === 'safari' && <p>Toca Compartir <ShareIcon /> (o ••• y luego Compartir) y elige “Agregar a pantalla de inicio”. Se llamará “US” ♡</p>}
            {mode === 'ios-other' && <p>Toca Compartir <ShareIcon /> en la barra de direcciones y elige “Agregar a pantalla de inicio”. Se llamará “US” ♡</p>}
            {mode === 'prompt' && <button className="install-prompt__install" type="button" onClick={install}>Instalar app</button>}
          </div>
          <button className="install-prompt__close" type="button" onClick={dismiss} aria-label="Cerrar aviso"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg></button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
