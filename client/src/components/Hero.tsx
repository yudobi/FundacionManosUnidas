import { useTranslation } from "react-i18next";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { heroImages } from "../data/projects";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="eyebrow red">{t("hero.eyebrow")}</span>
            <h1>
              {t("hero.titleLine1")}<br />
              <em>{t("hero.titleManos")}</em> {t("hero.titlePara")}<br />
              <span className="blue-word">{t("hero.titleDar")}</span>{" "}
              {t("hero.titleEnd")}
            </h1>
            <p className="lead">{t("hero.lead")}</p>
            <div className="hero-ctas">
              <a href="#donar" className="btn btn-red btn-lg">
                {t("hero.ctaDonate")}
              </a>
              <a href="#proyectos" className="btn btn-ghost btn-lg">
                {t("hero.ctaProjects")}
              </a>
            </div>
            <div className="hero-meta">
              <span className="pill">{t("hero.metaPill")}</span>
              <span>{t("hero.metaAudit")}</span>
            </div>
          </div>

          <div className="hero-visual" aria-label={t("hero.visualAria")}>
            <div
              className="v-collage"
              style={{ position: "relative", height: "100%" }}
            >
              <div className="accent-red" aria-hidden="true" />
              <PhotoPlaceholder
                src={heroImages.primary}
                alt={t("hero.photo1Alt")}
                tint="blue"
                tag="01"
                label={t("hero.photo1Label")}
                className="p1"
              />
              <PhotoPlaceholder
                src={heroImages.secondary}
                alt={t("hero.photo2Alt")}
                tint="red"
                tag="02"
                label={t("hero.photo2Label")}
                className="p2"
              />
              <PhotoPlaceholder
                src={heroImages.tertiary}
                alt={t("hero.photo3Alt")}
                tag="03"
                label={t("hero.photo3Label")}
                className="p3"
              />
              <div className="accent-blue" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
