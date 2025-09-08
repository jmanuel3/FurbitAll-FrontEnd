
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const currency = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

const ProductCard = ({ name, price, image, description, stock, onAdd }) => {
  const agotado = typeof stock === "number" && stock <= 0;

  return (
    <Card className="shadow-sm card-hover h-100" as="article" aria-label={name}>
      {image && (
        <div className="ratio ratio-4x3 overflow-hidden rounded-top">
          <Card.Img
            src={image}
            alt={name}
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}

      <Card.Body as="section" className="d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
          <Card.Title as="h3" className="h6 mb-0">
            {name}
          </Card.Title>
          {typeof stock === "number" && (
            <Badge
              bg={agotado ? "secondary" : "success"}
              aria-label={`Stock ${stock}`}
            >
              {agotado ? "Sin stock" : `Stock: ${stock}`}
            </Badge>
          )}
        </div>

        {description && (
          <Card.Text className="text-muted small mb-2" aria-label="Descripción">
            {description.length > 100
              ? `${description.slice(0, 100)}…`
              : description}
          </Card.Text>
        )}

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <span className="fw-bold">{currency(price)}</span>
          <Button
            variant={agotado ? "outline-secondary" : "success"}
            size="sm"
            disabled={agotado}
            onClick={onAdd}
            aria-disabled={agotado}
            aria-label={
              agotado ? `${name} agotado` : `Agregar ${name} al carrito`
            }
          >
            {agotado ? "Agotado" : "Comprar"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
