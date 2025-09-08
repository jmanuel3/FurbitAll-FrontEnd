import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const FieldCard = ({ _id, name, location, image }) => {
  return (
    <Card
      as="article"
      className="shadow-sm h-100 border-0 rounded-4 card-hover"
      aria-label={`Cancha: ${name}`}
    >
      {image ? (
        <figure className="m-0 card-img-viewport">
          <Card.Img
            variant="top"
            src={image}
            alt={name}
            loading="lazy"
            className="object-cover h-100 w-100"
          />
        </figure>
      ) : (
        <section
          className="d-flex align-items-center justify-content-center bg-light card-img-viewport"
          aria-label="Sin imagen disponible"
        >
          <span className="text-muted">Sin imagen</span>
        </section>
      )}

      <Card.Body className="d-flex flex-column">
        <header>
          <Card.Title as="h3" className="h5 mb-1">
            {name}
          </Card.Title>
          {location && (
            <Card.Text as="p" className="text-muted mb-3">
              {location}
            </Card.Text>
          )}
        </header>

        <nav className="mt-auto" aria-label={`Acciones de ${name}`}>
          <Button
            as={Link}
            to={`/reservas?field=${_id}`}
            variant="success"
            className="w-100 btn-quiet-shadow"
            aria-label={`Reservar ${name}`}
          >
            📅 Reservar
          </Button>
        </nav>
      </Card.Body>
    </Card>
  );
};

export default FieldCard;
