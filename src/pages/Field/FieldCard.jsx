import { Link } from "react-router-dom";
import styles from "./FieldCard.module.css";

const FieldCard = ({ _id, name, location, image }) => {
  return (
    <article className={styles.fieldCard}>
      <div className={styles.imageWrapper}>
        {image ? (
          <img
            src={image}
            alt={name}
            className={styles.fieldImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.iconOverlay}>⚽</div>
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.fieldName}>{name}</h3>
        <p className={styles.fieldLocation}>
          <span>📍</span>
          {location}
        </p>

        <Link
          to="/reservas"
          state={{ fieldId: _id }}
          className={styles.reserveButton}
        >
          Reservar ahora
        </Link>
      </div>
    </article>
  );
};

export default FieldCard;