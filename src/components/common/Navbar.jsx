
import { useState } from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "../../styles/Navbar.css";

function Menu() {
  const { token, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();


  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);

  const handleLogout = () => {
    logout();
    closeMenu(); 
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      className="menu"
      sticky="top"
      expanded={expanded}
      onToggle={(next) => setExpanded(next)}
    >
      <Container fluid className="px-4">
        <NavLink
          to="/"
          className="navbar-brand d-flex align-items-center"
          onClick={closeMenu} 
        >
          <img
            src={Logo}
            alt="Logo FurbitAll"
            className="img-fluid"
            width={100}
          />
        </NavLink>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto gap-2" navbarScroll>
            
            {!token && (
              <>
                <NavLink end className="nav-link" to="/" onClick={closeMenu}>
                  Inicio
                </NavLink>
                <NavLink
                  end
                  className="nav-link"
                  to="/sobre-nosotros"
                  onClick={closeMenu}
                >
                  Sobre Nosotros
                </NavLink>
                <NavLink
                  end
                  className="nav-link"
                  to="/cart"
                  aria-label="Carrito"
                  onClick={closeMenu}
                >
                  Carrito
                  {cartCount > 0 && (
                    <Badge bg="success" pill className="ms-1">
                      {cartCount}
                    </Badge>
                  )}
                </NavLink>
                <NavLink
                  end
                  className="nav-link"
                  to="/register"
                  onClick={closeMenu}
                >
                  Registro
                </NavLink>
                <NavLink
                  end
                  className="nav-link"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </>
            )}

            {token && (
              <>
                <NavLink end className="nav-link" to="/" onClick={closeMenu}>
                  Inicio
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink
                    end
                    className="nav-link"
                    to="/admin"
                    onClick={closeMenu}
                  >
                    Administración
                  </NavLink>
                )}

                <NavLink
                  end
                  className="nav-link"
                  to="/reservas"
                  onClick={closeMenu}
                >
                  Reservas
                </NavLink>
                <NavLink
                  end
                  className="nav-link"
                  to="/sobre-nosotros"
                  onClick={closeMenu}
                >
                  Sobre Nosotros
                </NavLink>

                <NavLink
                  end
                  className="nav-link d-flex align-items-center"
                  to="/cart"
                  aria-label="Carrito"
                  onClick={closeMenu}
                >
                  Carrito
                  {cartCount > 0 && (
                    <Badge bg="success" pill className="ms-1">
                      {cartCount}
                    </Badge>
                  )}
                </NavLink>

                <span
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </span>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
