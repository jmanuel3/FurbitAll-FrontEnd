import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const currencyARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

const normalizeStock = (raw) => {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  if (typeof raw === "string") {
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export default function ProductCard({ product, onClick }) {
  const { _id, name, price, description, image, stock } = product || {};
  const stockNum = normalizeStock(stock);
  const sinStock = stockNum <= 0;

  const detailPath = _id ? `/productos/${_id}` : "#";

  return (
    <Card
      as="article"
      style={{ width: "18rem" }}
      className="shadow-sm h-100 border-0 rounded-4"
    >
      {image ? (
        <div style={{ height: 180, overflow: "hidden" }}>
          <Card.Img
            variant="top"
            src={image}
            alt={name || "Producto"}
            style={{ height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        </div>
      ) : (
        <section
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ height: 180 }}
          aria-label="Sin imagen disponible"
        >
          <span className="text-muted">Sin imagen</span>
        </section>
      )}

      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <Card.Title as="h3" className="h6 m-0">
            {name}
          </Card.Title>
          <Badge
            bg={sinStock ? "danger" : "success"}
            aria-label={sinStock ? "Sin stock" : "En stock"}
          >
            {sinStock ? "Sin stock" : "En stock"}
          </Badge>
        </div>

        <Card.Text className="text-muted mb-2">
          {typeof price === "number"
            ? currencyARS.format(price)
            : `$${price ?? 0}`}
        </Card.Text>

        {Number.isFinite(stockNum) && (
          <Card.Text
            className={`mb-2 ${sinStock ? "text-danger" : "text-success"}`}
            aria-live="polite"
          >
            {sinStock ? "Stock no disponible" : `Unidades: ${stockNum}`}
          </Card.Text>
        )}

        {description && (
          <Card.Text
            style={{ fontSize: "0.9rem" }}
            className="flex-grow-1 text-body-secondary"
          >
            {description}
          </Card.Text>
        )}


        <nav
          className="mt-auto"
          aria-label={`Acciones de ${name || "producto"}`}
        >
          {onClick ? (
           
            <Button variant="primary" onClick={onClick} className="w-100">
              Ver más
            </Button>
          ) : (
            <Button
              as={Link}
              to={detailPath}
              variant={sinStock ? "secondary" : "success"}
              className="w-100"
              disabled={sinStock}
              aria-disabled={sinStock}
            >
              {sinStock ? "Agotado" : "Comprar"}
            </Button>
          )}
        </nav>
      </Card.Body>
    </Card>
  );
}
