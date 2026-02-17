import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Gracias.module.css";

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
      <main className={styles.thankYouPage}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No encontramos un pedido reciente.</p>
          <Link to="/" className={styles.btnPrimary}>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.thankYouPage}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>🎉 ¡Gracias por tu compra!</h1>
          <p className={styles.orderId}>
            Número de pedido:{" "}
            <span className={styles.orderIdNumber}>{order.id}</span>
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Resumen del pedido</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{ width: "100px" }}>Cantidad</th>
                <th style={{ width: "120px" }}>Precio</th>
                <th style={{ width: "120px" }}>Subtotal</th>
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
                <td colSpan={3} className={styles.totalLabel}>
                  Total
                </td>
                <td className={styles.totalAmount}>{currency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {order.datos && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Datos del comprador</h2>
            <div className={styles.customerInfo}>
              <p className={styles.infoRow}>
                <span className={styles.infoLabel}>Nombre:</span>{" "}
                {order.datos.nombre}
              </p>
              <p className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>{" "}
                {order.datos.email}
              </p>
              <p className={styles.infoRow}>
                <span className={styles.infoLabel}>Teléfono:</span>{" "}
                {order.datos.telefono}
              </p>
              <p className={styles.infoRow}>
                <span className={styles.infoLabel}>Método de pago:</span>{" "}
                {order.datos.metodo}
              </p>
            </div>
          </section>
        )}

        <nav className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>
            Seguir comprando
          </Link>
          <Link to="/cart" className={styles.btnSecondary}>
            Ver carrito
          </Link>
        </nav>
      </div>
    </main>
  );
};

export default Gracias;
