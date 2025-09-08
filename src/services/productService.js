const API = `${import.meta.env.VITE_API_URL}/products`;

export const getProducts = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
};

export const createProduct = async (token, productData) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al crear producto");
  }

  return await res.json();
};

export const updateProduct = async (token, id, data) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al actualizar producto");
  }

  return await res.json();
};

export const deleteProduct = async (token, id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al eliminar producto");
  }

  return await res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Producto no encontrado");
  }
  return await res.json();
};

export const decrementStockBulk = async (items, token) => {
  const API = `${import.meta.env.VITE_API_URL}/products/stock/bulk`;
  const res = await fetch(API, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ items }),
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const message =
      payload?.message ||
      (res.status === 401
        ? "Tu sesión ha expirado. Inicia sesión de nuevo."
        : res.status === 409
        ? "Stock insuficiente en uno o más productos."
        : "No se pudo actualizar el stock");
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload; 
};
