import { useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import StarField from './components/Intro/StarField.jsx';
import SeasonalDecor from './components/Intro/SeasonalDecor.jsx';
import TogetherCounter from './components/Intro/TogetherCounter.jsx';
import IntroSection from './sections/IntroSection.jsx';
import GardenSection from './sections/GardenSection.jsx';
import MemoriesSection from './sections/MemoriesSection.jsx';
import LetterSection from './sections/LetterSection.jsx';
import FinalSection from './sections/FinalSection.jsx';
import { getBoliviaDate } from './utils/dates.js';
import { getSeason } from './utils/season.js';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [today, setToday] = useState(getBoliviaDate);
  const season = getSeason(today);

  useEffect(() => {
    const interval = window.setInterval(() => setToday(getBoliviaDate()), 60000);
    return () => window.clearInterval(interval);
  }, []);

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
              <IntroSection isOpen season={season} />
              <TogetherCounter today={today} />
              <div className="chapters" aria-label="Próximos capítulos">
                <GardenSection season={season} />
                <MemoriesSection />
                <LetterSection />
                <FinalSection />
              </div>
            </motion.main>
          ) : (
            <motion.main
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              <IntroSection season={season} onOpen={() => setIsOpen(true)} />
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
