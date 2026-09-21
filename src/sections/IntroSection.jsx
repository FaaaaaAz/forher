import WelcomeScreen from '../components/Intro/WelcomeScreen.jsx';
import BloomIntro from '../components/Intro/BloomIntro.jsx';

export default function IntroSection({ isOpen = false, onOpen }) {
  return isOpen ? <BloomIntro /> : <WelcomeScreen onOpen={onOpen} />;
}
