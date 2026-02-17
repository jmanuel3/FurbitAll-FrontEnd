import { Link } from "react-router-dom";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector("nav");
    const offset = nav?.offsetHeight ?? 72;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section aria-label="Presentación FurbitAll" className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroCard}>
          <div className={styles.imageWrapper}>
            <figure aria-hidden="true" className={styles.backgroundImage} />
            <div aria-hidden="true" className={styles.gradientOverlay1} />
            <div aria-hidden="true" className={styles.gradientOverlay2} />

            <div className={styles.heroContent}>
              {/* Left Content */}
              <div className={styles.contentLeft}>
                <div className={styles.badgeGroup}>
                  <span className={`${styles.badge} ${styles.badgeLight}`}>
                    Nuevo diseño
                  </span>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                    Listo para jugar
                  </span>
                </div>

                <h1 className={styles.heroTitle}>
                  Reservá tu cancha y
                  <br />
                  equipate en minutos
                </h1>

                <p className={styles.heroDescription}>
                  Gestión simple y rápida: <strong>reservas</strong> sin
                  fricción y <strong>productos</strong> con stock real y envío
                  ágil.
                </p>

                <nav className={styles.buttonGroup} aria-label="Acciones principales">
                  <Link to="/reservas" className={styles.btnPrimary}>
                    Reservar cancha
                  </Link>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => scrollToSection("productos")}
                  >
                    Ver productos
                  </button>
                </nav>

                <ul className={styles.featureList} aria-label="Ventajas">
                  <li className={styles.featureItem}>
                    <span aria-hidden="true">📦</span> Envío 24/48h
                  </li>
                  <li className={styles.featureItem}>
                    <span aria-hidden="true">⭐</span> +500 reseñas
                  </li>
                  <li className={styles.featureItem}>
                    <span aria-hidden="true">🛡️</span> Pago seguro
                  </li>
                </ul>

                {/* Mobile Stats */}
                <div className={styles.mobileStats}>
                  <div className={styles.mobileStatsCard}>
                    <small className={styles.statsLabel}>Stock</small>
                    <span className={styles.statsValue}>Actualizado</span>
                  </div>
                  <div className={styles.mobileStatsCard}>
                    <small className={styles.statsLabel}>Reservas hoy</small>
                    <span className={`${styles.statsValue} ${styles.statsValueSuccess}`}>
                      12 disponibles
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content - Desktop Only */}
              <div className={styles.contentRight}>
                <img
                  src="https://img.freepik.com/foto-gratis/jugadores-futbol-accion-estadio-profesional_654080-1746.jpg"
                  alt="Jugador de fútbol en estadio"
                  className={styles.heroImage}
                />

                {/* Stats Cards */}
                <aside aria-label="Estado de stock" className={`${styles.statsCard} ${styles.statsCardTop}`}>
                  <small className={styles.statsLabel}>Stock</small>
                  <span className={styles.statsValue}>Actualizado</span>
                </aside>

                <aside aria-label="Disponibilidad de reservas" className={`${styles.statsCard} ${styles.statsCardBottom}`}>
                  <small className={styles.statsLabel}>Reservas hoy</small>
                  <span className={`${styles.statsValue} ${styles.statsValueSuccess}`}>
                    12 disponibles
                  </span>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;