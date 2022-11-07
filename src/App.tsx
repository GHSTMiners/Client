import Home from "pages/Home";
import Play from "pages/Play";
import Leaderboard from "pages/Leaderboard";
import HowToPlay from "pages/HowToPlay";
import About from "pages/About";
import { Routes, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Lobby from "pages/Lobby";
import EndGame from "pages/EndGame";
import LoadingModal from "components/LoadingModal";

const App = () => {
  const location = useLocation();

  return (
    <>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.min.js" integrity="sha512-8YXJj9U1jXn8Bejc5Tiyj3mgx/u2J4XQf/HAXWX9LMCL0tdIv/WxIWoORonSO2+cRL0hHvy7QK5Mnz+jCWjPxA==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
      <LoadingModal />
      <TransitionGroup component={null}>
        <CSSTransition key={location.key} classNames="fade" timeout={375}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/howtoplay" element={<HowToPlay />} />
          <Route path="/about" element={<About />} />
          <Route path="/endgame" element={<EndGame />}>
            <Route path="/endgame/:roomId/:gotchiId" element={<EndGame />}/>
          </Route> 
        </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}; 

export default App;
