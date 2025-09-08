import { useEffect, useState } from "react";
import { Container, Card, Button, Table, Alert } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const currency = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

const Gracias = () => {
  const location = useLocation();
  const [order, setOrder] = useState(() => {
    const fromState = location?.state?.order;
    if (fromState) return fromState;
    try {
      const raw = localStorage.getItem("furbitAll_last_order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (order) return;
    try {
      const raw = localStorage.getItem("furbitAll_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, [order]);

  if (!order) {
    return (
      <Container as="main" className="py-5" role="main">
        <Alert as="section" variant="info" className="mb-3" aria-live="polite">
          No encontramos un pedido reciente.
        </Alert>
        <nav aria-label="Acciones">
          <Button as={Link} to="/" variant="primary">
            Volver al inicio
          </Button>
        </nav>
      </Container>
    );
  }

  return (
    <Container as="main" className="py-5" role="main">
      <Card as="article" className="shadow-sm">
        <Card.Body as="section" aria-labelledby="gracias-titulo">
          <Card.Title as="h1" id="gracias-titulo" className="mb-3">
            🎉 ¡Gracias por tu compra!
          </Card.Title>
          <Card.Subtitle as="p" className="mb-3 text-muted">
            Número de pedido: <strong>{order.id}</strong>
          </Card.Subtitle>

          <section aria-labelledby="resumen-pedido" className="mb-4">
            <h2 id="resumen-pedido" className="h6">
              Resumen del pedido
            </h2>
            <Table
              responsive
              bordered
              size="sm"
              className="align-middle"
              aria-describedby="resumen-pedido"
            >
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ width: 120 }}>Cantidad</th>
                  <th style={{ width: 140 }}>Precio</th>
                  <th style={{ width: 160 }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.qty}</td>
                    <td>{currency(i.price)}</td>
                    <td>{currency(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-semibold">
                    Total
                  </td>
                  <td className="fw-bold">{currency(order.total)}</td>
                </tr>
              </tfoot>
            </Table>
          </section>

          {order.datos && (
            <section aria-labelledby="datos-comprador" className="mb-4">
              <h2 id="datos-comprador" className="h6">
                Datos del comprador
              </h2>
              <p className="small text-muted mb-0">
                <strong>Nombre:</strong> {order.datos.nombre}
              </p>
              <p className="small text-muted mb-0">
                <strong>Email:</strong> {order.datos.email}
              </p>
              <p className="small text-muted mb-0">
                <strong>Teléfono:</strong> {order.datos.telefono}
              </p>
              <p className="small text-muted">
                <strong>Método de pago:</strong> {order.datos.metodo}
              </p>
            </section>
          )}

          <nav aria-label="Acciones" className="d-flex gap-2">
            <Button variant="success" as={Link} to="/">
              Seguir comprando
            </Button>
            <Button variant="outline-secondary" as={Link} to="/cart">
              Ver carrito
            </Button>
          </nav>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Gracias;
