import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRegistrationMutation } from "../hooks/queries";

const ROLE_IDS = ["donante", "voluntario", "familia", "aliado"] as const;
const ROLE_KEYS = [
  { id: "donante", key: "01" },
  { id: "voluntario", key: "02" },
  { id: "familia", key: "03" },
  { id: "aliado", key: "04" },
] as const;
type RoleId = (typeof ROLE_IDS)[number];

const STATE_IDS = ["puebla", "cdmx", "tlaxcala", "otro"] as const;

export default function RegisterSection() {
  const { t } = useTranslation();
  const [role, setRole] = useState<RoleId>("donante");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const registration = useRegistrationMutation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    registration.mutate({ name, email, role });
  }

  return (
    <section className="section register-section" id="registro">
      <div className="container">
        <div className="register-grid">
          <div className="register-aside">
            <span className="eyebrow blue">{t("register.eyebrow")}</span>
            <h2>
              {t("register.titleStart")} <em>{t("register.titleEm")}</em>{" "}
              {t("register.titleEnd")}
            </h2>
            <p
              style={{
                marginTop: 24,
                fontSize: 16,
                lineHeight: 1.55,
                color: "var(--ink-soft)",
                maxWidth: 480,
              }}
            >
              {t("register.lead")}
            </p>

            <div className="role-list">
              {ROLE_KEYS.map((r) => (
                <div
                  key={r.id}
                  className={`role-card${role === r.id ? " active" : ""}`}
                  onClick={() => setRole(r.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setRole(r.id);
                    }
                  }}
                >
                  <div className="role-key">
                    <span>{r.key}</span>
                    <span>●</span>
                  </div>
                  <h4>{t(`register.roles.${r.id}.title`)}</h4>
                  <p>{t(`register.roles.${r.id}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="divider-mono">{t("register.form.title")}</div>
            <div className="field-row">
              <div className="field">
                <label>{t("register.form.name")}</label>
                <input
                  type="text"
                  placeholder={t("register.form.namePh")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label>{t("register.form.lastName")}</label>
                <input
                  type="text"
                  placeholder={t("register.form.lastNamePh")}
                />
              </div>
            </div>
            <div className="field">
              <label>{t("register.form.email")}</label>
              <input
                type="email"
                placeholder={t("register.form.emailPh")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("register.form.state")}</label>
                <select defaultValue="puebla">
                  {STATE_IDS.map((s) => (
                    <option key={s} value={s}>
                      {t(`register.states.${s}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{t("register.form.city")}</label>
                <input type="text" placeholder={t("register.form.cityPh")} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("register.form.password")}</label>
                <input
                  type="password"
                  placeholder={t("register.form.passwordPh")}
                />
              </div>
              <div className="field">
                <label>{t("register.form.passwordConfirm")}</label>
                <input
                  type="password"
                  placeholder={t("register.form.passwordConfirmPh")}
                />
              </div>
            </div>

            <label className="field-check">
              <input type="checkbox" defaultChecked />
              <span>
                {t("register.form.termsBefore")}{" "}
                <a href="#aviso">{t("register.form.termsPrivacy")}</a>{" "}
                {t("register.form.termsAnd")}{" "}
                <a href="#terminos">{t("register.form.termsTerms")}</a>
                {t("register.form.termsAfter")}
              </span>
            </label>

            <button
              type="submit"
              className="btn btn-red btn-lg btn-block"
              disabled={registration.isPending}
            >
              {registration.isPending
                ? t("register.form.submitting")
                : t("register.form.submit")}
            </button>

            {registration.isSuccess && (
              <p
                style={{
                  marginTop: 14,
                  color: "var(--green-dark)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {t("register.form.success", {
                  id: registration.data?.id ?? "",
                })}
              </p>
            )}
            {registration.isError && (
              <p
                style={{
                  marginTop: 14,
                  color: "var(--red)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {t("register.form.error")}
              </p>
            )}

            <p className="signin-note">
              {t("register.form.signInQuestion")}{" "}
              <Link to="/admin/login">{t("register.form.signInLink")}</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
