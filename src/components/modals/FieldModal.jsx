import { Modal, Button, Form, Alert } from "react-bootstrap";

const FieldModal = ({
  show,
  onHide,
  fieldData,
  onChange,
  onSave,
  saving,
  error,
}) => {
  return (
    <Modal
      show={show}
      onHide={saving ? undefined : onHide}
      backdrop="static"
      keyboard={!saving}
      centered
    >
      <Modal.Header closeButton={!saving}>
        <Modal.Title>{fieldData?._id ? "Editar" : "Crear"} cancha</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="py-2">
            {error}
          </Alert>
        )}

        {fieldData && (
          <Form>
            <Form.Group className="mb-3" controlId="fieldName">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                name="name"
                value={fieldData.name}
                onChange={onChange}
                placeholder="Ej: Cancha Norte"
                required
                autoFocus
                disabled={saving}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fieldLocation">
              <Form.Label>Ubicación *</Form.Label>
              <Form.Control
                name="location"
                value={fieldData.location}
                onChange={onChange}
                placeholder="Ej: Avenida 123"
                required
                disabled={saving}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="fieldImage">
              <Form.Label>URL de imagen</Form.Label>
              <Form.Control
                name="image"
                value={fieldData.image}
                onChange={onChange}
                placeholder="https://ejemplo.com/cancha.jpg"
                disabled={saving}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FieldModal;
