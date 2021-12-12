import { Navbar, Container } from 'react-bootstrap'

const header = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">React bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
            </Container>
        </Navbar>
    )
}

export default header