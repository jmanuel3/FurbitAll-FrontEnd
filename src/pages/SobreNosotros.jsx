import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const SobreNosotros = () => {
  const BRAND = { accent: "#7b9593ff", bgSoft: "#E8FAF0" };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector(".navbar.fixed-top");
    const offset = nav?.offsetHeight ?? 72;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <main>
      <section
        aria-label="Introducción de la empresa"
        className="py-5"
        style={{
          background: `linear-gradient(180deg, ${BRAND.accent} 0%, ${BRAND.bgSoft} 100%)`,
        }}
      >
        <Container as="header" className="text-center">
          <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 mb-3">
            Conocé FurbitAll
          </Badge>
          <h1 className="fw-bold mb-3">Quiénes somos</h1>
          <p className="lead text-muted mb-0">
            En <strong>FurbitAll</strong> hacemos que reservar tu cancha y
            equiparte sea <em>simple, rápido y transparente</em>.
          </p>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="align-items-center gy-4 gx-lg-5">
            <Col lg={6}>
              <article>
                <h2 className="h4 mb-3 d-flex align-items-center gap-2">
                  Nuestra misión
                  <Badge bg="success" className="rounded-pill">
                    Simple
                  </Badge>
                </h2>
                <p className="mb-4">
                  Democratizar el acceso al deporte con una experiencia moderna
                  que conecte jugadores, clubes y tiendas en un solo lugar:
                  reservas sin fricción, stock real y soporte cercano.
                </p>

                <h3 className="h5 mb-3 d-flex align-items-center gap-2">
                  Qué hacemos
                  <Badge bg="dark" className="rounded-pill">
                    Claro
                  </Badge>
                </h3>
                <ul className="mb-4">
                  <li className="mb-2">Reservas de canchas en minutos.</li>
                  <li className="mb-2">
                    Catálogo con stock y precios actualizados.
                  </li>
                  <li className="mb-0">Pagos seguros y envío ágil.</li>
                </ul>
              </article>
            </Col>

            <Col lg={6} as="figure" className="text-center">
              <Image
                src="https://img.freepik.com/free-photo/soccer-player-action-stadium_1150-14598.jpg"
                alt="Equipo celebrando en una cancha de fútbol"
                fluid
                className="rounded-4 shadow-sm"
                style={{ border: "2px solid rgba(0,0,0,.06)" }}
              />
              <figcaption className="text-muted small mt-2">
                Pasión por el juego, tecnología al servicio del deporte.
              </figcaption>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5" aria-label="Valores y resultados">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Card as="article" className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <Card.Title className="h5 mb-2">Transparencia</Card.Title>
                  <Card.Text className="mb-0 text-muted">
                    Políticas claras, cargos visibles y comunicación honesta.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card as="article" className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <Card.Title className="h5 mb-2">Rapidez</Card.Title>
                  <Card.Text className="mb-0 text-muted">
                    Reservas confirmadas y envíos 24/48&nbsp;h según tu zona.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card as="article" className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <Card.Title className="h5 mb-2">Soporte humano</Card.Title>
                  <Card.Text className="mb-0 text-muted">
                    Acompañamiento real para resolver dudas y mejorar tu juego.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container className="text-center">
          <p className="text-muted mb-3">¿Listo para jugar o equiparte?</p>
          <nav
            aria-label="Acciones"
            className="d-flex justify-content-center gap-3"
          >
            <Button
              as={Link}
              to="/reservas"
              variant="dark"
              className="px-4 py-2 rounded-3"
            >
              Reservar cancha
            </Button>
            <Button
              as={Link}
              to="/#productos"
              variant="outline-dark"
              className="px-4 py-2 rounded-3"
              onClick={(e) => {
                const el = document.getElementById("productos");
                if (el) {
                  e.preventDefault();
                  scrollToSection("productos");
                }
              }}
            >
              Ver productos
            </Button>
          </nav>
        </Container>
      </section>
    </main>
  );
};

export default SobreNosotros;
