import { useEffect, useState } from "react";
import { getAds } from "../services/adService";
import styles from "./Ad.module.css";

const FALLBACK_SLIDES = [
  {
    id: "fb-1",
    image: "https://i.ytimg.com/vi/mAxAlwv0PmA/maxresdefault.jpg",
    alt: "Promo exclusiva — Descuento en canchas",
    title: "Promo exclusiva",
    text: "¡Alquila tu cancha con 10% de descuento este mes!",
  },
  {
    id: "fb-2",
    image: "https://marketips.es/wp-content/uploads/2012/11/Valla-Jeep.jpg",
    alt: "Nuevos productos — Pelotas profesionales",
    title: "¡Nuevos productos!",
    text: "Descubrí nuestra línea de pelotas profesionales.",
  },
  {
    id: "fb-3",
    image:
      "https://blog.comparasoftware.com/wp-content/uploads/2021/12/publicidad-coca-cola.jpeg",
    alt: "Ofertas limitadas — Promos de temporada",
    title: "Ofertas limitadas",
    text: "¡Mirá nuestras promos de temporada!",
  },
];

const Ad = () => {
  const [slides, setSlides] = useState([]);
  const [status, setStatus] = useState("idle");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setStatus("loading");
        const ads = await getAds();

        const normalized = ads.map((a) => ({
          id: a._id ?? crypto.randomUUID(),
          image: a.image,
          alt: a.alt || a.title || "Publicidad",
          title: a.title || "",
          text: a.text || "",
        }));

        if (!ignore) {
          setSlides(normalized.length ? normalized : FALLBACK_SLIDES);
          setStatus("ready");
        }
      } catch {
        if (!ignore) {
          setSlides(FALLBACK_SLIDES);
          setStatus("error");
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Auto-play
  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (status === "loading") {
    return (
      <section className={styles.adSection} aria-label="Cargando publicidad">
        <div className={styles.skeleton} />
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className={styles.adSection} aria-label="Carousel publicitario">
      <div className={styles.carouselContainer}>
        <div className={styles.carousel}>
          <div
            className={styles.slideWrapper}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className={styles.slide}>
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className={styles.slideImage}
                  loading="lazy"
                />
                <div className={styles.gradient} />
                {(slide.title || slide.text) && (
                  <div className={styles.caption}>
                    {slide.title && (
                      <h3 className={styles.captionTitle}>{slide.title}</h3>
                    )}
                    {slide.text && (
                      <p className={styles.captionText}>{slide.text}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="Slide anterior"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="Siguiente slide"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Indicators */}
          <div className={styles.indicators}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.indicator} ${
                  index === currentSlide ? styles.active : ""
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ad;
