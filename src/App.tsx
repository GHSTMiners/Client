import HomeLegacy from "pages/HomeLegacy";
import Home from "pages/Home";
import Play from "pages/Play";
import Leaderboard from "pages/Leaderboard";
import HowToPlay from "pages/HowToPlay";
import About from "pages/About";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Web3ContextProvider from "web3/context";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Lobby from "pages/Lobby";

const App = () => {
  const location = useLocation();

  return (
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} classNames="fade" timeout={375}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game" element={<HomeLegacy />} /> // TO BE DELETED, FOR DEBUGGING ONLY
            <Route path="/play" element={<Play />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/howtoplay" element={<HowToPlay />} />
            <Route path="/about" element={<About />} />
          </Routes>
          </CSSTransition>
        </TransitionGroup>
  );
}; 

export default App;
