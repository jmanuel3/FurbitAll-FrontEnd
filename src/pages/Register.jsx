import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/AuthForms.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El formato del email es inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateForm()) {
      setMessage("Por favor, corrige los errores del formulario");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "https://furbitall-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        },
      );

      let data;
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch (err) {
          data = { message: "Respuesta inválida del servidor" };
        }
      } else {
        const text = await res.text();
        data = { message: text };
      }

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error(data.message || "Datos de registro inválidos");
        } else if (res.status === 409) {
          throw new Error(data.message || "El usuario ya existe");
        } else {
          throw new Error(
            data.message || `Error ${res.status}: ${res.statusText}`,
          );
        }
      }

      setMessage(
        "success:Usuario registrado con éxito. Ahora puedes iniciar sesión.",
      );
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const raw = error && error.message ? String(error.message) : "";
      let friendly;

      if (raw.includes("Failed to fetch") || error.name === "TypeError") {
        friendly = "No se pudo conectar con el servidor.";
      } else if (raw.includes("network") || raw.includes("Network")) {
        friendly = "Error de red. Revisa tu conexión.";
      } else if (raw) {
        friendly = raw;
      } else {
        friendly = "Ocurrió un error inesperado.";
      }

      setMessage(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccess = message.startsWith("success:");
  const displayMessage = isSuccess ? message.replace("success:", "") : message;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Crear cuenta</h2>
        <p className={styles.authSubtitle}>Únete a FurbitAll</p>

        {message && (
          <div
            className={`${styles.alert} ${isSuccess ? styles.alertSuccess : styles.alertError}`}
          >
            {displayMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              required
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${errors.email ? styles.error : ""}`}
              required
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${errors.password ? styles.error : ""}`}
              required
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <div className={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className={styles.footerLink}>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
