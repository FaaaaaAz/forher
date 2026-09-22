import WelcomeScreen from '../components/Intro/WelcomeScreen.jsx';
import BloomIntro from '../components/Intro/BloomIntro.jsx';

export default function IntroSection({ isOpen = false, onOpen, onLogout, season }) {
  return isOpen ? <BloomIntro season={season} onLogout={onLogout} /> : <WelcomeScreen onOpen={onOpen} season={season} />;
}
