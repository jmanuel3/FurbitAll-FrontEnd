const API = `${import.meta.env.VITE_API_URL}/reservations`;

const baseHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getAllReservations = async (token) => {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener reservas");
  return res.json();
};

export const createReservation = async (token, payload) => {
  const body = JSON.stringify({
    field: payload.field,
    date: payload.date,
    hour: payload.hour,
    duration: Number(payload.duration),
  });

  const res = await fetch(API, {
    method: "POST",
    headers: baseHeaders(token),
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear reserva");
  }
  return res.json();
};

export const updateReservation = async (token, id, payload) => {
  const body = JSON.stringify({
    ...(payload.field !== undefined && { field: payload.field }),
    ...(payload.date !== undefined && { date: payload.date }),
    ...(payload.hour !== undefined && { hour: payload.hour }),
    ...(payload.duration !== undefined && {
      duration: Number(payload.duration),
    }),
  });

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: baseHeaders(token),
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al actualizar reserva");
  }
  return res.json();
};

export const deleteReservation = async (token, id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar reserva");
  }
  return res.json();
};

export const getMyReservations = async (token) => {
  const res = await fetch(`${API}/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener tus reservas");
  }
  return res.json();
};

export const getReservedHours = async (token, fieldId, date) => {
  const url = `${API}/availability?field=${fieldId}&date=${date}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener horas reservadas");
  }
  const data = await res.json();
  return data.getReservedHours || [];
};

export const cancelReservation = deleteReservation;
