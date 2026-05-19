import { useState } from "react";
import {
  useActivateUser,
  useAdminUsers,
  useDeactivateUser,
  useDeleteUser,
  useSetUserRole,
} from "../../hooks/adminQueries";
import type { Role } from "../../api/auth";

const ROLE_OPTIONS: { value: Role | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "ADMIN", label: "Administradores" },
  { value: "DONANTE", label: "Donantes" },
  { value: "VOLUNTARIO", label: "Voluntarios" },
  { value: "BENEFICIARIO", label: "Beneficiarios" },
  { value: "ALIADO", label: "Aliados" },
];

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  DONANTE: "Donante",
  VOLUNTARIO: "Voluntario",
  BENEFICIARIO: "Beneficiario",
  ALIADO: "Aliado",
};

const ROLE_BG: Record<Role, string> = {
  ADMIN: "var(--ink)",
  DONANTE: "var(--blue)",
  VOLUNTARIO: "var(--green)",
  BENEFICIARIO: "var(--red)",
  ALIADO: "#6B21A8",
};

export default function AdminUsers() {
  const [role, setRoleFilter] = useState<Role | "">("");
  const [q, setQ] = useState("");

  const { data: users = [], isLoading, isError } = useAdminUsers({
    role: role || undefined,
    q: q || undefined,
  });

  const setRoleMut = useSetUserRole();
  const deactivate = useDeactivateUser();
  const activate = useActivateUser();
  const del = useDeleteUser();
  const [confirmDel, setConfirmDel] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 1100 }}>
      <span className="eyebrow blue">Cuentas registradas</span>
      <h1
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "12px 0 20px",
        }}
      >
        Usuarios
      </h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {ROLE_OPTIONS.map((o) => (
            <button
              key={o.value || "all"}
              type="button"
              onClick={() => setRoleFilter(o.value)}
              className={role === o.value ? "active" : ""}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 13,
                border: "1px solid var(--line)",
                background: role === o.value ? "var(--ink)" : "transparent",
                color: role === o.value ? "#fff" : "var(--muted)",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar email o nombre…"
          style={{
            flex: "1 1 200px",
            minWidth: 0,
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 14,
          }}
        />
      </div>

      {isError && (
        <p
          style={{
            padding: "12px 14px",
            background: "var(--red-soft)",
            color: "var(--red-dark)",
            borderRadius: 8,
          }}
        >
          No pudimos cargar los usuarios.
        </p>
      )}

      {isLoading ? (
        <p style={{ color: "var(--muted)" }}>Cargando…</p>
      ) : users.length === 0 ? (
        <div
          style={{
            padding: 32,
            border: "1px dashed var(--line)",
            borderRadius: "var(--radius-lg)",
            background: "#fff",
            textAlign: "center",
            color: "var(--muted)",
          }}
        >
          No hay usuarios que coincidan con el filtro.
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 640,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg-soft)" }}>
                {["Usuario", "Rol", "Estado", "Registro", "Acciones"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: "1px solid var(--line)",
                    opacity: u.is_active ? 1 : 0.55,
                  }}
                >
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>
                      {u.first_name || u.last_name
                        ? `${u.first_name} ${u.last_name}`.trim()
                        : u.username}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        fontFamily: "var(--font-mono)",
                        marginTop: 2,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {u.email}
                    </div>
                    {(u.phone || u.city) && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          marginTop: 4,
                        }}
                      >
                        {[u.city, u.country].filter(Boolean).join(", ")}
                        {u.phone && ` · ${u.phone}`}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 12, width: 200 }}>
                    <select
                      value={u.role}
                      onChange={(e) =>
                        setRoleMut.mutate({
                          id: u.id,
                          role: e.target.value as Role,
                        })
                      }
                      disabled={u.is_superuser || setRoleMut.isPending}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid var(--line)",
                        background: ROLE_BG[u.role],
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                        <option key={r} value={r} style={{ color: "var(--ink)" }}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                    {u.is_superuser && (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 10,
                          color: "var(--muted)",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Superusuario
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      className="chip"
                      style={{
                        background: u.is_active ? "var(--green-soft)" : "var(--bg-soft)",
                        color: u.is_active ? "var(--green-dark)" : "var(--muted)",
                        border: "none",
                      }}
                    >
                      {u.is_active ? "Activo" : "Desactivado"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: 12,
                      fontSize: 12,
                      color: "var(--muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {new Date(u.date_joined).toLocaleDateString("es-MX")}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    {u.is_active ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => deactivate.mutate(u.id)}
                        disabled={u.is_superuser || deactivate.isPending}
                        style={{ padding: "5px 12px", fontSize: 12 }}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => activate.mutate(u.id)}
                        disabled={activate.isPending}
                        style={{
                          padding: "5px 12px",
                          fontSize: 12,
                          background: "var(--green)",
                          color: "#fff",
                        }}
                      >
                        Activar
                      </button>
                    )}{" "}
                    <button
                      type="button"
                      onClick={() => setConfirmDel(u.id)}
                      disabled={u.is_superuser}
                      style={{
                        padding: "5px 12px",
                        fontSize: 12,
                        background: "transparent",
                        color: "var(--red)",
                        border: "1px solid var(--red-soft)",
                        borderRadius: 999,
                        opacity: u.is_superuser ? 0.3 : 1,
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDel && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmDel(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,15,31,0.55)",
            display: "grid",
            placeItems: "center",
            padding: 20,
            zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              padding: 28,
              maxWidth: 440,
              width: "100%",
            }}
          >
            <h3 style={{ margin: 0 }}>Eliminar usuario</h3>
            <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-soft)" }}>
              Borrar al usuario es permanente. Si solo quieres bloquearlo,
              prefiere &ldquo;Desactivar&rdquo;.
            </p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setConfirmDel(null)}
                disabled={del.isPending}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-red"
                onClick={() =>
                  del.mutate(confirmDel, {
                    onSettled: () => setConfirmDel(null),
                  })
                }
                disabled={del.isPending}
              >
                {del.isPending ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
