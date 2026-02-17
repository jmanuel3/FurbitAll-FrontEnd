import { useEffect } from "react";

export default function AppToast({ show, onClose, text, variant = "success" }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  const isError = variant === "danger";

  return (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        minWidth: "280px",
        maxWidth: "400px",
        background: isError ? "#e53e3e" : "#48bb78",
        color: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        overflow: "hidden",
        animation: "slideIn 0.3s ease",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          fontWeight: 700,
        }}
      >
        <span>{isError ? "Error" : "Éxito"}</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "1.25rem",
            lineHeight: 1,
            opacity: 0.8,
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div style={{ padding: "0.875rem 1rem", fontSize: "0.95rem" }}>
        {text}
      </div>
    </div>
  );
}
