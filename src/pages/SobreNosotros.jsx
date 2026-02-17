import { Link } from "react-router-dom";
import styles from "./SobreNosotros.module.css";

const SobreNosotros = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector("nav");
    const offset = nav?.offsetHeight ?? 72;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <main className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.badge}>Conocé FurbitAll</div>
        <h1 className={styles.heroTitle}>Quiénes somos</h1>
        <p className={styles.heroSubtitle}>
          En <strong>FurbitAll</strong> hacemos que reservar tu cancha y
          equiparte sea <em>simple, rápido y transparente</em>.
        </p>
      </section>

      {/* Mission Section */}
      <section className={styles.contentSection}>
        <div className={styles.row}>
          <div className={styles.column}>
            <h2 className={styles.sectionTitle}>
              Nuestra misión
              <span className={styles.titleBadge}>Simple</span>
            </h2>
            <p className={styles.paragraph}>
              Democratizar el acceso al deporte con una experiencia moderna que
              conecta jugadores, clubes y tiendas en un solo lugar: reservas sin
              fricción, stock real y soporte cercano.
            </p>

            <h3 className={styles.sectionTitle}>
              Qué hacemos
              <span className={styles.titleBadge}>Claro</span>
            </h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Reservas de canchas en minutos
              </li>
              <li className={styles.listItem}>
                Catálogo con stock y precios actualizados
              </li>
              <li className={styles.listItem}>Pagos seguros y envío ágil</li>
            </ul>
          </div>

          <div className={styles.column}>
            <figure className={styles.imageWrapper}>
              <img
                src="https://img.freepik.com/free-photo/soccer-player-action-stadium_1150-14598.jpg"
                alt="Equipo celebrando en una cancha de fútbol"
                className={styles.image}
              />
              <figcaption className={styles.caption}>
                Pasión por el juego, tecnología al servicio del deporte
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesGrid}>
          <article className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Transparencia</h3>
            <p className={styles.valueText}>
              Políticas claras, cargos visibles y comunicación honesta.
            </p>
          </article>

          <article className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Rapidez</h3>
            <p className={styles.valueText}>
              Reservas confirmadas y envíos 24/48 h según tu zona.
            </p>
          </article>

          <article className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Soporte humano</h3>
            <p className={styles.valueText}>
              Acompañamiento real para resolver dudas y mejorar tu juego.
            </p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <p className={styles.ctaText}>¿Listo para jugar o equiparte?</p>
        <nav className={styles.ctaButtons}>
          <Link to="/reservas" className={styles.btnPrimary}>
            Reservar cancha
          </Link>
          <Link
            to="/"
            className={styles.btnSecondary}
            onClick={(e) => {
              const el = document.getElementById("productos");
              if (el) {
                e.preventDefault();
                scrollToSection("productos");
              }
            }}
          >
            Ver productos
          </Link>
        </nav>
      </section>
    </main>
  );
};

export default SobreNosotros;
