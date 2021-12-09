//import myGotchi from "assets/images/gotchi_example.png";
import "./App.css";
import myGotchi from "assets/images/gotchi_example.png";
import { Card, Col, Row, Container } from "react-bootstrap";
import GameConfigurator from "components/GameConfigurator";

const Home = (): JSX.Element => {
  return (
    <Container fluid>
      <Row>
        <Col>

        </Col>
        <Col><GameConfigurator/></Col>
      </Row>
    </Container>
  );
};

export default Home;
