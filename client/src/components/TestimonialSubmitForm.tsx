import { useState, type FormEvent } from "react";
import { useSubmitTestimonial } from "../hooks/adminQueries";

/**
 * Botón "Comparte tu historia" que despliega un formulario público.
 * Tras enviar, el testimonio queda en estado `pending` para que el admin
 * lo apruebe desde el panel.
 */
export default function TestimonialSubmitForm() {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [accent, setAccent] = useState<"red" | "blue">("blue");
  const [photo, setPhoto] = useState<File | null>(null);

  const submit = useSubmitTestimonial();

  function roleToAuthorType(
    r: string,
  ): "DONANTE" | "VOLUNTARIO" | "BENEFICIARIO" | "ALIADO" | "PARTICIPANTE" {
    const k = r.trim().toLowerCase();
    if (k.startsWith("donan")) return "DONANTE";
    if (k.startsWith("volunt")) return "VOLUNTARIO";
    if (k.startsWith("benefic") || k.startsWith("famili")) return "BENEFICIARIO";
    if (k.startsWith("aliad")) return "ALIADO";
    return "PARTICIPANTE";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit.mutate(
      {
        quote: quote.trim(),
        name: name.trim(),
        authorType: roleToAuthorType(role),
        submitter_email: email.trim(),
        photo,
      },
      {
        onSuccess: () => {
          setQuote("");
          setName("");
          setRole("");
          setEmail("");
          setPhoto(null);
        },
      },
    );
  }
  // `accent` queda como estado para el UI del formulario aunque el backend
  // lo asigna automáticamente según author_type. Lo conservamos para no
  // romper el preview/preselector de color en el formulario.
  void accent;
  void setAccent;

  if (!open) {
    return (
      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          className="btn btn-ghost btn-lg"
          onClick={() => setOpen(true)}
        >
          Comparte tu historia →
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 40,
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div className="divider-mono">Cuéntanos tu experiencia</div>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              maxWidth: 540,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Tu testimonio queda en revisión. Si lo publicamos, te
            avisaremos al correo que nos compartas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--bg-soft)",
            color: "var(--ink)",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Tu testimonio (mínimo 20 caracteres)</label>
          <textarea
            rows={4}
            required
            minLength={20}
            maxLength={2000}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Cuéntanos cómo te ha acompañado la fundación…"
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Tu nombre</label>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre y apellido"
            />
          </div>
          <div className="field">
            <label>Tu rol o relación</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Donante · Voluntario · Familia…"
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Correo (opcional, no se publica)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.mx"
            />
          </div>
          <div className="field">
            <label>Acento de tarjeta</label>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value as "red" | "blue")}
            >
              <option value="blue">Azul</option>
              <option value="red">Rojo</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Foto (opcional)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
          {photo && (
            <span
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "var(--muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {photo.name} · {(photo.size / 1024).toFixed(0)} KB
            </span>
          )}
        </div>

        {submit.isSuccess && (
          <p
            style={{
              padding: "10px 14px",
              background: "var(--green-soft)",
              color: "var(--green-dark)",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 14,
            }}
            role="status"
          >
            ✓ {submit.data?.detail ??
              "Gracias por compartir tu historia. La revisaremos en menos de 48 h."}
          </p>
        )}
        {submit.isError && (
          <p
            style={{
              padding: "10px 14px",
              background: "var(--red-soft)",
              color: "var(--red-dark)",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 14,
            }}
            role="alert"
          >
            No pudimos enviar tu testimonio. Revisa los datos o intenta más
            tarde.
          </p>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-red"
            disabled={submit.isPending}
          >
            {submit.isPending ? "Enviando…" : "Enviar testimonio →"}
          </button>
        </div>
      </form>
    </div>
  );
}
