import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.scss';
import StartingScreen from './StartingScreen';
import Game from './components/Game';

export default function App() {
  const location = useLocation();
  return (
    <div className="App">
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<StartingScreen />} />
            <Route path="/play" element={<Game />} />
          </Routes>
          </AnimatePresence>
    </div>
  );
}
