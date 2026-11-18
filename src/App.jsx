import { useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import StarField from './components/Intro/StarField.jsx';
import StoryGate from './components/Intro/StoryGate.jsx';
import SeasonalDecor from './components/Intro/SeasonalDecor.jsx';
import HalloweenDecor from './components/Intro/HalloweenDecor.jsx';
import CosechaLayer from './components/Cosecha/CosechaLayer.jsx';
import GiftSection from './components/Cosecha/GiftSection.jsx';
import EpilogueSection from './components/Cosecha/EpilogueSection.jsx';
import CounterCamera from './components/Cosecha/CounterCamera.jsx';
import TogetherCounter from './components/Intro/TogetherCounter.jsx';
import BackgroundMusic from './components/Audio/BackgroundMusic.jsx';
import IntroSection from './sections/IntroSection.jsx';
import GardenSection from './sections/GardenSection.jsx';
import MemoriesSection from './sections/MemoriesSection.jsx';
import LetterSection from './sections/LetterSection.jsx';
import PlansSection from './sections/PlansSection.jsx';
import { clearStorySession, hasRememberedSession, saveStorySession, SESSION_EXPIRED_EVENT } from './services/session.js';
import { getBoliviaDate } from './utils/dates.js';
import { getSeason } from './utils/season.js';

// ?tema=cosecha permite ver el estilo de la película antes de sus dos días.
const readPreview = () => new URLSearchParams(window.location.search).get('tema');

export default function App() {
  const [isOpen, setIsOpen] = useState(hasRememberedSession);
  const [showGate, setShowGate] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [preview] = useState(readPreview);
  const today = getBoliviaDate(now);
  const season = getSeason(today, { preview });
  const movie = season.id === 'cosecha';

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Si el servidor ya no reconoce la sesión, se pide la clave de seis dígitos una vez más.
  useEffect(() => {
    function expire() { logoutStory(true); }
    window.addEventListener(SESSION_EXPIRED_EVENT, expire);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, expire);
  }, []);

  function unlockStory(token, remember) {
    saveStorySession(token, remember);
    setIsOpen(true);
  }

  function logoutStory(toGate = false) {
    clearStorySession();
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
    setShowGate(toGate === true);
    setIsOpen(false);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`site-shell site-shell--${season.id}`}>
        <StarField />
        <SeasonalDecor season={season} />
        {season.id === 'halloween' && <HalloweenDecor />}
        {movie && <CosechaLayer inStory={isOpen} />}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.main
              key="story"
              className="story"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <BackgroundMusic />
              <IntroSection isOpen season={season} onLogout={logoutStory} />
              <TogetherCounter today={today} now={now}>{movie && <CounterCamera />}</TogetherCounter>
              {movie && <GiftSection />}
              <div className="chapters" aria-label="Nuestra historia">
              <GardenSection today={today} />
                <MemoriesSection />
                <LetterSection movie={movie} />
                <PlansSection />
              </div>
              {movie && <EpilogueSection />}
            </motion.main>
          ) : showGate ? (
            <motion.main key="gate" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.45 }}>
              <StoryGate onUnlock={unlockStory} onBack={() => setShowGate(false)} />
            </motion.main>
          ) : (
            <motion.main
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              <IntroSection season={season} onOpen={() => setShowGate(true)} />
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
