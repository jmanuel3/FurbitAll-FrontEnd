import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { decrementStockBulk } from "../services/productService";
import styles from "./Cart.module.css";

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

  const openCheckout = () => {
    if (!cart.length) return;
    setShowCheckout(true);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setErrors({});
    setApiError("");
  };

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
        (s) => `• ${s.name} (pediste ${s.requested}, hay ${s.available})`,
      );
      return list?.length
        ? `Stock insuficiente:\n${list.join("\n")}\n\nAjusta cantidades y reintenta.`
        : "Stock insuficiente en uno o más productos.";
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.cartContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>🛒 Mi Carrito</h1>
      </header>

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <p className={styles.emptyCartText}>Tu carrito está vacío</p>
          <Link to="/" className={styles.emptyCartLink}>
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cartTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ width: "140px" }}>Cantidad</th>
                  <th style={{ width: "120px" }}>Precio</th>
                  <th style={{ width: "120px" }}>Subtotal</th>
                  <th style={{ width: "100px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id || item._id}>
                    <td>
                      <div className={styles.productInfo}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.productImage}
                          />
                        )}
                        <p className={styles.productName}>{item.name}</p>
                      </div>
                    </td>
                    <td>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label={`Disminuir cantidad de ${item.name}`}
                        >
                          −
                        </button>
                        <span className={styles.quantityDisplay}>
                          {item.qty}
                        </span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className={styles.price}>{currency(item.price)}</td>
                    <td className={styles.price}>
                      {currency(item.price * item.qty)}
                    </td>
                    <td>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className={styles.tableFoot}>
                <tr>
                  <td colSpan={3} className={styles.totalLabel}>
                    Total
                  </td>
                  <td className={styles.totalAmount}>{currency(cartTotal)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className={styles.cartActions}>
            <button className={styles.clearButton} onClick={clearCart}>
              Vaciar carrito
            </button>
            <button
              className={styles.checkoutButton}
              onClick={openCheckout}
              disabled={!cart.length}
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className={styles.modalOverlay} onClick={closeCheckout}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Finalizar compra</h2>
              <button
                className={styles.closeButton}
                onClick={closeCheckout}
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>

            <div className={styles.modalBody}>
              {apiError && (
                <div className={`${styles.alert} ${styles.alertDanger}`}>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                    {apiError}
                  </pre>
                </div>
              )}

              <h3 className={styles.sectionTitle}>Resumen del pedido</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                {cart.map((i) => (
                  <div key={i.id} className={styles.summaryItem}>
                    <span>
                      {i.name} × {i.qty}
                    </span>
                    <span>{currency(i.price * i.qty)}</span>
                  </div>
                ))}
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{currency(cartTotal)}</span>
                </div>
              </div>

              <h3 className={styles.sectionTitle}>Datos del comprador</h3>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre" className={styles.label}>
                    Nombre y apellido
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    className={`${styles.input} ${
                      errors.nombre ? styles.error : ""
                    }`}
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.nombre && (
                    <p className={styles.errorText}>{errors.nombre}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={`${styles.input} ${
                      errors.email ? styles.error : ""
                    }`}
                    placeholder="nombre@correo.com"
                  />
                  {errors.email && (
                    <p className={styles.errorText}>{errors.email}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefono" className={styles.label}>
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                    className={`${styles.input} ${
                      errors.telefono ? styles.error : ""
                    }`}
                    placeholder="+54 9 11 1234-5678"
                  />
                  {errors.telefono && (
                    <p className={styles.errorText}>{errors.telefono}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="metodo" className={styles.label}>
                    Método de pago
                  </label>
                  <select
                    id="metodo"
                    value={form.metodo}
                    onChange={(e) =>
                      setForm({ ...form, metodo: e.target.value })
                    }
                    className={styles.select}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                <div className={styles.checkbox}>
                  <input
                    id="acepta"
                    type="checkbox"
                    checked={form.acepta}
                    onChange={(e) =>
                      setForm({ ...form, acepta: e.target.checked })
                    }
                  />
                  <label htmlFor="acepta" className={styles.checkboxLabel}>
                    Acepto términos y condiciones
                  </label>
                </div>
                {errors.acepta && (
                  <p className={styles.errorText}>{errors.acepta}</p>
                )}
              </form>
            </div>

            <footer className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={closeCheckout}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmarCompra}
                disabled={submitting}
              >
                {submitting ? "Procesando..." : "Confirmar compra"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
