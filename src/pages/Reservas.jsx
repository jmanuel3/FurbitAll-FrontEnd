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
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        `✅ Reserva creada para ${reserva.date} a las ${reserva.hour}`
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
      "¿Estás seguro de que querés cancelar esta reserva?"
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
    <Container className="my-5">
      <Container>
        <h2>Crear Reserva</h2>

        {message && (
          <Alert
            variant={message.startsWith("✅") ? "success" : "danger"}
            className="mt-2"
          >
            {message}
          </Alert>
        )}

        <Form
          onSubmit={handleSubmit}
          className="p-4 border rounded shadow-sm bg-light"
        >
          <fieldset>
            <legend className="mb-3 fs-4 text-success">Nueva Reserva</legend>

            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Cancha</Form.Label>
                  <Form.Select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar cancha</option>
                    {fields.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name} — {f.location}
                      </option>
                    ))}
                  </Form.Select>
                  {formErrors.field && (
                    <Form.Text className="text-danger">
                      {formErrors.field}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <DatePicker
                    selected={date ? new Date(date) : null}
                    onChange={(dateObj) => setDate(localISODate(dateObj))}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    className="form-control"
                    placeholderText="Seleccioná una fecha"
                    required
                  />
                  {formErrors.date && (
                    <Form.Text className="text-danger">
                      {formErrors.date}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              {selectedField && date && (
                <>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Duración</Form.Label>
                      <Form.Select
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        required
                      >
                        <option value={30}>30 minutos</option>
                        <option value={60}>1 hora</option>
                      </Form.Select>
                      {formErrors.duration && (
                        <Form.Text className="text-danger">
                          {formErrors.duration}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Hora</Form.Label>
                      <Form.Select
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        required
                        aria-describedby={
                          Number(duration) === 60 ? "dur60-help" : undefined
                        }
                      >
                        <option value="">Seleccioná una hora</option>
                        {generateTimeOptions()
                          .filter((h) => {
                            if (reservedHours.includes(h)) return false;
                            if (duration === 60) {
                              const [hourStr, minuteStr] = h.split(":");
                              const hour = parseInt(hourStr, 10);
                              const minute = parseInt(minuteStr, 10);
                              let nextHour = hour;
                              let nextMinute = minute + 30;
                              if (nextMinute >= 60) {
                                nextMinute = 0;
                                nextHour += 1;
                              }
                              const nextSlotStr = `${String(nextHour).padStart(
                                2,
                                "0"
                              )}:${String(nextMinute).padStart(2, "0")}`;
                              if (reservedHours.includes(nextSlotStr))
                                return false;
                            }
                            return true;
                          })
                          .map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                      </Form.Select>

                      {Number(duration) === 60 && selectedField && date && (
                        <div className="mt-1">
                          <Form.Text id="dur60-help" className="text-muted">
                            Para <strong>1 hora</strong> necesitás dos bloques
                            seguidos de 30’. Si elegís{" "}
                            <strong>{hour || "HH:mm"}</strong>, también debe
                            estar libre{" "}
                            <strong>
                              {hour ? nextSlot(hour) : "siguiente bloque"}
                            </strong>
                            .
                          </Form.Text>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="dur60-tip">
                                Mostramos solo los horarios donde también está
                                libre el siguiente bloque de 30’.
                              </Tooltip>
                            }
                          >
                            <span
                              role="button"
                              tabIndex={0}
                              className="ms-2 text-decoration-underline"
                              style={{ cursor: "help" }}
                            >
                              ¿Por qué?
                            </span>
                          </OverlayTrigger>
                        </div>
                      )}

                      {formErrors.hour && (
                        <Form.Text className="text-danger">
                          {formErrors.hour}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>

            <Button type="submit" variant="success" className="mt-4 w-100">
              Reservar cancha
            </Button>
          </fieldset>
        </Form>
      </Container>

      <Container className="mt-5">
        <h3>📋 Próximas Reservas</h3>
        {myReservations.filter((r) => isFutureReservation(r.date, r.hour))
          .length === 0 ? (
          <p>No tenés reservas próximas.</p>
        ) : (
          <ListGroup className="mb-4">
            {myReservations
              .filter((r) => isFutureReservation(r.date, r.hour))
              .map((r) => (
                <ListGroup.Item
                  key={r._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>{r.field?.name}</strong> — {r.date} a las {r.hour}
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCancel(r._id)}
                  >
                    Cancelar
                  </Button>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Container>

      <Container className="mt-5">
        <h3>🕓 Reservas Pasadas</h3>
        {myReservations.filter((r) => !isFutureReservation(r.date, r.hour))
          .length === 0 ? (
          <p>No hay reservas anteriores.</p>
        ) : (
          <ListGroup>
            {myReservations
              .filter((r) => !isFutureReservation(r.date, r.hour))
              .map((r) => (
                <ListGroup.Item key={r._id}>
                  <strong>{r.field?.name}</strong> — {r.date} a las {r.hour}
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Container>
    </Container>
  );
};

export default Reservas;
