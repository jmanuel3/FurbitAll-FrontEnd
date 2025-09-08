const API = `${import.meta.env.VITE_API_URL}/fields`;

export const getFields = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error al cargar canchas");
  return await res.json();
};

export const createField = async (token, fieldData) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fieldData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al crear cancha");
  }

  return await res.json();
};

export const updateField = async (token, id, fieldData) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fieldData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al actualizar cancha");
  }

  return await res.json();
};

export const deleteField = async (token, id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al eliminar cancha");
  }

  return await res.json();
};
