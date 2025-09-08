
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Error404 = () => (
  <main className="py-5">
    <Container className="text-center">
      <h1 className="display-5 fw-bold mb-3">404</h1>
      <p className="lead mb-4">Lo que buscás no existe o fue movido.</p>
      <Button as={Link} to="/" variant="dark" className="px-4 rounded-3">
        Volver al inicio
      </Button>
    </Container>
  </main>
);
export default Error404;
