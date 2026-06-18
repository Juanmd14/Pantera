"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ padding: "48px 24px", maxWidth: 560 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Algo salió mal</h2>
      <p style={{ opacity: 0.7, marginBottom: 24, fontSize: 14 }}>
        {error.message || "Error desconocido."}
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: "10px 20px",
          border: "1px solid currentColor",
          background: "transparent",
          cursor: "pointer",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontSize: 12,
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
