import { useTranslation } from "react-i18next";
import { useSiteContent } from "../hooks/publicContent";

interface StatsValue {
  families: string;
  projects: string;
  volunteers: string;
  amount: string;
  amount_unit: string;
  updated_at: string;
}

export default function ResultsBanner() {
  const { t } = useTranslation();
  const stats = useSiteContent<StatsValue>("stats");

  return (
    <section className="results">
      <div className="container">
        <span className="eyebrow">{t("results.eyebrow")}</span>
        <h2>{t("results.title")}</h2>

        <div className="stat-grid">
          <div className="stat">
            <div className="num">{stats.pick("families", "1,842")}</div>
            <div className="label">{t("results.stat1Label")}</div>
          </div>
          <div className="stat">
            <div className="num">{stats.pick("projects", "126")}</div>
            <div className="label">{t("results.stat2Label")}</div>
          </div>
          <div className="stat">
            <div className="num">
              {stats.pick("volunteers", "340")}
              <span className="unit">{t("results.stat3Unit")}</span>
            </div>
            <div className="label">{t("results.stat3Label")}</div>
          </div>
          <div className="stat">
            <div className="num">
              {stats.pick("amount", "8.4")}
              <span className="unit">
                {stats.pick("amount_unit", t("results.stat4Unit"))}
              </span>
            </div>
            <div className="label">{t("results.stat4Label")}</div>
          </div>
        </div>

        <div className="footnote">
          <span>
            {stats.data?.updated_at
              ? `Datos al ${stats.data.updated_at}`
              : t("results.footnoteDate")}
          </span>
          <a
            href="#donar"
            style={{
              color: "#fff",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            {t("results.footnoteLink")}
          </a>
        </div>
      </div>
    </section>
  );
}
