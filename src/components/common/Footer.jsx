import { Facebook, Twitter, Instagram } from "react-bootstrap-icons";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} FurbitAll. Todos los derechos
        reservados.
      </p>

      <div className="footer-icons">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook size={24} color="#F5F5DC" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <Twitter size={24} color="#F5F5DC" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram size={24} color="#F5F5DC" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
