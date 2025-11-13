import { Modal, Button, Form, Alert, Card } from "react-bootstrap";

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

  const handleImageUrlChange = (e) => {
    onChange(e); // Mantener el cambio normal para la URL
  };

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
          {/* Mostrar imagen actual si existe */}
          {productData.currentImage && (
            <Form.Group className="mb-3" controlId="prodCurrentImage">
              <Form.Label>Imagen Actual</Form.Label>
              <div>
                <Card style={{ width: '150px', marginBottom: '10px' }}>
                  <Card.Img 
                    variant="top" 
                    src={productData.currentImage} 
                    alt="Imagen actual del producto"
                    style={{ height: '100px', objectFit: 'cover' }}
                  />
                </Card>
                <Form.Text className="text-muted">
                  Esta es la imagen actual del producto
                </Form.Text>
              </div>
            </Form.Group>
          )}

          {/* Campo para URL de imagen (manteniendo tu estructura actual) */}
          <Form.Group className="mb-3" controlId="prodImage">
            <Form.Label>
              {productData.currentImage ? "Cambiar Imagen (URL)" : "Imagen del Producto (URL)"}
            </Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={productData.image || ""}
              onChange={handleImageUrlChange}
              disabled={saving}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <Form.Text className="text-muted">
              {productData.currentImage 
                ? "Ingresa una nueva URL para reemplazar la imagen actual" 
                : "Ingresa la URL de la imagen del producto"
              }
            </Form.Text>
          </Form.Group>

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