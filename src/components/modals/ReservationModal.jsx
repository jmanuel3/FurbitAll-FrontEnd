import { Modal, Button, Form, Alert } from "react-bootstrap";

const ReservationModal = ({
  show,
  onHide,
  reservationData,
  isEditing,
  onChange,
  onSave,
  saving,
  error,
  fields,
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
        <Modal.Title>{isEditing ? "Editar" : "Crear"} reserva</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="py-2">
            {error}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3" controlId="resField">
            <Form.Label>Cancha *</Form.Label>
            <Form.Select
              value={reservationData.field}
              onChange={(e) => onChange("field", e.target.value)}
              required
              autoFocus
              disabled={saving}
            >
              <option value="">-- Seleccionar cancha --</option>
              {fields.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="resDate">
            <Form.Label>Fecha *</Form.Label>
            <Form.Control
              type="date"
              value={reservationData.date}
              onChange={(e) => onChange("date", e.target.value)}
              required
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="resHour">
            <Form.Label>Hora *</Form.Label>
            <Form.Control
              type="time"
              value={reservationData.hour}
              onChange={(e) => onChange("hour", e.target.value)}
              required
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="resDuration">
            <Form.Label>Duración (minutos) *</Form.Label>
            <Form.Select
              value={reservationData.duration ?? 60}
              onChange={(e) => onChange("duration", Number(e.target.value))}
              required
              disabled={saving}
            >
              {[30, 60].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
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

export default ReservationModal;
