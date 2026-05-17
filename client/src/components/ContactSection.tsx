import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { office as officeDefaults } from "../data/bank";
import { useContactMutation } from "../hooks/queries";
import { useSiteContent } from "../hooks/publicContent";

interface OfficeValue {
  address: string;
  hours: string;
  phone: string;
  contact_email: string;
  donations_email: string;
}

const SUBJECT_IDS = [
  "voluntario",
  "alianza",
  "postular",
  "prensa",
  "otro",
] as const;
type SubjectId = (typeof SUBJECT_IDS)[number];

export default function ContactSection() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<SubjectId>("voluntario");
  const [message, setMessage] = useState("");

  const contact = useContactMutation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    contact.mutate({
      name,
      email,
      subject: t(`contact.subjects.${subject}`),
      message,
    });
  }

  // Prefer backend-edited values; fall back to i18n; fall back to data/bank.ts.
  const officeRemote = useSiteContent<OfficeValue>("office");
  const officeAddress = officeRemote.pick(
    "address",
    t("contact.info.officeAddress", { defaultValue: officeDefaults.address }),
  );
  const officeHours = officeRemote.pick(
    "hours",
    t("contact.info.officeHours", { defaultValue: officeDefaults.hours }),
  );
  const office = {
    address: officeAddress,
    hours: officeHours,
    phone: officeRemote.pick("phone", officeDefaults.phone),
    contactEmail: officeRemote.pick(
      "contact_email",
      officeDefaults.contactEmail,
    ),
    donationsEmail: officeRemote.pick(
      "donations_email",
      officeDefaults.donationsEmail,
    ),
  };

  return (
    <section className="section" id="contacto">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow red">{t("contact.eyebrow")}</span>
            <h2 style={{ marginTop: 20 }}>
              <em>{t("contact.title")}</em>
            </h2>
          </div>
          <p className="head-lead">{t("contact.lead")}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-block">
              <span className="k">{t("contact.info.office")}</span>
              <span className="v" style={{ whiteSpace: "pre-line" }}>
                {officeAddress}
              </span>
            </div>
            <div className="info-block">
              <span className="k">{t("contact.info.hours")}</span>
              <span className="v" style={{ whiteSpace: "pre-line" }}>
                {officeHours}
              </span>
            </div>
            <div className="info-block">
              <span className="k">{t("contact.info.phone")}</span>
              <span className="v mono">{office.phone}</span>
            </div>
            <div className="info-block">
              <span className="k">{t("contact.info.email")}</span>
              <span className="v mono">{office.contactEmail}</span>
            </div>
            <div className="info-block">
              <span className="k">{t("contact.info.donations")}</span>
              <span className="v mono">{office.donationsEmail}</span>
            </div>
            <div className="info-block">
              <span className="k">{t("contact.info.socials")}</span>
              <div className="contact-socials" style={{ marginTop: 8 }}>
                <a className="social-pill" href="#instagram">
                  <span className="sdot" />
                  Instagram
                </a>
                <a className="social-pill" href="#facebook">
                  <span className="sdot" />
                  Facebook
                </a>
                <a className="social-pill" href="#tiktok">
                  <span className="sdot" />
                  TikTok
                </a>
                <a className="social-pill" href="#youtube">
                  <span className="sdot" />
                  YouTube
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="divider-mono">{t("contact.form.title")}</div>
            <div className="field-row">
              <div className="field">
                <label>{t("contact.form.name")}</label>
                <input
                  type="text"
                  placeholder={t("contact.form.namePh")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label>{t("contact.form.email")}</label>
                <input
                  type="email"
                  placeholder={t("contact.form.emailPh")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label>{t("contact.form.subject")}</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectId)}
              >
                {SUBJECT_IDS.map((s) => (
                  <option key={s} value={s}>
                    {t(`contact.subjects.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t("contact.form.message")}</label>
              <textarea
                rows={6}
                placeholder={t("contact.form.messagePh")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-blue btn-lg btn-block"
              disabled={contact.isPending}
            >
              {contact.isPending
                ? t("contact.form.submitting")
                : t("contact.form.submit")}
            </button>

            {contact.isSuccess && (
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
                {t("contact.form.success")}
              </p>
            )}
            {contact.isError && (
              <p
                style={{
                  marginTop: 14,
                  color: "var(--red)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {t("contact.form.error")}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
