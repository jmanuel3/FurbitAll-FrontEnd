import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import styles from "./ProductDetail.module.css";

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
      <main className={styles.detailPage}>
        <div className={styles.loading}>
          <div className={styles.skeleton} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.actions}>
            <Link to="/" className={styles.addButton}>
              Volver al inicio
            </Link>
            <button
              className={styles.returnButton}
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.notFound}>
          <p className={styles.errorText}>Producto no encontrado.</p>
          <div className={styles.actions}>
            <Link to="/" className={styles.addButton}>
              Volver al inicio
            </Link>
            <button
              className={styles.returnButton}
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { name, price, description, image, stock } = product;
  const stockNum = normalizeStock(stock);
  const sinStock = stockNum <= 0;

  return (
    <main className={styles.detailPage}>
      <header className={styles.header}>
        <nav>
          <ol className={styles.breadcrumb}>
            <li className={styles.breadcrumbItem}>
              <Link to="/" className={styles.breadcrumbLink}>
                Home
              </Link>
              <span>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <span>{name}</span>
            </li>
          </ol>
        </nav>
        <Link to="/" className={styles.backButton}>
          ← Volver a productos
        </Link>
      </header>

      <article className={styles.content}>
        <section className={styles.imageSection}>
          {image ? (
            <img
              src={image}
              alt={name}
              className={styles.productImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.noImage}>Sin imagen disponible</div>
          )}
        </section>

        <section className={styles.infoSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.productTitle}>{name}</h1>
            <span
              className={`${styles.stockBadge} ${
                sinStock ? styles.stockOut : styles.stockAvailable
              }`}
            >
              {sinStock ? "Sin stock" : "En stock"}
            </span>
          </div>

          <div className={styles.price}>
            {typeof price === "number" ? currency.format(price) : `$${price}`}
          </div>

          {Number.isFinite(stockNum) && (
            <p
              className={`${styles.stockInfo} ${
                sinStock ? styles.stockInfoOut : styles.stockInfoAvailable
              }`}
            >
              {sinStock ? "Stock no disponible" : `Unidades: ${stockNum}`}
            </p>
          )}

          {description && <p className={styles.description}>{description}</p>}

          <nav className={styles.actions}>
            <button
              className={styles.addButton}
              onClick={() => {
                addToCart(product, 1);
                navigate("/cart");
              }}
              disabled={sinStock}
            >
              Añadir al carrito
            </button>
            <button
              className={styles.returnButton}
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </nav>
        </section>
      </article>
    </main>
  );
};

export default ProductDetail;
