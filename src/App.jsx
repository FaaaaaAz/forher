import { useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import StarField from './components/Intro/StarField.jsx';
import StoryGate from './components/Intro/StoryGate.jsx';
import SeasonalDecor from './components/Intro/SeasonalDecor.jsx';
import TogetherCounter from './components/Intro/TogetherCounter.jsx';
import BackgroundMusic from './components/Audio/BackgroundMusic.jsx';
import IntroSection from './sections/IntroSection.jsx';
import GardenSection from './sections/GardenSection.jsx';
import MemoriesSection from './sections/MemoriesSection.jsx';
import LetterSection from './sections/LetterSection.jsx';
import PlansSection from './sections/PlansSection.jsx';
import { MEMORY_CODE_KEY, STORY_REMEMBER_KEY } from './data/storageKeys.js';
import { getBoliviaDate } from './utils/dates.js';
import { getSeason } from './utils/season.js';

export default function App() {
  const [isOpen, setIsOpen] = useState(() => {
    try { return window.localStorage.getItem(STORY_REMEMBER_KEY) === 'yes'; }
    catch { return false; }
  });
  const [showGate, setShowGate] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const today = getBoliviaDate(now);
  const season = getSeason(today);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  function unlockStory(remember) {
    try {
      if (remember) window.localStorage.setItem(STORY_REMEMBER_KEY, 'yes');
      else window.localStorage.removeItem(STORY_REMEMBER_KEY);
    } catch { /* El acceso sigue funcionando si el navegador bloquea el almacenamiento. */ }
    setIsOpen(true);
  }

  function logoutStory() {
    try {
      window.localStorage.removeItem(STORY_REMEMBER_KEY);
      window.localStorage.removeItem(MEMORY_CODE_KEY);
    } catch { /* El botón sigue volviendo al inicio sin almacenamiento. */ }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
    setShowGate(false);
    setIsOpen(false);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`site-shell site-shell--${season.id}`}>
        <StarField />
        <SeasonalDecor season={season} />
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
              <TogetherCounter today={today} now={now} />
              <div className="chapters" aria-label="Nuestra historia">
                <GardenSection />
                <MemoriesSection />
                <LetterSection />
                <PlansSection />
              </div>
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
