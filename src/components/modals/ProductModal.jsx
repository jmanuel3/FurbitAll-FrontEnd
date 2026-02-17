import styles from "./Modal.module.css";

const ProductModal = ({
  show,
  onHide,
  productData,
  onChange,
  onSave,
  saving,
  error,
}) => {
  if (!show || !productData) return null;

  const handleImageUrlChange = (e) => {
    onChange(e);
  };

  return (
    <div className={styles.overlay} onClick={saving ? undefined : onHide}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            {productData._id ? "Editar" : "Crear"} producto
          </h2>
          <button
            className={styles.closeButton}
            onClick={onHide}
            disabled={saving}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          {error && (
            <div className={`${styles.alert} ${styles.alertDanger}`}>
              {error}
            </div>
          )}

          <form>
            {/* Current Image Preview */}
            {productData.currentImage && (
              <div className={styles.formGroup}>
                <span className={styles.previewLabel}>Imagen Actual</span>
                <div className={styles.imagePreview}>
                  <img
                    src={productData.currentImage}
                    alt="Imagen actual del producto"
                    className={styles.previewImage}
                  />
                </div>
                <p className={styles.helpText}>
                  Esta es la imagen actual del producto
                </p>
              </div>
            )}

            {/* Image URL */}
            <div className={styles.formGroup}>
              <label htmlFor="prodImage" className={styles.label}>
                {productData.currentImage
                  ? "Cambiar Imagen (URL)"
                  : "Imagen del Producto (URL)"}
              </label>
              <input
                id="prodImage"
                type="text"
                name="image"
                value={productData.image || ""}
                onChange={handleImageUrlChange}
                disabled={saving}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={styles.input}
              />
              <p className={styles.helpText}>
                {productData.currentImage
                  ? "Ingresa una nueva URL para reemplazar la imagen actual"
                  : "Ingresa la URL de la imagen del producto"}
              </p>
            </div>

            {/* Name */}
            <div className={styles.formGroup}>
              <label
                htmlFor="prodName"
                className={`${styles.label} ${styles.required}`}
              >
                Nombre
              </label>
              <input
                id="prodName"
                type="text"
                name="name"
                value={productData.name || ""}
                onChange={onChange}
                disabled={saving}
                required
                autoFocus
                className={styles.input}
              />
            </div>

            {/* Price */}
            <div className={styles.formGroup}>
              <label
                htmlFor="prodPrice"
                className={`${styles.label} ${styles.required}`}
              >
                Precio
              </label>
              <input
                id="prodPrice"
                type="number"
                name="price"
                value={productData.price || ""}
                onChange={onChange}
                disabled={saving}
                required
                min="0"
                step="0.01"
                className={styles.input}
              />
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label htmlFor="prodDesc" className={styles.label}>
                Descripción
              </label>
              <textarea
                id="prodDesc"
                name="description"
                value={productData.description || ""}
                onChange={onChange}
                disabled={saving}
                className={styles.textarea}
              />
            </div>

            {/* Stock */}
            {"stock" in productData && (
              <div className={styles.formGroup}>
                <label htmlFor="prodStock" className={styles.label}>
                  Stock
                </label>
                <input
                  id="prodStock"
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={onChange}
                  disabled={saving}
                  min="0"
                  className={styles.input}
                />
              </div>
            )}
          </form>
        </div>

        <footer className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onHide}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className={styles.saveButton}
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProductModal;
