
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const FieldCard = ({ _id, name, location, image }) => {
  return (
    <Card className="shadow-sm h-100">
      {image ? (
        <Card.Img
          variant="top"
          src={image}
          alt={name}
          style={{ height: 160, objectFit: "cover" }}
        />
      ) : (
        <section
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ height: 160 }}
        >
          <span className="text-muted">Sin imagen</span>
        </section>
      )}

      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-1">{name}</Card.Title>
        <Card.Text className="text-muted mb-3">{location}</Card.Text>

        <section className="mt-auto">
          <Button
            as={Link}
            to={`/reservas?field=${_id}`} 
            variant="success"
            className="w-100"
          >
            Reservar
          </Button>
        </section>
      </Card.Body>
    </Card>
  );
};

export default FieldCard;
