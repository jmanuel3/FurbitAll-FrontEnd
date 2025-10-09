import { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      // Try to parse JSON when possible, otherwise fallback to text
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
        // Use server-provided message when available, otherwise include status
        throw new Error(
          data.message || `Error ${res.status}: ${res.statusText}`
        );
      }

      setMessage(
        "✅ Usuario registrado con éxito. Ahora podés iniciar sesión."
      );
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const raw = error && error.message ? String(error.message) : "";
      let friendly;
      const lower = raw.toLowerCase();

      if (lower.includes("failed to fetch") || error.name === "TypeError") {
        friendly =
          "No se pudo conectar con el servidor. Verifica tu conexión a internet o intenta más tarde.";
      } else if (lower.includes("network")) {
        friendly = "Error de red. Revisa tu conexión.";
      } else if (raw) {
        friendly = raw;
      } else {
        friendly = "Ocurrió un error inesperado. Intentelo nuevamente.";
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
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
