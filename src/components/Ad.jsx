
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getAds } from "../services/adService";
import "../styles/Ad.css";

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

  
  if (status === "loading") {
    return (
      <section className="ad-wrap" aria-label="Cargando publicidad">
        <div className="ad-slide skeleton rounded-4" />
      </section>
    );
  }

  return (
    <section className="ad-wrap" aria-label="Carousel publicitario">
      <Carousel
        fade
        touch
        controls
        indicators
        interval={4000}
        pause="hover"
        className="shadow-lg rounded-4 overflow-hidden"
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <figure className="ad-slide m-0 position-relative">
              
              <div className="ratio ratio-16x9">
                <img
                  className="w-100 h-100"
                  src={slide.image}
                  alt={slide.alt}
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="ad-gradient" />
            </figure>

            {(slide.title || slide.text) && (
              <Carousel.Caption className="ad-caption d-none d-md-block">
                {slide.title && <h5>{slide.title}</h5>}
                {slide.text && <p>{slide.text}</p>}
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default Ad;
