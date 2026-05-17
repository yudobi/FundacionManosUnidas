import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BrandMark from "./BrandMark";

const NAV_KEYS = [
  { hash: "#inicio", key: "nav.inicio" },
  { hash: "#nosotros", key: "nav.nosotros" },
  { hash: "#proyectos", key: "nav.proyectos" },
  { hash: "#testimonios", key: "nav.testimonios" },
  { hash: "#registro", key: "nav.registro" },
  { hash: "#contacto", key: "nav.contacto" },
] as const;

export default function SiteHeader() {
  const { t, i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language ?? "es").slice(0, 2);

  function changeLang(lng: "es" | "en") {
    void i18n.changeLanguage(lng);
  }

  return (
    <header className="site-header">
      <a
        href="#main"
        style={{
          position: "absolute",
          left: -9999,
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.left = "16px";
          el.style.top = "16px";
          el.style.width = "auto";
          el.style.height = "auto";
          el.style.padding = "10px 14px";
          el.style.background = "var(--ink)";
          el.style.color = "#fff";
          el.style.borderRadius = "8px";
          el.style.zIndex = "100";
          el.style.fontFamily = "var(--font-mono)";
          el.style.fontSize = "12px";
        }}
        onBlur={(e) => {
          const el = e.currentTarget;
          el.style.left = "-9999px";
          el.style.width = "1px";
          el.style.height = "1px";
          el.style.padding = "0";
        }}
      >
        {t("header.skipToContent")}
      </a>
      <div className="container bar">
        <Link to="/" className="brand">
          <BrandMark useLogo size={40} />
          <div className="brand-text">
            <strong>Fundación Manos Unidas</strong>
            <small>{t("header.brandSubtitle")}</small>
          </div>
        </Link>

        <nav className="site-nav">
          {NAV_KEYS.map((item) => (
            <Link key={item.hash} to={`/${item.hash}`}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div
            className="lang-toggle"
            role="group"
            aria-label={t("header.langGroup")}
          >
            <button
              type="button"
              className={current === "es" ? "active" : ""}
              onClick={() => changeLang("es")}
            >
              ES
            </button>
            <button
              type="button"
              className={current === "en" ? "active" : ""}
              onClick={() => changeLang("en")}
            >
              EN
            </button>
          </div>
          <Link
            to="/admin/login"
            className="header-signin"
            style={{
              fontSize: 13,
              color: "var(--ink)",
              textDecoration: "none",
              padding: "8px 4px",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            {t("header.signIn")}
          </Link>
          <Link to="/#donar" className="btn btn-red">
            {t("header.donateNow")}
          </Link>
        </div>
      </div>
    </header>
  );
}
