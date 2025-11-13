import { useEffect, useState } from "react";
import {
  getFields,
  updateField,
  deleteField,
  createField,
} from "../services/fieldService";
import {
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../services/productService";
import {
  getAllReservations,
  updateReservation,
  deleteReservation,
  createReservation,
} from "../services/reservationService";
import { useAuth } from "../context/AuthContext";
import {
  Modal,
  Button,
  Form,
  Alert,
  Table,
  Stack,
  Badge,
  Spinner,
} from "react-bootstrap";
import FieldModal from "../components/modals/FieldModal";
import ProductModal from "../components/modals/ProductModal";
import ReservationModal from "../components/modals/ReservationModal";
const Admin = () => {
  const { token, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [fields, setFields] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState(null);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductData, setEditingProductData] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState("");

  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [editingFieldData, setEditingFieldData] = useState(null);
  const [savingField, setSavingField] = useState(false);
  const [fieldFormError, setFieldFormError] = useState("");

  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [editingReservationData, setEditingReservationData] = useState({
    field: "",
    date: "",
    hour: "",
  });
  const [savingReservation, setSavingReservation] = useState(false);
  const [reservationFormError, setReservationFormError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodData, fieldData, resData] = await Promise.all([
          getProducts(),
          getFields(),
          getAllReservations(token),
        ]);
        setProducts(prodData);
        setFields(fieldData);
        setReservations(resData);
      } catch (err) {
        console.error("Error al cargar datos de admin:", err.message);
        setFeedback({
          variant: "danger",
          text: "No se pudieron cargar los datos.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user]);

  const safe = (v) => (typeof v === "string" ? v.trim() : v);
  const toHHmm = (s) => {
    if (!s) return "";
    if (/am|pm/i.test(s)) {
      const [time, ampm] = s.split(/\s/);
      let [hh, mm] = time.split(":").map(Number);
      if (/pm/i.test(ampm) && hh < 12) hh += 12;
      if (/am/i.test(ampm) && hh === 12) hh = 0;
      return String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
    }
    return s.length > 5 ? s.slice(0, 5) : s;
  };

  const openEditProduct = (p) => {
  setEditingProductData({
    _id: p._id,
    name: p.name ?? "",
    price: p.price ?? "",
    description: p.description ?? "",
    stock: p.stock ?? 0,
    image: p.image ?? "",
    currentImage: null
  });
  setProductFormError("");
  setProductModalOpen(true);
};

  const closeProductModal = () => {
    if (savingProduct) return;
    setProductModalOpen(false);
    setEditingProductData(null);
    setSavingProduct(false);
    setProductFormError("");
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setEditingProductData((s) => ({ ...s, [name]: value }));
  };

  const saveProduct = async () => {
  try {
    setProductFormError("");
    const name = safe(editingProductData?.name);
    const price = Number(editingProductData?.price);

    if (!name) return setProductFormError("El nombre es obligatorio.");
    if (Number.isNaN(price) || price < 0)
      return setProductFormError("Precio inválido.");

    // Mantener el payload como objeto JSON (sin FormData)
    const payload = {
      name,
      price,
      description: safe(editingProductData?.description) || "",
      image: safe(editingProductData?.image) || "" // URL de la imagen
    };

    if ("stock" in editingProductData) {
      const stock = Number(editingProductData.stock);
      if (Number.isNaN(stock) || stock < 0)
        return setProductFormError("Stock inválido.");
      payload.stock = stock;
    }

    setSavingProduct(true);

    if (editingProductData?._id) {
      await updateProduct(token, editingProductData._id, payload);
      setFeedback({ variant: "success", text: "Producto actualizado." });
    } else {
      await createProduct(token, payload);
      setFeedback({ variant: "success", text: "Producto creado." });
    }

    const prodData = await getProducts();
    setProducts(prodData);
    closeProductModal();
  } catch (e) {
    setSavingProduct(false);
    setProductFormError(e.message || "Error al guardar el producto");
  }
};

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await deleteProduct(token, id);
      const prodData = await getProducts();
      setProducts(prodData);
      setFeedback({ variant: "success", text: "Producto eliminado." });
    } catch (err) {
      setFeedback({
        variant: "danger",
        text: err.message || "Error al eliminar producto.",
      });
    }
  };

  const openEditField = (f) => {
    setEditingFieldData({
      _id: f._id,
      name: f.name ?? "",
      location: f.location ?? "",
      image: f.image ?? "",
    });
    setFieldFormError("");
    setFieldModalOpen(true);
  };

  const closeFieldModal = () => {
    if (savingField) return;
    setFieldModalOpen(false);
    setEditingFieldData(null);
    setSavingField(false);
    setFieldFormError("");
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditingFieldData((s) => ({ ...s, [name]: value }));
  };

  const saveField = async () => {
    try {
      setFieldFormError("");

      if (!token) {
        console.warn("⛔ Token no definido");
        return setFieldFormError("Token inválido, vuelve a iniciar sesión.");
      }

      const name = safe(editingFieldData?.name);
      const location = safe(editingFieldData?.location);
      const image = safe(editingFieldData?.image || "");

      if (!name || !location)
        return setFieldFormError("Nombre y ubicación son obligatorios.");

      const nameExists = fields.some(
        (f) =>
          f.name.toLowerCase() === name.toLowerCase() &&
          f._id !== editingFieldData._id
      );
      if (nameExists)
        return setFieldFormError("Ya existe una cancha con ese nombre.");

      const payload = { name, location, image };
      setSavingField(true);

      if (editingFieldData._id) {
        await updateField(token, editingFieldData._id, payload);
        setFeedback({ variant: "success", text: "Cancha actualizada." });
      } else {
        await createField(token, payload);
        setFeedback({ variant: "success", text: "Cancha creada." });
      }

      const updatedFields = await getFields();
      setFields(updatedFields);
      closeFieldModal();
    } catch (e) {
      setSavingField(false);
      setFieldFormError(e.message || "No se pudo guardar la cancha.");
    }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta cancha?")) return;
    try {
      await deleteField(token, id);
      const fieldData = await getFields();
      setFields(fieldData);
      setFeedback({ variant: "success", text: "Cancha eliminada." });
    } catch (err) {
      setFeedback({
        variant: "danger",
        text: err.message || "Error al eliminar cancha.",
      });
    }
  };

  const openEditReservation = (r) => {
    setEditingReservationId(r._id);
    setEditingReservationData({
      field: r.field?._id || "",
      date: r.date || "",
      hour: toHHmm(r.hour || ""),
      duration: r.duration ?? 60,
    });
    setReservationFormError("");
    setReservationModalOpen(true);
  };

  const closeReservationModal = () => {
    if (savingReservation) return;
    setReservationModalOpen(false);
    setEditingReservationId(null);
    setEditingReservationData({ field: "", date: "", hour: "" });
    setSavingReservation(false);
    setReservationFormError("");
  };

  const saveReservation = async () => {
    try {
      setReservationFormError("");

      const { field, date, hour, duration } = editingReservationData;

      const isValidDateFormat = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
      const isValidHourFormat = (s) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(s);
      const isValidHourStep = (s) =>
        isValidHourFormat(s) && (s.endsWith(":00") || s.endsWith(":30"));
      const isValidDuration = (d) => [30, 60].includes(Number(d));
      const isFutureDateTime = (dateStr, hourStr) => {
        if (!isValidDateFormat(dateStr) || !isValidHourFormat(hourStr))
          return false;
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

      if (!field || !date || !hour || duration == null) {
        return setReservationFormError("Todos los campos son obligatorios.");
      }
      if (!isValidDateFormat(date)) {
        return setReservationFormError(
          "Formato de fecha inválido (YYYY-MM-DD)."
        );
      }
      if (!isValidHourStep(hour)) {
        return setReservationFormError(
          "La hora debe ser un múltiplo de 30 minutos (HH:00 o HH:30)."
        );
      }
      if (!isValidDuration(duration)) {
        return setReservationFormError(
          "Duración inválida. Usa 30 o 60 minutos."
        );
      }
      if (!isFutureDateTime(date, hour)) {
        return setReservationFormError("La reserva debe ser en el futuro.");
      }

      const duplicated = reservations.some((r) => {
        return (
          r._id !== editingReservationId &&
          r.field?._id === field &&
          r.date === date &&
          r.hour === hour
        );
      });
      if (duplicated) {
        return setReservationFormError("Ya existe una reserva en ese horario.");
      }

      setSavingReservation(true);

      const dataToSend = {
        field,
        date,
        hour,
        duration: Number(duration),
      };

      if (editingReservationId) {
        await updateReservation(token, editingReservationId, dataToSend);
        setFeedback({ variant: "success", text: "Reserva actualizada." });
      } else {
        await createReservation(token, dataToSend);
        setFeedback({ variant: "success", text: "Reserva creada." });
      }

      const updated = await getAllReservations(token);
      setReservations(updated);
      closeReservationModal();
    } catch (e) {
      setSavingReservation(false);
      setReservationFormError(e.message || "No se pudo guardar la reserva");
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!token) {
      setFeedback({
        variant: "danger",
        text: "Token inválido. Inicia sesión de nuevo.",
      });
      return;
    }

    if (!window.confirm("¿Seguro que quieres cancelar esta reserva?")) return;

    try {
      setFeedback({ variant: "info", text: "Cancelando reserva..." });

      await deleteReservation(token, id);

      const updated = await getAllReservations(token);
      setReservations(updated);

      setFeedback({ variant: "success", text: "Reserva cancelada." });
    } catch (err) {
      setFeedback({
        variant: "danger",
        text: err.message || "Error al cancelar la reserva.",
      });
    }
  };

  if (user?.role !== "admin") {
    return <p>⛔ No tenés permiso para ver esta sección.</p>;
  }

  const reservationsByUser = Object.entries(
    reservations.reduce((acc, r) => {
      const email = r.user?.email || "desconocido";
      acc[email] = (acc[email] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section>
      <h2 className="mb-3">🛠️ Panel de Administración</h2>

      {feedback && (
        <Alert
          variant={feedback.variant}
          onClose={() => setFeedback(null)}
          dismissible
        >
          {feedback.text}
        </Alert>
      )}

      {loading && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <Spinner animation="border" size="sm" />
          <span>Cargando…</span>
        </div>
      )}

      <section className="mb-4 ">
        <Stack direction="horizontal" className="mb-2" gap={2}>
          <h3 className="mb-0">📦 Productos</h3>
          <Badge bg="secondary">{products.length}</Badge>

          <Button
            size="sm"
            variant="warning"
            className="ms-auto m-2"
            onClick={() => {
              setEditingProductData({
                name: "",
                price: "",
                description: "",
                stock: 0,
                image: "",
                currentImage: null
              });
              setProductFormError("");
              setProductModalOpen(true);
            }}
          >
            ➕ Añadir producto
          </Button>
        </Stack>

        {products.length === 0 ? (
          <p className="text-muted">No hay productos.</p>
        ) : (
          <Table striped hover responsive size="sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th style={{ width: 140 }}>Precio</th>
                <th style={{ width: 160 }} className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td className="text-end">
                    <Stack
                      direction="horizontal"
                      gap={2}
                      className="justify-content-end"
                    >
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => openEditProduct(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteProduct(p._id)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="mb-4">
        <Stack direction="horizontal" className="mb-2" gap={2}>
          <h3 className="mb-0">🏟️ Canchas</h3>
          <Badge bg="secondary">{fields.length}</Badge>
          <Button
            variant="warning"
            size="sm"
            className="ms-auto m-2"
            onClick={() => {
              setEditingFieldData({
                name: "",
                location: "",
                image: "",
              });
              setFieldFormError("");
              setFieldModalOpen(true);
            }}
          >
            ➕ Añadir cancha
          </Button>
        </Stack>

        {fields.length === 0 ? (
          <p className="text-muted">No hay canchas disponibles.</p>
        ) : (
          <Table striped hover responsive size="sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th style={{ width: 160 }} className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.location}</td>
                  <td className="text-end">
                    <Stack
                      direction="horizontal"
                      gap={2}
                      className="justify-content-end"
                    >
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => openEditField(f)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteField(f._id)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="mb-4">
        <Stack direction="horizontal" className="mb-2" gap={2}>
          <h3 className="mb-0">🏟️ Reservas</h3>
          <Badge bg="secondary">{reservations.length}</Badge>
          <Button
            size="sm"
            variant="warning"
            className="ms-auto m-2"
            onClick={() => {
              setEditingReservationId(null);
              setEditingReservationData({
                field: "",
                date: "",
                hour: "",
                duration: 60,
              });
              setReservationFormError("");
              setReservationModalOpen(true);
            }}
          >
            ➕ Añadir reserva
          </Button>
        </Stack>

        {reservations.length === 0 ? (
          <p className="text-muted">No hay reservas registradas.</p>
        ) : (
          <Table striped hover responsive size="sm">
            <thead>
              <tr>
                <th>Cancha</th>
                <th style={{ width: 120 }}>Fecha</th>
                <th style={{ width: 100 }}>Hora</th>
                <th>Usuario</th>
                <th style={{ width: 180 }} className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r.field?.name}</td>
                  <td>{r.date}</td>
                  <td>{r.hour}</td>
                  <td>{r.user?.email || "desconocido"}</td>
                  <td className="text-end">
                    <Stack
                      direction="horizontal"
                      gap={2}
                      className="justify-content-end"
                    >
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => openEditReservation(r)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteReservation(r._id)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="mb-4">
        <h4>👥 Reservas por usuario</h4>
        {reservationsByUser.length === 0 ? (
          <p className="text-muted">Sin datos.</p>
        ) : (
          <Table bordered responsive size="sm">
            <thead>
              <tr>
                <th>Usuario</th>
                <th style={{ width: 120 }}>Reservas</th>
              </tr>
            </thead>
            <tbody>
              {reservationsByUser.map(([email, count]) => (
                <tr key={email}>
                  <td>{email}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <ProductModal
        show={productModalOpen}
        onHide={closeProductModal}
        productData={editingProductData}
        onChange={handleProductChange}
        onSave={saveProduct}
        saving={savingProduct}
        error={productFormError}
      />
      <FieldModal
        show={fieldModalOpen}
        onHide={closeFieldModal}
        fieldData={editingFieldData}
        onChange={handleFieldChange}
        onSave={saveField}
        saving={savingField}
        error={fieldFormError}
      />
      <ReservationModal
        show={reservationModalOpen}
        onHide={closeReservationModal}
        reservationData={editingReservationData}
        isEditing={!!editingReservationId}
        onChange={(key, value) =>
          setEditingReservationData((prev) => ({ ...prev, [key]: value }))
        }
        onSave={saveReservation}
        saving={savingReservation}
        error={reservationFormError}
        fields={fields}
      />
    </section>
  );
};

export default Admin;
