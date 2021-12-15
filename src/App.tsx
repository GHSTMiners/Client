import Home from "pages/Home";
import Play from "pages/Play";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Web3ContextProvider from "web3/context";

function App() {
  return (
    <Web3ContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </BrowserRouter>
    </Web3ContextProvider>
  );
}

export default App;
