import Home from "pages/Home";
import Play from "pages/Play"
import { BrowserRouter, Routes ,Route } from 'react-router-dom';
import Header from './components/Header'

function App() {

  return <BrowserRouter>
  <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/play" element={<Play/>}/>
    </Routes>
  </BrowserRouter>
}

export default App;
