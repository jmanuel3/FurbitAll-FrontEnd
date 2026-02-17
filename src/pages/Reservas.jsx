import { useState, useEffect } from "react";
import { getFields } from "../services/fieldService";
import {
  cancelReservation,
  createReservation,
  getMyReservations,
  getReservedHours,
} from "../services/reservationService";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Reservas.module.css";

const localISODate = (dateObj) => {
  if (!dateObj) return "";
  const tz = dateObj.getTimezoneOffset() * 60000;
  return new Date(dateObj.getTime() - tz).toISOString().slice(0, 10);
};

const isValidDateFormat = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidHourFormat = (s) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(s);
const isValidHourStep = (s) =>
  isValidHourFormat(s) && (s.endsWith(":00") || s.endsWith(":30"));
const isValidDuration = (d) => [30, 60].includes(Number(d));

const isFutureDateTime = (dateStr, hourStr) => {
  if (!isValidDateFormat(dateStr) || !isValidHourFormat(hourStr)) return false;
  const dt = new Date(`${dateStr}T${hourStr}:00`);
  return dt.getTime() > Date.now();
};

const nextSlot = (hhmm) => {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  let H = h,
    M = m + 30;
  if (M >= 60) {
    M = 0;
    H += 1;
  }
  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
};

const generateTimeOptions = () => {
  const hours = [];
  for (let h = 8; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      hours.push(`${hh}:${mm}`);
    }
  }
  return hours;
};

