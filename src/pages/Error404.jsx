import { Link } from "react-router-dom";
import styles from "./Error404.module.css";

const Error404 = () => (
  <main className={styles.errorPage}>
    <div className={styles.errorContainer}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.errorTitle}>Lo que buscás no existe o fue movido.</p>
      <Link to="/" className={styles.homeButton}>
        Volver al inicio
      </Link>
    </div>
  </main>
);

export default Error404;
