import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(email, password);
      login(token, user);
      navigate(user.role === "admin" ? "/admin" : "/");
      alert("¡Sesión iniciada con éxito!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="mb-4 text-center">Iniciar sesión</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form
            onSubmit={handleSubmit}
            className="p-4 border rounded shadow bg-light"
          >
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              Entrar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
