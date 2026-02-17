import styles from "./Modal.module.css";

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
  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={saving ? undefined : onHide}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            {isEditing ? "Editar" : "Crear"} reserva
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
            {/* Field */}
            <div className={styles.formGroup}>
              <label
                htmlFor="resField"
                className={`${styles.label} ${styles.required}`}
              >
                Cancha
              </label>
              <select
                id="resField"
                value={reservationData.field}
                onChange={(e) => onChange("field", e.target.value)}
                required
                autoFocus
                disabled={saving}
                className={styles.select}
              >
                <option value="">-- Seleccionar cancha --</option>
                {fields.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className={styles.formGroup}>
              <label
                htmlFor="resDate"
                className={`${styles.label} ${styles.required}`}
              >
                Fecha
              </label>
              <input
                id="resDate"
                type="date"
                value={reservationData.date}
                onChange={(e) => onChange("date", e.target.value)}
                required
                disabled={saving}
                className={styles.input}
              />
            </div>

            {/* Hour */}
            <div className={styles.formGroup}>
              <label
                htmlFor="resHour"
                className={`${styles.label} ${styles.required}`}
              >
                Hora
              </label>
              <input
                id="resHour"
                type="time"
                value={reservationData.hour}
                onChange={(e) => onChange("hour", e.target.value)}
                required
                disabled={saving}
                className={styles.input}
              />
            </div>

            {/* Duration */}
            <div className={styles.formGroup}>
              <label
                htmlFor="resDuration"
                className={`${styles.label} ${styles.required}`}
              >
                Duración (minutos)
              </label>
              <select
                id="resDuration"
                value={reservationData.duration ?? 60}
                onChange={(e) => onChange("duration", Number(e.target.value))}
                required
                disabled={saving}
                className={styles.select}
              >
                {[30, 60].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
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

export default ReservationModal;
