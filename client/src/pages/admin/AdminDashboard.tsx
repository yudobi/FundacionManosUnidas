import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

interface Card {
  title: string;
  to: string;
  desc: string;
  status: "ready" | "coming";
}

const CARDS: Card[] = [
  {
    title: "Proyectos",
    to: "/admin/proyectos",
    desc: "Crear, editar y archivar proyectos. Subir fotos a la galería antes/después.",
    status: "ready",
  },
  {
    title: "Testimonios",
    to: "/admin/testimonios",
    desc: "Aprobar o rechazar los testimonios enviados por la comunidad.",
    status: "ready",
  },
  {
    title: "Contenido del sitio",
    to: "/admin/contenido",
    desc: "Editar Misión, Visión, Valores, resultados, banco y contacto.",
    status: "ready",
  },
  {
    title: "Usuarios registrados",
    to: "/admin/usuarios",
    desc: "Listar donantes, voluntarios, familias y aliados. Cambiar roles.",
    status: "ready",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 900 }}>
      <span className="eyebrow blue">Panel de administración</span>
      <h1
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(36px, 4.5vw, 56px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "16px 0 12px",
        }}
      >
        Bienvenida, {user?.first_name || user?.username}.
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.55,
          color: "var(--ink-soft)",
          maxWidth: 620,
          marginBottom: 36,
        }}
      >
        Desde aquí podrás administrar el contenido público del sitio de la
        Fundación Manos Unidas P.E.A.C. Las próximas entregas habilitarán los
        módulos de cada tarjeta.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            style={{
              display: "block",
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
              textDecoration: "none",
              color: "var(--ink)",
              transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 18px 40px -22px rgba(10,15,31,0.22)";
              e.currentTarget.style.borderColor = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--line)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                {c.title}
              </h3>
              <span
                className="chip"
                style={{
                  background:
                    c.status === "ready" ? "var(--green-soft)" : "var(--bg-soft)",
                  color:
                    c.status === "ready" ? "var(--green-dark)" : "var(--muted)",
                }}
              >
                {c.status === "ready" ? "Listo" : "Próximamente"}
              </span>
            </div>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.5,
                color: "var(--ink-soft)",
                margin: 0,
              }}
            >
              {c.desc}
            </p>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: 48,
          padding: 20,
          background: "var(--blue-soft)",
          color: "var(--blue)",
          borderRadius: "var(--radius)",
          fontSize: 13.5,
          lineHeight: 1.5,
        }}
      >
        <strong>Acción pendiente:</strong> esta cuenta usa la contraseña
        placeholder. Cámbiala desde la terminal con{" "}
        <code
          style={{
            fontFamily: "var(--font-mono)",
            background: "rgba(30,58,138,0.12)",
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          python manage.py changepassword admin
        </code>{" "}
        antes de salir a producción.
      </div>
    </div>
  );
}
