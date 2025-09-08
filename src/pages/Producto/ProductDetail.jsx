import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Breadcrumb,
  Badge,
} from "react-bootstrap";

const currency = new Intl.NumberFormat("es-AR", {
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (product?.name) {
      const prev = document.title;
      document.title = `${product.name} — FurbitAll`;
      return () => (document.title = prev);
    }
  }, [product?.name]);


  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!id) {
        setError("ID de producto faltante");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getProductById(id);
        if (!ignore) setProduct(data);
      } catch (e) {
        if (!ignore) setError(e.message || "No se pudo cargar el producto");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Container as="main" className="my-5" role="main" aria-busy="true">
        <div className="ad-slide skeleton rounded-4" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container as="main" className="my-5" role="main">
        <Alert as="section" variant="danger" className="mb-3" role="alert">
          {error}
        </Alert>
        <nav className="d-flex gap-2" aria-label="Acciones de error">
          <Button as={Link} to="/" variant="secondary">
            Volver al inicio
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
        </nav>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container as="main" className="my-5" role="main">
        <Alert as="section" variant="warning" role="alert">
          Producto no encontrado.
        </Alert>
        <nav className="d-flex gap-2" aria-label="Acciones de no encontrado">
          <Button as={Link} to="/" variant="secondary">
            Volver al inicio
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
        </nav>
      </Container>
    );
  }

  const { name, price, description, image, stock } = product;
  const stockNum = normalizeStock(stock);
  const sinStock = stockNum <= 0;

  return (
    <Container as="main" className="my-4" role="main">
      <header className="d-flex align-items-center justify-content-between">
        <Breadcrumb className="mb-3" aria-label="breadcrumb">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active aria-current="page">
            {name}
          </Breadcrumb.Item>
        </Breadcrumb>


        <Button
          as={Link}
          to="/"
          variant="outline-secondary"
          size="sm"
          className="ms-2"
        >
          ← Volver a productos
        </Button>
      </header>

      <Row
        as="article"
        className="g-4 align-items-start"
        aria-labelledby="producto-titulo"
      >
       
        <Col md={6}>
          <Card as="section" className="shadow-sm border-0 rounded-4">
            {image ? (
              <figure className="m-0 card-img-viewport-lg">
                <Card.Img
                  src={image}
                  alt={name}
                  loading="lazy"
                  className="object-cover h-100 w-100 img-zoom"
                />
              </figure>
            ) : (
              <section
                className="d-flex align-items-center justify-content-center bg-light card-img-viewport-lg"
                aria-label="Sin imagen disponible"
              >
                <span className="text-muted">Sin imagen</span>
              </section>
            )}
          </Card>
        </Col>

        <Col md={6} as="section">
          <div className="d-flex align-items-center gap-2 mb-2">
            <h1 id="producto-titulo" className="h2 m-0">
              {name}
            </h1>
            <Badge
              bg={sinStock ? "danger" : "success"}
              className="align-middle"
              aria-label={sinStock ? "Sin stock" : "En stock"}
            >
              {sinStock ? "Sin stock" : "En stock"}
            </Badge>
          </div>

          <p className="text-success h4" aria-label="Precio">
            {typeof price === "number" ? currency.format(price) : `$${price}`}
          </p>

          {Number.isFinite(stockNum) && (
            <p
              className={`mb-1 ${sinStock ? "text-danger" : "text-success"}`}
              aria-live="polite"
            >
              {sinStock ? "Stock no disponible" : `Unidades: ${stockNum}`}
            </p>
          )}

          {description && (
            <p className="text-body-secondary mt-3" aria-label="Descripción">
              {description}
            </p>
          )}

          <nav
            className="d-flex flex-wrap gap-2 mt-4"
            aria-label="Acciones de compra"
          >
            <Button
              variant="success"
              onClick={() => {
                addToCart(product, 1);
                navigate("/cart");
              }}
              disabled={sinStock}
              aria-disabled={sinStock}
            >
              Añadir al carrito
            </Button>

            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </nav>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
