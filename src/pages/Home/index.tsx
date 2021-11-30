//import myGotchi from "assets/images/gotchi_example.png";
import "./App.css";
import myGotchi from "assets/images/gotchi_example.png";

const Home = (): JSX.Element => {
  return (
    <header className="App-header">
      <img src={myGotchi} alt="Yoda#3934" width="512" height="512" />
      Yoda#3934
    </header>
  );
};

export default Home;
