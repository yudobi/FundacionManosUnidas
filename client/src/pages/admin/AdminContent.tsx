import { useEffect, useState, type FormEvent } from "react";
import { useSiteContent, useUpdateSiteKey } from "../../hooks/adminQueries";
import type { SiteText } from "../../api/admin/siteinfo";

type FieldType = "text" | "textarea" | "list" | "number";

interface FieldSpec {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

interface KeySpec {
  key: string;
  title: string;
  description: string;
  fields: FieldSpec[];
}

const SECTIONS: KeySpec[] = [
  {
    key: "mission",
    title: "Misión",
    description: "Una o dos oraciones que definen el propósito de la fundación.",
    fields: [{ name: "body", label: "Texto de la misión", type: "textarea" }],
  },
  {
    key: "vision",
    title: "Visión",
    description: "La sociedad que la fundación quiere construir.",
    fields: [{ name: "body", label: "Texto de la visión", type: "textarea" }],
  },
  {
    key: "values",
    title: "Valores",
    description: "Lista de valores, uno por línea.",
    fields: [{ name: "items", label: "Valores (uno por línea)", type: "list" }],
  },
  {
    key: "stats",
    title: "Estadísticas",
    description: "Los 4 números del banner de Resultados.",
    fields: [
      { name: "families", label: "Familias acompañadas", type: "text" },
      { name: "projects", label: "Proyectos completados", type: "text" },
      { name: "volunteers", label: "Voluntarios activos", type: "text" },
      { name: "amount", label: "Monto recaudado", type: "text" },
      { name: "amount_unit", label: "Unidad del monto", type: "text" },
      { name: "updated_at", label: "Fecha de corte", type: "text" },
    ],
  },
  {
    key: "bank",
    title: "Datos bancarios SPEI",
    description: "Información para donar por transferencia o depósito.",
    fields: [
      { name: "bank", label: "Banco", type: "text" },
      { name: "beneficiary", label: "Beneficiario", type: "text" },
      { name: "account", label: "Cuenta", type: "text" },
      { name: "clabe", label: "CLABE SPEI", type: "text" },
      { name: "rfc", label: "RFC", type: "text" },
      { name: "email", label: "Correo para comprobantes", type: "text" },
    ],
  },
  {
    key: "office",
    title: "Oficina y contacto",
    description: "Dirección física, horario y correos.",
    fields: [
      { name: "address", label: "Dirección", type: "textarea" },
      { name: "hours", label: "Horario", type: "textarea" },
      { name: "phone", label: "Teléfono", type: "text" },
      { name: "contact_email", label: "Correo general", type: "text" },
      { name: "donations_email", label: "Correo donaciones", type: "text" },
    ],
  },
];

function valueToString(v: unknown): string {
  if (Array.isArray(v)) return v.join("\n");
  if (v === null || v === undefined) return "";
  return String(v);
}

function stringToValue(s: string, type: FieldType): unknown {
  if (type === "list") {
    return s
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
  return s;
}

function findEntry(data: SiteText[] | undefined, key: string): SiteText | undefined {
  return data?.find((d) => d.key === key);
}

interface SectionFormProps {
  spec: KeySpec;
  entry: SiteText | undefined;
}

function SectionForm({ spec, entry }: SectionFormProps) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const update = useUpdateSiteKey(spec.key);

  useEffect(() => {
    if (!entry) return;
    const initial: Record<string, string> = {};
    for (const f of spec.fields) {
      initial[f.name] = valueToString(entry.value[f.name]);
    }
    setDraft(initial);
  }, [entry, spec]);

  function setVal(name: string, value: string) {
    setDraft((d) => ({ ...d, [name]: value }));
    setSavedMsg(null);
    setErrMsg(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSavedMsg(null);
    setErrMsg(null);
    const value: Record<string, unknown> = {};
    for (const f of spec.fields) {
      value[f.name] = stringToValue(draft[f.name] ?? "", f.type);
    }
    try {
      await update.mutateAsync({ value });
      setSavedMsg("Cambios guardados.");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Error al guardar.");
    }
  }

  return (
    <form
      onSubmit={handleSave}
      style={{
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {spec.title}
        </h3>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.4,
          }}
        >
          {spec.description}
        </p>
      </div>

      {spec.fields.map((f) => (
        <div className="field" key={f.name}>
          <label htmlFor={`${spec.key}-${f.name}`}>{f.label}</label>
          {f.type === "textarea" || f.type === "list" ? (
            <textarea
              id={`${spec.key}-${f.name}`}
              rows={f.type === "list" ? 5 : 4}
              value={draft[f.name] ?? ""}
              onChange={(e) => setVal(f.name, e.target.value)}
              placeholder={f.placeholder}
            />
          ) : (
            <input
              id={`${spec.key}-${f.name}`}
              type={f.type === "number" ? "number" : "text"}
              value={draft[f.name] ?? ""}
              onChange={(e) => setVal(f.name, e.target.value)}
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}

      {savedMsg && (
        <p
          style={{
            padding: "8px 12px",
            background: "var(--green-soft)",
            color: "var(--green-dark)",
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 12,
          }}
          role="status"
        >
          ✓ {savedMsg}
        </p>
      )}
      {errMsg && (
        <p
          style={{
            padding: "8px 12px",
            background: "var(--red-soft)",
            color: "var(--red-dark)",
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 12,
          }}
          role="alert"
        >
          {errMsg}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-red"
        disabled={update.isPending}
        style={{ marginTop: 8 }}
      >
        {update.isPending ? "Guardando…" : "Guardar cambios →"}
      </button>
    </form>
  );
}

export default function AdminContent() {
  const { data, isLoading, isError } = useSiteContent();

  return (
    <div style={{ maxWidth: 900 }}>
      <span className="eyebrow blue">Contenido editable</span>
      <h1
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "12px 0 12px",
        }}
      >
        Contenido del sitio
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--ink-soft)",
          lineHeight: 1.55,
          marginBottom: 28,
          maxWidth: 620,
        }}
      >
        Cambios en Misión, Visión, Valores, números del banner, banco y oficina.
        Los cambios se aplican inmediatamente en el sitio público.
      </p>

      {isError && (
        <p
          style={{
            padding: "12px 14px",
            background: "var(--red-soft)",
            color: "var(--red-dark)",
            borderRadius: 8,
          }}
        >
          No pudimos cargar el contenido. Verifica el servidor Django.
        </p>
      )}

      {isLoading ? (
        <p style={{ color: "var(--muted)" }}>Cargando…</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 20,
          }}
        >
          {SECTIONS.map((spec) => (
            <SectionForm
              key={spec.key}
              spec={spec}
              entry={findEntry(data, spec.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
