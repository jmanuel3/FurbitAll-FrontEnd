export const api = async (url, options) => {
  const res = await fetch(url, options);

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Error en la petición");
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
};
