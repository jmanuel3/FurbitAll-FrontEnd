import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

const ProductCard = ({ _id, name, price, image, description, stock, onAdd }) => {
  const getStockStatus = () => {
    if (stock === 0) return { label: "Sin stock", className: styles.stockOut };
    if (stock <= 5) return { label: `Quedan ${stock}`, className: styles.stockLow };
    return { label: "Disponible", className: styles.stockAvailable };
  };

  const stockStatus = getStockStatus();

  return (
    <article className={styles.productCard}>
      <Link to={`/productos/${_id}`} className={styles.imageWrapper}>
        <img
          src={image}
          alt={name}
          className={styles.productImage}
          loading="lazy"
        />
        <span className={`${styles.stockBadge} ${stockStatus.className}`}>
          {stockStatus.label}
        </span>
      </Link>

      <div className={styles.cardBody}>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productDescription}>{description}</p>

        <div className={styles.cardFooter}>
          <span className={styles.price}>${price}</span>
          <button
            onClick={onAdd}
            disabled={stock === 0}
            className={styles.addButton}
            aria-label={`Agregar ${name} al carrito`}
          >
            {stock === 0 ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;