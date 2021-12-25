import Home from "pages/Home";
import Play from "pages/Play";
import About from "pages/About";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "components";
import Web3ContextProvider from "web3/context";

function App() {
  return (
    <Web3ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </Web3ContextProvider>
  );
}

export default App;
