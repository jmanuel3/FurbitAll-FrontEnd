
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Image,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector(".navbar.fixed-top");
    const offset = nav?.offsetHeight ?? 72;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section aria-label="Presentación FurbitAll" className="py-5">
      <Container as="article" className="rounded-4 p-3 shadow-lg">
        <Card
          as="section"
          className="border-0 rounded-4 overflow-hidden shadow"
          style={{
            backdropFilter: "blur(6px)",
            background:
              "linear-gradient(180deg, rgba(30,30,30,.75) 0%, rgba(30,30,30,.7) 100%)",
          }}
        >
         
          <section className="position-relative">
            <figure
              aria-hidden="true"
              className="position-absolute top-0 start-0 w-100 h-100 m-0"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1590231886044-47c268a3a9b2?q=80&w=1600&auto=format&fit=crop)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(1.05)",
              }}
            />
            <section
              aria-hidden="true"
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background:
                  "radial-gradient(80% 60% at 10% 10%, rgba(144,238,144,.35), rgba(0,0,0,0) 50%)",
              }}
            />
            <section
              aria-hidden="true"
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 50%, rgba(0,0,0,.65) 100%)",
              }}
            />

            <Row className="position-relative g-0">
           
              <Col lg={7} as="header" className="p-4 p-lg-5">
                <header className="d-inline-flex align-items-center gap-2 mb-3">
                  <Badge
                    bg="light"
                    text="dark"
                    className="rounded-pill px-3 py-2"
                  >
                    Nuevo diseño
                  </Badge>
                  <Badge bg="success" className="rounded-pill px-3 py-2">
                    Listo para jugar
                  </Badge>
                </header>

                <h1
                  className="fw-bold mb-3"
                  style={{
                    color: "white",
                    fontSize: "clamp(1.9rem, 1.1rem + 2.8vw, 3.2rem)",
                    lineHeight: 1.1,
                    textShadow: "0 2px 10px rgba(0,0,0,.25)",
                  }}
                >
                  Reservá tu cancha y
                  <br />
                  equipate en minutos
                </h1>

                <p
                  className="mb-4"
                  style={{
                    color: "rgba(255,255,255,.85)",
                    fontSize: "clamp(1rem, .92rem + .4vw, 1.15rem)",
                  }}
                >
                  Gestión simple y rápida: <strong>reservas</strong> sin
                  fricción y <strong>productos</strong> con stock real y envío
                  ágil.
                </p>

                <nav
                  className="d-flex flex-wrap gap-3"
                  aria-label="Acciones principales"
                >
                  <Button
                    as={Link}
                    to="/reservas"
                    variant="light"
                    className="px-4 py-2 rounded-3 fw-semibold"
                  >
                    Reservar cancha
                  </Button>
                  <Button
                    variant="outline-light"
                    className="px-4 py-2 rounded-3"
                    onClick={() => scrollToSection("productos")}
                  >
                    Ver productos
                  </Button>
                </nav>

                <ul
                  className="list-unstyled d-flex flex-wrap gap-4 mt-4 mb-0"
                  aria-label="Ventajas"
                >
                  <li className="text-white-50 d-flex align-items-center gap-2">
                    <span aria-hidden="true">📦</span> Envío 24/48h
                  </li>
                  <li className="text-white-50 d-flex align-items-center gap-2">
                    <span aria-hidden="true">⭐</span> +500 reseñas
                  </li>
                  <li className="text-white-50 d-flex align-items-center gap-2">
                    <span aria-hidden="true">🛡️</span> Pago seguro
                  </li>
                </ul>

              
                <section className="d-flex d-lg-none flex-column align-items-center gap-3 mt-4">
                  <Card
                    className="border-0 rounded-4 shadow-sm w-75"
                    style={{
                      backdropFilter: "blur(6px)",
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    <Card.Body className="py-3 px-3 text-center">
                      <small className="text-muted d-block mb-1">Stock</small>
                      <span className="fw-semibold text-dark">Actualizado</span>
                    </Card.Body>
                  </Card>

                  <Card
                    className="border-0 rounded-4 shadow-sm w-75"
                    style={{
                      backdropFilter: "blur(6px)",
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    <Card.Body className="py-3 px-3 text-center">
                      <small className="text-muted d-block mb-1">
                        Reservas hoy
                      </small>
                      <span className="fw-semibold text-success">
                        12 disponibles
                      </span>
                    </Card.Body>
                  </Card>
                </section>
              </Col>

              <Col
                lg={5}
                as="aside"
                className="d-none d-lg-flex align-items-end justify-content-end p-4 position-relative"
                style={{ minHeight: 360 }}
              >
                <Image
                  src="https://img.freepik.com/foto-gratis/jugadores-futbol-accion-estadio-profesional_654080-1746.jpg"
                  alt="Jugador de fútbol en estadio"
                  fluid
                  className="rounded-4 shadow"
                  style={{
                    maxHeight: 380,
                    objectFit: "cover",
                    border: "2px solid rgba(255,255,255,.2)",
                  }}
                />
               
                <aside
                  aria-label="Estado de stock"
                  className="position-absolute top-0 end-0 me-4 mt-4"
                >
                  <Card
                    className="border-0 rounded-4 shadow-sm"
                    style={{
                      backdropFilter: "blur(10px)",
                      background: "rgba(255,255,255,0.6)", 
                      width: "220px",
                    }}
                  >
                    <Card.Body className="py-3 px-3 text-center">
                      <small className="text-muted d-block mb-1">Stock</small>
                      <span className="fw-semibold text-dark">Actualizado</span>
                    </Card.Body>
                  </Card>
                </aside>

                
                <aside
                  aria-label="Disponibilidad de reservas"
                  className="position-absolute bottom-0 end-0 me-4 mb-4"
                >
                  <Card
                    className="border-0 rounded-4 shadow-sm"
                    style={{
                      backdropFilter: "blur(10px)",
                      background: "rgba(255,255,255,0.6)",
                      width: "220px",
                    }}
                  >
                    <Card.Body className="py-3 px-3 text-center">
                      <small className="text-muted d-block mb-1">
                        Reservas hoy
                      </small>
                      <span className="fw-semibold text-success">
                        12 disponibles
                      </span>
                    </Card.Body>
                  </Card>
                </aside>
              </Col>
            </Row>
          </section>
        </Card>
      </Container>
    </section>
  );
};

export default HeroSection;
