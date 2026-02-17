import styles from "./Modal.module.css";

const FieldModal = ({
  show,
  onHide,
  fieldData,
  onChange,
  onSave,
  saving,
  error,
}) => {
  if (!show || !fieldData) return null;

  return (
    <div className={styles.overlay} onClick={saving ? undefined : onHide}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            {fieldData._id ? "Editar" : "Crear"} cancha
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
            {/* Name */}
            <div className={styles.formGroup}>
              <label
                htmlFor="fieldName"
                className={`${styles.label} ${styles.required}`}
              >
                Nombre
              </label>
              <input
                id="fieldName"
                type="text"
                name="name"
                value={fieldData.name}
                onChange={onChange}
                placeholder="Ej: Cancha Norte"
                required
                autoFocus
                disabled={saving}
                className={styles.input}
              />
            </div>

            {/* Location */}
            <div className={styles.formGroup}>
              <label
                htmlFor="fieldLocation"
                className={`${styles.label} ${styles.required}`}
              >
                Ubicación
              </label>
              <input
                id="fieldLocation"
                type="text"
                name="location"
                value={fieldData.location}
                onChange={onChange}
                placeholder="Ej: Avenida 123"
                required
                disabled={saving}
                className={styles.input}
              />
            </div>

            {/* Image URL */}
            <div className={styles.formGroup}>
              <label htmlFor="fieldImage" className={styles.label}>
                URL de imagen
              </label>
              <input
                id="fieldImage"
                type="text"
                name="image"
                value={fieldData.image}
                onChange={onChange}
                placeholder="https://ejemplo.com/cancha.jpg"
                disabled={saving}
                className={styles.input}
              />
            </div>
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

export default FieldModal;
