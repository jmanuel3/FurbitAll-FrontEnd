import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getFields } from "../services/fieldService";
import ProductCard from "./Producto/ProductCard";
import FieldCard from "./Field/FieldCard";
import Ad from "../components/Ad";
import HeroSection from "../components/HeroSection";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css"; // CSS Module import

const Home = () => {
  const [products, setProducts] = useState([]);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productos = await getProducts();
        const canchas = await getFields();
        setProducts(productos);
        setFields(canchas);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.homePage}>
      <HeroSection />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.welcomeTitle}>🏟️ Bienvenido a FurbitAll</h2>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <section className={styles.productsSection} id="productos">
            <h3 className={styles.sectionTitle}>🛒 Productos</h3>
            <div className={styles.grid}>
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  name={p.name}
                  price={p.price}
                  image={p.image}
                  description={p.description}
                  stock={p.stock}
                  onAdd={() => {
                    addToCart(p);
                    navigate("/cart");
                  }}
                />
              ))}
            </div>
            <Ad />
          </section>

          <section className={styles.fieldsSection}>
            <h3 className={styles.sectionTitle}>⚽ Canchas disponibles</h3>
            <div className={styles.grid}>
              {fields.map((f) => (
                <FieldCard
                  key={f._id}
                  _id={f._id}
                  name={f.name}
                  location={f.location}
                  image={f.image}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;