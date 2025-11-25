import { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

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
      setMessage("❌ Por favor, corrige los errores del formulario");
      return;
    }

    try {
      console.log("🔄 Enviando datos:", { name, email, password });
      
      const res = await fetch("https://furbitall-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("📡 Respuesta del servidor - Status:", res.status);

      let data;
      const contentType = res.headers.get("content-type") || "";
      
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch (err) {
          console.error("❌ Error parseando JSON:", err);
          data = { message: "Respuesta inválida del servidor" };
        }
      } else {
        const text = await res.text();
        console.log("📄 Respuesta en texto:", text);
        data = { message: text };
      }

      if (!res.ok) {
        
        if (res.status === 400) {
          throw new Error(data.message || "Datos de registro inválidos");
        } else if (res.status === 409) {
          throw new Error(data.message || "El usuario ya existe");
        } else {
          throw new Error(data.message || `Error ${res.status}: ${res.statusText}`);
        }
      }

      setMessage("✅ Usuario registrado con éxito. Ahora podés iniciar sesión.");
      setName("");
      setEmail("");
      setPassword("");
      
    } catch (error) {
      console.error("💥 Error completo:", error);
      const raw = error && error.message ? String(error.message) : "";
      let friendly;

      if (raw.includes("Failed to fetch") || error.name === "TypeError") {
        friendly = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 4000.";
      } else if (raw.includes("network") || raw.includes("Network")) {
        friendly = "Error de red. Revisa tu conexión y que el servidor esté activo.";
      } else if (raw) {
        friendly = raw;
      } else {
        friendly = "Ocurrió un error inesperado. Intentá nuevamente.";
      }

      setMessage(`❌ ${friendly}`);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="mb-4 text-center">Registro</h2>
          {message && (
            <Alert variant={message.startsWith("✅") ? "success" : "danger"}>
              {message}
            </Alert>
          )}
          <Form
            onSubmit={handleRegister}
            className="p-4 border rounded shadow bg-light"
          >
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!errors.name}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="success" className="w-100">
              Registrarse
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;