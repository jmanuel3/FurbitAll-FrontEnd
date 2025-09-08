const API = `${import.meta.env.VITE_API_URL}/ads`;

export const getAds = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("No se pudieron obtener los anuncios");
  const data = await res.json();

  return (Array.isArray(data) ? data : [])
    .filter((a) => a?.active !== false && a?.image)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};
