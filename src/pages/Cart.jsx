import { useState } from "react";
import { useCart } from "../context/CartContext";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Alert,
  Image,
  Modal,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { decrementStockBulk } from "../services/productService";

const currency = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

const Cart = () => {
  const { cart, updateQty, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    metodo: "efectivo",
    acepta: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiShortages, setApiShortages] = useState(null); 

  const openCheckout = () => {
    if (!cart.length) return;
    setShowCheckout(true);
  };
  const closeCheckout = () => setShowCheckout(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email inválido";
    if (!/^\+?\d[\d\s\-()]{5,}$/.test(form.telefono))
      e.telefono = "Teléfono inválido";
    if (!form.acepta) e.acepta = "Debés aceptar términos y condiciones";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const explainError = (status, payload) => {
    if (status === 401) return "Tu sesión ha expirado. Inicia sesión de nuevo.";
    if (status === 409) {
      const list = payload?.shortages?.map(
        (s) => `• ${s.name} (pediste ${s.requested}, hay ${s.available})`
      );
      return list?.length
        ? `Stock insuficiente:\n${list.join(
            "\n"
          )}\n\nAjusta cantidades y reintenta.`
        : "Stock insuficiente en uno o más productos. Ajusta cantidades y reintenta.";
    }
    if (status === 400)
      return payload?.message || "Petición inválida. Revisa el carrito.";
    return payload?.message || "Ha ocurrido un error. Inténtalo de nuevo.";
  };

  const handleConfirmarCompra = async () => {
    if (!validate()) return;
    if (!cart.length) return;

    setSubmitting(true);
    setApiError("");
    setApiShortages(null);

    try {
      const items = cart.map((it) => ({
        productId: it._id || it.id, 
        qty: it.qty,
      }));

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt");

      await decrementStockBulk(items, token);

    
      const order = {
        id: `FA-${Date.now().toString().slice(-6)}`,
        items: cart.map(({ id, _id, name, qty, price }) => ({
          id: _id || id,
          name,
          qty,
          price,
        })),
        total: cartTotal,
        datos: form,
        fecha: new Date().toISOString(),
      };

      try {
        localStorage.setItem("furbitAll_last_order", JSON.stringify(order));
    
        localStorage.setItem("productsRefetchAt", String(Date.now()));
      } catch {}

      clearCart();
      setShowCheckout(false);
      navigate("/gracias", { state: { order } });
    } catch (err) {
      const msg = explainError(err?.status, err?.payload);
      setApiError(msg);
      setApiShortages(err?.payload?.shortages ?? null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container as="main" className="py-4" role="main">
      <header>
        <Row className="mb-3">
          <Col as="h2">🛒 Carrito</Col>
        </Row>
      </header>

      {cart.length === 0 ? (
        <Alert as="section" variant="info" aria-live="polite">
          Tu carrito está vacío.{" "}
          <Link to="/" className="alert-link">
            Ir a la tienda
          </Link>
        </Alert>
      ) : (
        <>
          <section aria-labelledby="resumen-carrito">
            <h3 id="resumen-carrito" className="visually-hidden">
              Resumen del carrito
            </h3>

            <Table responsive bordered hover className="align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ width: 110 }}>Cantidad</th>
                  <th style={{ width: 130 }}>Precio</th>
                  <th style={{ width: 130 }}>Subtotal</th>
                  <th style={{ width: 120 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <article className="d-flex align-items-center gap-3 mb-0">
                        {item.image ? (
                          <figure className="mb-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              rounded
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                              }}
                            />
                          </figure>
                        ) : null}

                        <section aria-label={`Detalle de ${item.name}`}>
                          <p className="fw-semibold mb-0">{item.name}</p>
                      
                        </section>
                      </article>
                    </td>

                    <td>
                      <nav aria-label={`Cambiar cantidad de ${item.name}`}>
                        <ul className="d-flex align-items-center gap-2 list-unstyled mb-0">
                          <li>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              aria-label={`Disminuir cantidad de ${item.name}`}
                            >
                              −
                            </Button>
                          </li>
                          <li aria-live="polite" aria-atomic="true">
                            <span className="px-2">{item.qty}</span>
                          </li>
                          <li>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              aria-label={`Aumentar cantidad de ${item.name}`}
                            >
                              +
                            </Button>
                          </li>
                        </ul>
                      </nav>
                    </td>

                    <td>{currency(item.price)}</td>
                    <td>{currency(item.price * item.qty)}</td>

                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-semibold">
                    Total
                  </td>
                  <td className="fw-bold">{currency(cartTotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </Table>

            <section
              className="d-flex gap-2 justify-content-end"
              aria-label="Acciones del carrito"
            >
              <Button variant="outline-secondary" onClick={clearCart}>
                Vaciar carrito
              </Button>
              <Button
                variant="success"
                onClick={openCheckout}
                disabled={!cart.length}
              >
                Finalizar compra
              </Button>
            </section>
          </section>
        </>
      )}

      <Modal
        show={showCheckout}
        onHide={closeCheckout}
        centered
        aria-labelledby="modal-checkout-title"
      >
        <Modal.Header closeButton as="header">
          <Modal.Title as="h5" id="modal-checkout-title">
            Finalizar compra
          </Modal.Title>
        </Modal.Header>

        <Modal.Body as="section" aria-labelledby="resumen-pedido">
    
          {apiError && (
            <Alert
              variant="danger"
              className="mb-3"
              role="alert"
              aria-live="assertive"
            >
              <pre className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                {apiError}
              </pre>
            </Alert>
          )}

          <h6 id="resumen-pedido" className="mb-3">
            Resumen
          </h6>

          <section aria-live="polite" className="mb-3">
            {cart.map((i) => (
              <p
                key={i.id}
                className="d-flex justify-content-between small mb-1"
              >
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{currency(i.price * i.qty)}</span>
              </p>
            ))}
            <p className="d-flex justify-content-between mt-2 fw-semibold mb-0">
              <span>Total</span>
              <span>{currency(cartTotal)}</span>
            </p>
          </section>

          <h6 className="mb-2">Datos del comprador</h6>
          <Form as="form" noValidate>
            <Form.Group as="section" className="mb-2" controlId="ckNombre">
              <Form.Label>Nombre y apellido</Form.Label>
              <Form.Control
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                isInvalid={!!errors.nombre}
                placeholder="Ej: Juan Pérez"
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as="section" className="mb-2" controlId="ckEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                isInvalid={!!errors.email}
                placeholder="nombre@correo.com"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as="section" className="mb-2" controlId="ckTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                isInvalid={!!errors.telefono}
                placeholder="+54 9 11 1234-5678"
              />
              <Form.Control.Feedback type="invalid">
                {errors.telefono}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as="section" className="mb-3" controlId="ckMetodo">
              <Form.Label>Método de pago</Form.Label>
              <Form.Select
                value={form.metodo}
                onChange={(e) => setForm({ ...form, metodo: e.target.value })}
                aria-label="Seleccionar método de pago"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
            </Form.Group>

            <Form.Check
              id="ckTyC"
              type="checkbox"
              label="Acepto términos y condiciones"
              checked={form.acepta}
              isInvalid={!!errors.acepta}
              onChange={(e) => setForm({ ...form, acepta: e.target.checked })}
            />
            {errors.acepta && (
              <p className="text-danger small mt-1 mb-0" role="alert">
                {errors.acepta}
              </p>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer as="footer">
          <Button
            variant="outline-secondary"
            onClick={closeCheckout}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmarCompra}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Procesando..." : "Confirmar compra"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
