import { Modal, Button, Form, Alert } from "react-bootstrap";

const ProductModal = ({
  show,
  onHide,
  productData,
  onChange,
  onSave,
  saving,
  error,
}) => {
  if (!productData) return null;

  return (
    <Modal
      show={show}
      onHide={saving ? undefined : onHide}
      backdrop="static"
      keyboard={!saving}
      centered
    >
      <Modal.Header closeButton={!saving}>
        <Modal.Title>
          {productData._id ? "Editar" : "Crear"} producto
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="py-2">
            {error}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3" controlId="prodName">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={productData.name || ""}
              onChange={onChange}
              disabled={saving}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="prodPrice">
            <Form.Label>Precio *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={productData.price || ""}
              onChange={onChange}
              disabled={saving}
              required
              min="0"
              step="0.01"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="prodDesc">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={productData.description || ""}
              onChange={onChange}
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="prodImage">
            <Form.Label>Imagen (URL)</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={productData.image || ""}
              onChange={onChange}
              disabled={saving}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </Form.Group>

          {"stock" in productData && (
            <Form.Group className="mb-3" controlId="prodStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={productData.stock}
                onChange={onChange}
                disabled={saving}
                min="0"
              />
            </Form.Group>
          )}
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

export default ProductModal;
