import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getFields } from "../services/fieldService";
import ProductCard from "./Producto/ProductCard";
import FieldCard from "./Field/FieldCard";
import Ad from "../components/Ad";
import { Container, Row, Col } from "react-bootstrap";
import HeroSection from "../components/HeroSection";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

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
    <Container className="py-4">
      <HeroSection />
      <main>
        <h2>🏟️ Bienvenido a FurbitAll</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <section
          id="productos"
          aria-labelledby="productos-heading"
          className="mt-4"
        >
          <h3 className="mt-4">🛒 Productos</h3>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-5">
            {products.map((p) => (
              <Col key={p._id}>
                <ProductCard
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
              </Col>
            ))}
          </Row>
          <Ad />
        </section>

        <h3 className="mt-5">⚽ Canchas disponibles</h3>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {fields.map((f) => (
            <Col key={f._id}>
              <FieldCard
                _id={f._id}
                name={f.name}
                location={f.location}
                image={f.image}
              />
            </Col>
          ))}
        </Row>
      </main>
    </Container>
  );
};

export default Home;
