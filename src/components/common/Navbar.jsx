import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import styles from "./Navbar.module.css";

function Menu() {
  const { token, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.logo} onClick={closeMenu}>
            <img
              src={Logo}
              alt="Logo FurbitAll"
              className={styles.logoImage}
            />
          </NavLink>

          <button
            className={`${styles.menuToggle} ${isOpen ? styles.active : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburger}></span>
          </button>

          <div className={`${styles.navMenu} ${isOpen ? styles.open : ''}`}>
            {!token ? (
              <>
                <NavLink
                  end
                  to="/"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Inicio
                </NavLink>
                <NavLink
                  to="/sobre-nosotros"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Sobre Nosotros
                </NavLink>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `${styles.navLink} ${styles.cartLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Carrito
                  {cartCount > 0 && (
                    <span className={styles.cartBadge}>{cartCount}</span>
                  )}
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Registro
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  end
                  to="/"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Inicio
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                    onClick={closeMenu}
                  >
                    Administración
                  </NavLink>
                )}

                <NavLink
                  to="/reservas"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Reservas
                </NavLink>
                <NavLink
                  to="/sobre-nosotros"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Sobre Nosotros
                </NavLink>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `${styles.navLink} ${styles.cartLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeMenu}
                >
                  Carrito
                  {cartCount > 0 && (
                    <span className={styles.cartBadge}>{cartCount}</span>
                  )}
                </NavLink>

                <button
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
        onClick={closeMenu}
      />
    </>
  );
}

export default Menu;