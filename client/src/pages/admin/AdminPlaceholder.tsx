interface Props {
  title: string;
  description: string;
}

export default function AdminPlaceholder({ title, description }: Props) {
  return (
    <div style={{ maxWidth: 720 }}>
      <span className="eyebrow">Módulo en construcción</span>
      <h1
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "16px 0 12px",
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.55 }}>
        {description}
      </p>

      <div
        style={{
          marginTop: 32,
          padding: 24,
          background: "#fff",
          border: "1px dashed var(--line)",
          borderRadius: "var(--radius-lg)",
          color: "var(--muted)",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Disponible en la siguiente entrega
      </div>
    </div>
  );
}