const Reservas = () => {
  const { token } = useAuth();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [duration, setDuration] = useState(30);
  const [message, setMessage] = useState("");
  const [myReservations, setMyReservations] = useState([]);
  const [reservedHours, setReservedHours] = useState([]);
  const [formErrors, setFormErrors] = useState({
    field: "",
    date: "",
    duration: "",
    hour: "",
  });
  const navigate = useNavigate();
  const locationHook = useLocation();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    const fetchFieldsAndReservations = async () => {
      try {
        const fieldsData = await getFields();
        setFields(fieldsData);
        const myRes = await getMyReservations(token);
        setMyReservations(myRes);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchFieldsAndReservations();
  }, [token]);

  useEffect(() => {
    if (!fields || fields.length === 0) return;
    const params = new URLSearchParams(locationHook.search);
    const fieldFromQuery = params.get("field");
    if (fieldFromQuery && fields.some((f) => f._id === fieldFromQuery)) {
      setSelectedField(fieldFromQuery);
    }
  }, [fields, locationHook.search]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedField || !date) return;
      try {
        const hours = await getReservedHours(token, selectedField, date);
        setReservedHours(hours || []);
      } catch (err) {
        console.error(err.message);
        setReservedHours([]);
      }
    };
    fetchAvailability();
  }, [selectedField, date, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = { field: "", date: "", duration: "", hour: "" };

    if (!selectedField) errors.field = "Seleccioná una cancha.";
    if (!date) {
      errors.date = "Seleccioná una fecha.";
    } else if (!isValidDateFormat(date)) {
      errors.date = "Formato de fecha inválido (YYYY-MM-DD).";
    }

    if (duration === undefined || duration === null || duration === "") {
      errors.duration = "Seleccioná duración.";
    } else if (!isValidDuration(duration)) {
      errors.duration = "Duración inválida. Debe ser 30 o 60 minutos.";
    }

    if (!hour) {
      errors.hour = "Seleccioná una hora.";
    } else if (!isValidHourStep(hour)) {
      errors.hour =
        "Hora inválida. Debe ser un múltiplo de 30 minutos (HH:00 o HH:30).";
    }

    if (!errors.date && !errors.hour && !isFutureDateTime(date, hour)) {
      errors.hour = "La reserva debe ser en el futuro.";
    }

    if (!errors.hour && reservedHours.includes(hour)) {
      errors.hour = "Esa hora ya está reservada.";
    }
    if (!errors.hour && Number(duration) === 60) {
      const n = nextSlot(hour);
      if (reservedHours.includes(n)) {
        errors.hour = "Para 1 hora debe haber dos bloques consecutivos libres.";
      }
    }

    setFormErrors(errors);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    try {
      const reserva = await createReservation(token, {
        field: selectedField,
        date,
        hour,
        duration,
      });

      setMessage(
        `✅ Reserva creada para ${reserva.date} a las ${reserva.hour}`,
      );
      setTimeout(() => setMessage(""), 3000);

      setSelectedField("");
      setDate("");
      setHour("");
      setDuration(30);
      setFormErrors({ field: "", date: "", duration: "", hour: "" });

      const myRes = await getMyReservations(token);
      setMyReservations(myRes);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que querés cancelar esta reserva?",
    );
    if (!confirmDelete) return;

    try {
      await cancelReservation(token, id);
      setMessage("✅ Reserva cancelada");
      setTimeout(() => setMessage(""), 3000);
      const myRes = await getMyReservations(token);
      setMyReservations(myRes);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const isFutureReservation = (d, h) => {
    const now = new Date();
    const reservationDate = new Date(`${d}T${h}`);
    return reservationDate > now;
  };

  return (
    <main className={styles.reservasPage}>
      <h1 className={styles.pageTitle}>Reservas de Canchas</h1>

      {message && (
        <div
          className={`${styles.alert} ${
            message.startsWith("✅") ? styles.alertSuccess : styles.alertDanger
          }`}
        >
          {message}
        </div>
      )}

      {/* Form Section */}
      <section className={styles.formCard}>
        <h2 className={styles.formTitle}>📅 Nueva Reserva</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* Field Select */}
            <div className={styles.formGroup}>
              <label
                htmlFor="field"
                className={`${styles.label} ${styles.required}`}
              >
                Cancha
              </label>
              <select
                id="field"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Seleccionar cancha</option>
                {fields.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} — {f.location}
                  </option>
                ))}
              </select>
              {formErrors.field && (
                <span className={styles.errorText}>{formErrors.field}</span>
              )}
            </div>

            {/* Date Picker */}
            <div className={styles.formGroup}>
              <label
                htmlFor="date"
                className={`${styles.label} ${styles.required}`}
              >
                Fecha
              </label>
              <div className={styles.datePickerWrapper}>
                <DatePicker
                  id="date"
                  selected={date ? new Date(date) : null}
                  onChange={(dateObj) => setDate(localISODate(dateObj))}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  className={styles.input}
                  placeholderText="Seleccioná una fecha"
                  required
                />
              </div>
              {formErrors.date && (
                <span className={styles.errorText}>{formErrors.date}</span>
              )}
            </div>

            {selectedField && date && (
              <>
                {/* Duration */}
                <div className={styles.formGroup}>
                  <label
                    htmlFor="duration"
                    className={`${styles.label} ${styles.required}`}
                  >
                    Duración
                  </label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className={styles.select}
                    required
                  >
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                  </select>
                  {formErrors.duration && (
                    <span className={styles.errorText}>
                      {formErrors.duration}
                    </span>
                  )}
                </div>

                {/* Hour */}
                <div className={styles.formGroup}>
                  <label
                    htmlFor="hour"
                    className={`${styles.label} ${styles.required}`}
                  >
                    Hora
                  </label>
                  <select
                    id="hour"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className={styles.select}
                    required
                  >
                    <option value="">Seleccioná una hora</option>
                    {generateTimeOptions()
                      .filter((h) => {
                        if (reservedHours.includes(h)) return false;
                        if (duration === 60) {
                          const n = nextSlot(h);
                          if (reservedHours.includes(n)) return false;
                        }
                        return true;
                      })
                      .map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                  </select>

                  {Number(duration) === 60 && selectedField && date && (
                    <p className={styles.helpText}>
                      Para <strong>1 hora</strong> necesitás dos bloques
                      seguidos de 30'. Si elegís{" "}
                      <strong>{hour || "HH:mm"}</strong>, también debe estar
                      libre{" "}
                      <strong>
                        {hour ? nextSlot(hour) : "siguiente bloque"}
                      </strong>
                      .{" "}
                      <span
                        className={styles.helpTextLink}
                        title="Mostramos solo los horarios donde también está libre el siguiente bloque de 30'"
                      >
                        ¿Por qué?
                      </span>
                    </p>
                  )}

                  {formErrors.hour && (
                    <span className={styles.errorText}>{formErrors.hour}</span>
                  )}
                </div>
              </>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            Reservar cancha
          </button>
        </form>
      </section>

      {/* Future Reservations */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📋 Próximas Reservas</h2>
        {myReservations.filter((r) => isFutureReservation(r.date, r.hour))
          .length === 0 ? (
          <p className={styles.emptyState}>No tenés reservas próximas.</p>
        ) : (
          <div className={styles.reservationsList}>
            {myReservations
              .filter((r) => isFutureReservation(r.date, r.hour))
              .map((r) => (
                <div key={r._id} className={styles.reservationItem}>
                  <div className={styles.reservationInfo}>
                    <div className={styles.reservationField}>
                      {r.field?.name}
                    </div>
                    <div className={styles.reservationDetails}>
                      {r.date} a las {r.hour}
                    </div>
                  </div>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel(r._id)}
                  >
                    Cancelar
                  </button>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Past Reservations */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🕓 Reservas Pasadas</h2>
        {myReservations.filter((r) => !isFutureReservation(r.date, r.hour))
          .length === 0 ? (
          <p className={styles.emptyState}>No hay reservas anteriores.</p>
        ) : (
          <div className={styles.reservationsList}>
            {myReservations
              .filter((r) => !isFutureReservation(r.date, r.hour))
              .map((r) => (
                <div key={r._id} className={styles.pastReservationItem}>
                  <div className={styles.pastReservationField}>
                    {r.field?.name}
                  </div>
                  <div className={styles.reservationDetails}>
                    {r.date} a las {r.hour}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Reservas;
