import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BrandMark from "./BrandMark";

export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand" style={{ color: "#fff" }}>
              <BrandMark useLogo size={44} />
              <div className="brand-text">
                <strong style={{ color: "#fff" }}>
                  Fundación Manos Unidas
                </strong>
                <small>{t("header.brandSubtitle")}</small>
              </div>
            </Link>
            <p
              className="footer-tagline"
              style={{ whiteSpace: "pre-line" }}
            >
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4>{t("footer.explore")}</h4>
            <Link to="/#inicio">{t("footer.links.inicio")}</Link>
            <Link to="/#nosotros">{t("footer.links.nosotros")}</Link>
            <Link to="/#proyectos">{t("footer.links.proyectos")}</Link>
            <Link to="/#testimonios">{t("footer.links.testimonios")}</Link>
          </div>
          <div>
            <h4>{t("footer.participate")}</h4>
            <Link to="/#donar">{t("footer.links.donar")}</Link>
            <Link to="/#registro">{t("footer.links.voluntariado")}</Link>
            <Link to="/#registro">{t("footer.links.aliado")}</Link>
            <Link to="/#registro">{t("footer.links.postular")}</Link>
          </div>
          <div>
            <h4>{t("footer.legal")}</h4>
            <a href="#privacidad">{t("footer.links.privacidad")}</a>
            <a href="#terminos">{t("footer.links.terminos")}</a>
            <a href="#informe">{t("footer.links.informe")}</a>
            <a href="#estatutos">{t("footer.links.estatutos")}</a>
          </div>
          <div>
            <h4>{t("footer.contact")}</h4>
            <Link to="/#contacto">hola@manosunidaspeac.mx</Link>
            <Link to="/#contacto">+52 222 123 4567</Link>
            <Link to="/#contacto">Puebla, Pue. MX</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t("footer.copyright")}</span>
          <span className="sat-mark">
            <span className="dot" />
            {t("footer.satMark")}
          </span>
        </div>
      </div>
    </footer>
  );
}
